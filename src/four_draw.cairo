use starknet::ContractAddress;

#[derive(Copy, Drop, Serde, starknet::Store)]
pub struct GameInfo {
    ticket_price: u256,
    end_time: u64,
    randomness_request_id: u64,
    result_number: u16,
    game_status: GameStatus,
    total_straight_prize_accumulated: u256,
    total_box_prize_accumulated: u256,
    total_mini_prize_accumulated: u256
}

#[derive(Copy, Drop, Serde, starknet::Store)]
pub struct PrizeInfo {
    total_straight_won: u256,
    total_box_won: u256,
    total_mini_won: u256,
    single_straight_prize: u256,
    single_box_prize: u256,
    single_mini_prize: u256
}

#[derive(Copy, Drop, Serde, starknet::Store)]
pub struct UserTicketInfo {
    picked_number: u16,
    claimed: bool,
    straight_amount: u256,
    box_amount: u256,
    set_amount: u256,
    mini_amount: u256
}

#[derive(Copy, Drop, Serde, starknet::Store)]
pub struct TicketCounter {
    straight_amount: u256,
    box_amount: u256,
    mini_amount: u256
}

#[derive(Copy, Drop, Serde, starknet::Store)]
pub struct RevealConfig {
    max_fee: u256,
    callback_fee_limit: u128,
    publish_delay: u64,
}

#[derive(PartialEq, Copy, Drop, Serde, starknet::Store)]
enum GameStatus {
    NotStarted,
    Started,
    Revealing,
    Ended
}

#[starknet::interface]
pub trait IFourDraw<TContractState> {
    fn randomness_contract(self: @TContractState) -> ContractAddress;
    fn ticket_payment_token(self: @TContractState) -> ContractAddress;
    fn reveal_config(self: @TContractState) -> RevealConfig;
    fn latest_game_round(self: @TContractState) -> u256;
    fn game_info(self: @TContractState, round: u256) -> GameInfo;
    fn ticket_counter(self: @TContractState, round: u256, picked_number: u16) -> TicketCounter;
    fn user_latest_round(self: @TContractState, account: ContractAddress) -> u256;
    fn user_tickets(self: @TContractState, account: ContractAddress, round: u256) -> UserTicketInfo;
    fn latest_tickets_result(self: @TContractState, account: ContractAddress) -> (u256, bool, UserTicketInfo, u256);
    fn setRevealConfig(ref self: TContractState, reveal_config: RevealConfig);
    fn start_new_game(ref self: TContractState, ticket_price: u256, end_time: u64);
    fn request_reveal_result(ref self: TContractState, seed: u64);
    fn receive_random_words(
        ref self: TContractState,
        requestor_address: ContractAddress,
        request_id: u64,
        random_words: Span<felt252>,
        calldata: Array<felt252>
    );
    fn buy_tickets(
        ref self: TContractState,
        picked_number: u16,
        straight_amount: u256,
        box_amount: u256,
        set_amount: u256,
        mini_amount: u256
    ) -> u256;
    fn claim_prize(ref self: TContractState) -> u256;
}

#[starknet::contract]
mod FourDraw {
    use super::{
        GameInfo,
        PrizeInfo,
        TicketCounter,
        UserTicketInfo,
        GameStatus,
        RevealConfig
    };
    use starknet::{
        ContractAddress,
        ClassHash,
        get_block_timestamp,
        get_caller_address,
        get_block_number,
        get_contract_address
    };
    use openzeppelin::{
        upgrades::{ UpgradeableComponent, interface::IUpgradeable },
        access::ownable::OwnableComponent,
        security::ReentrancyGuardComponent,
        token::erc20::interface::{ IERC20Dispatcher, IERC20DispatcherTrait }
    };
    use alexandria_sorting::MergeSort;
    use four_draw::randomness::{ IRandomnessDispatcher, IRandomnessDispatcherTrait };

    component!(path: UpgradeableComponent, storage: upgradeable, event: UpgradeableEvent);
    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);
    component!(path: ReentrancyGuardComponent, storage: reentrancy_guard, event: ReentrancyGuardEvent);

    #[abi(embed_v0)]
    impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;
    #[abi(embed_v0)]
    impl OwnableCamelOnlyImpl = OwnableComponent::OwnableCamelOnlyImpl<ContractState>;

    impl UpgradeableInternalImpl = UpgradeableComponent::InternalImpl<ContractState>;
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;
    impl ReentrancyGuardInternalImpl = ReentrancyGuardComponent::InternalImpl<ContractState>;

    #[abi(embed_v0)]
    impl UpgradeableImpl of IUpgradeable<ContractState> {
        fn upgrade(ref self: ContractState, new_class_hash: ClassHash) {
            self.ownable.assert_only_owner();
            self.upgradeable._upgrade(new_class_hash);
        }
    }

    mod Errors {
        pub const INVALID_GAME_STATUS: felt252 = 'invalid game status';
        pub const INVALID_TIMESTAMP: felt252 = 'invalid timestamp';
        pub const CALLER_NOT_RANDOMNESS_CONTRACT: felt252 = 'caller not randomness contract';
        pub const FULFILLMENT_DELAY_TOO_SHORT: felt252 = 'fulfillment delay too short';
        pub const INVALID_NUMBER: felt252 = 'invalid number';
        pub const ALREADY_PICKED: felt252 = 'already picked';
        pub const INVALID_AMOUNT: felt252 = 'invalid amount';
    }

    #[storage]
    struct Storage {
        randomness_contract: ContractAddress,
        ticket_payment_token: ContractAddress,
        reveal_config: RevealConfig,
        latest_game_round: u256,
        min_block_number: u64,
        game_info: LegacyMap::<u256, GameInfo>,
        prize_info: LegacyMap::<u256, PrizeInfo>,
        ticket_counter: LegacyMap::<(u256, u16), TicketCounter>,
        user_latest_round: LegacyMap::<ContractAddress, u256>,
        user_tickets: LegacyMap::<(ContractAddress, u256), UserTicketInfo>,
        #[substorage(v0)]
        upgradeable: UpgradeableComponent::Storage,
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
        #[substorage(v0)]
        reentrancy_guard: ReentrancyGuardComponent::Storage
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        RevealConfigUpdated: RevealConfigUpdated,
        NewGameStarted: NewGameStarted,
        GameRevealRequested: GameRevealRequested,
        GameRevealed: GameRevealed,
        TicketsBought: TicketsBought,
        PrizeClaimed: PrizeClaimed,
        #[flat]
        UpgradeableEvent: UpgradeableComponent::Event,
        #[flat]
        OwnableEvent: OwnableComponent::Event,
        #[flat]
        ReentrancyGuardEvent: ReentrancyGuardComponent::Event
    }

    #[derive(Drop, starknet::Event)]
    struct RevealConfigUpdated {
        reveal_config: RevealConfig
    }
    
    #[derive(Drop, starknet::Event)]
    struct NewGameStarted {
        round: u256,
        ticket_price: u256,
        end_time: u64
    }

    #[derive(Drop, starknet::Event)]
    struct GameRevealRequested {
        round: u256,
        request_id: u64
    }

    #[derive(Drop, starknet::Event)]
    struct GameRevealed {
        round: u256,
        result_number: u16
    }

    #[derive(Drop, starknet::Event)]
    struct TicketsBought {
        account: ContractAddress,
        ticket_info: UserTicketInfo,
        total_cost: u256
    }

    #[derive(Drop, starknet::Event)]
    struct PrizeClaimed {
        account: ContractAddress,
        round: u256,
        prize: u256 
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        randomness_contract: ContractAddress,
        ticket_payment_token: ContractAddress,
        reveal_config: RevealConfig,
        owner: ContractAddress
    ) {
        self.ownable.initializer(owner);

        self.randomness_contract.write(randomness_contract);
        self.ticket_payment_token.write(ticket_payment_token);
        self.reveal_config.write(reveal_config);
    }

    #[abi(embed_v0)]
    impl FourDrawImpl of super::IFourDraw<ContractState> {
        fn randomness_contract(self: @ContractState) -> ContractAddress {
            self.randomness_contract.read()
        }

        fn ticket_payment_token(self: @ContractState) -> ContractAddress {
            self.ticket_payment_token.read()
        }

        fn reveal_config(self: @ContractState) -> RevealConfig {
            self.reveal_config.read()
        }

        fn latest_game_round(self: @ContractState) -> u256 {
            self.latest_game_round.read()
        }

        fn game_info(self: @ContractState, round: u256) -> GameInfo {
            self.game_info.read(round)
        }

        fn ticket_counter(self: @ContractState, round: u256, picked_number: u16) -> TicketCounter {
            self.ticket_counter.read((round, picked_number))
        }

        fn user_latest_round(self: @ContractState, account: ContractAddress) -> u256 {
            self.user_latest_round.read(account)
        }

        fn user_tickets(self: @ContractState, account: ContractAddress, round: u256) -> UserTicketInfo {
            self.user_tickets.read((account, round))
        }

        fn latest_tickets_result(self: @ContractState, account: ContractAddress) -> (u256, bool, UserTicketInfo, u256) {
            self._latest_tickets_result(account)
        }

        fn setRevealConfig(ref self: ContractState, reveal_config: RevealConfig) {
            self.ownable.assert_only_owner();

            self.reveal_config.write(reveal_config);

            self.emit(RevealConfigUpdated { reveal_config: reveal_config });
        }

        fn start_new_game(ref self: ContractState, ticket_price: u256, end_time: u64) {
            self.ownable.assert_only_owner();
            let (round, game_info) = self._get_latest_game();
            assert(
                game_info.game_status == GameStatus::Ended || game_info.game_status == GameStatus::NotStarted,
                Errors::INVALID_GAME_STATUS
            );
            assert(get_block_timestamp() < end_time, Errors::INVALID_TIMESTAMP);
            
            let new_game_round = round + 1;
            let mut total_straight_prize_accumulated = 0;
            let mut total_box_prize_accumulated = 0;
            let mut total_mini_prize_accumulated = 0;
            if game_info.game_status == GameStatus::Ended {
                let prize_info = self.prize_info.read(round);
                if prize_info.total_straight_won == 0 {
                    total_straight_prize_accumulated += game_info.total_straight_prize_accumulated;
                }
                if prize_info.total_box_won == 0 {
                    total_box_prize_accumulated += game_info.total_box_prize_accumulated;
                }
                if prize_info.total_mini_won == 0 {
                    total_mini_prize_accumulated += game_info.total_mini_prize_accumulated;
                }
            }

            self.game_info.write(new_game_round, GameInfo {
                ticket_price: ticket_price,
                end_time: end_time,
                randomness_request_id: 0,
                result_number: 0,
                game_status: GameStatus::Started,
                total_straight_prize_accumulated: total_straight_prize_accumulated,
                total_box_prize_accumulated: total_box_prize_accumulated,
                total_mini_prize_accumulated: total_mini_prize_accumulated
            });
            self.latest_game_round.write(new_game_round);
            
            self.emit(NewGameStarted { round: new_game_round, ticket_price: ticket_price, end_time: end_time });
        }

        fn request_reveal_result(ref self: ContractState, seed: u64) {
            self.reentrancy_guard.start();
            let (round, mut game_info) = self._get_latest_game();
            assert(game_info.game_status == GameStatus::Started, Errors::INVALID_GAME_STATUS);
            assert(game_info.end_time <= get_block_timestamp(), Errors::INVALID_TIMESTAMP);

            let reveal_config = self.reveal_config.read();
            IERC20Dispatcher { contract_address: self.ticket_payment_token.read() }.approve(
                self.randomness_contract.read(),
                reveal_config.max_fee
            );
            let request_id = IRandomnessDispatcher { contract_address: self.randomness_contract.read() }.request_random(
                seed,
                get_contract_address(),
                reveal_config.callback_fee_limit,
                reveal_config.publish_delay,
                1,
                ArrayTrait::new()
            );
            game_info.game_status = GameStatus::Revealing;
            game_info.randomness_request_id = request_id;
            self.game_info.write(round, game_info);
            self.min_block_number.write(get_block_number() + reveal_config.publish_delay);
            
            self.emit(GameRevealRequested { round: round, request_id: request_id });
            self.reentrancy_guard.end();
        }

        fn receive_random_words(
            ref self: ContractState,
            requestor_address: ContractAddress,
            request_id: u64,
            random_words: Span<felt252>,
            calldata: Array<felt252>
        ) {
            self.reentrancy_guard.start();
            assert(get_caller_address() == self.randomness_contract.read(), Errors::CALLER_NOT_RANDOMNESS_CONTRACT);
            assert(self.min_block_number.read() <= get_block_number(), Errors::FULFILLMENT_DELAY_TOO_SHORT);

            let random_number: u16 = ((*random_words.at(0)).into() % 10000_u256).try_into().unwrap();
            let (round, mut game_info) = self._get_latest_game();
            let total_straight_won = self._total_straight_won(round, random_number);
            let total_box_won = self._total_box_won(round, self._number_to_sorted_digits(random_number));
            let total_mini_won = self._total_mini_won(round, random_number);

            self.prize_info.write(round, PrizeInfo {
                total_straight_won: total_straight_won,
                total_box_won: total_box_won,
                total_mini_won: total_mini_won,
                single_straight_prize: self._calculate_single_prize(total_straight_won, game_info.total_straight_prize_accumulated),
                single_box_prize: self._calculate_single_prize(total_box_won, game_info.total_box_prize_accumulated),
                single_mini_prize: self._calculate_single_prize(total_mini_won, game_info.total_mini_prize_accumulated),
            });
            game_info.game_status = GameStatus::Ended;
            game_info.result_number = random_number;
            self.game_info.write(round, game_info);

            self.emit(GameRevealed { round: round, result_number: random_number });
            self.reentrancy_guard.end();
        }

        fn buy_tickets(
            ref self: ContractState,
            picked_number: u16,
            straight_amount: u256,
            box_amount: u256,
            set_amount: u256,
            mini_amount: u256
        ) -> u256 {
            self.reentrancy_guard.start();
            let (round, mut game_info) = self._get_latest_game();
            assert(picked_number < 10000, Errors::INVALID_NUMBER);
            assert(game_info.game_status == GameStatus::Started, Errors::INVALID_GAME_STATUS);
            assert(game_info.end_time > get_block_timestamp(), Errors::INVALID_TIMESTAMP);
            let caller = get_caller_address();
            assert(self.user_latest_round.read(caller) == round, Errors::ALREADY_PICKED);

            self._claim_prize(caller);
            let straight_cost = game_info.ticket_price * (straight_amount + set_amount);
            let box_cost = game_info.ticket_price * (box_amount + set_amount);
            let mini_cost = game_info.ticket_price * mini_amount;
            let total_cost = straight_cost + box_cost + mini_cost;
            assert(total_cost > 0, Errors::INVALID_AMOUNT);
            IERC20Dispatcher { contract_address: self.ticket_payment_token.read() }.transfer_from(
                caller,
                get_contract_address(),
                total_cost
            );

            game_info.total_straight_prize_accumulated += straight_cost;
            game_info.total_box_prize_accumulated += box_cost;
            game_info.total_mini_prize_accumulated += mini_cost;
            self.game_info.write(round, game_info);

            let mut ticket_counter = self.ticket_counter.read((round, picked_number));
            ticket_counter.straight_amount += straight_amount + set_amount;
            ticket_counter.mini_amount += mini_amount;
            self.ticket_counter.write((round, picked_number), ticket_counter);

            let sorted_number = self._digits_to_number(self._number_to_sorted_digits(picked_number));
            let mut ticket_counter = self.ticket_counter.read((round, sorted_number));
            ticket_counter.box_amount += box_amount + set_amount;
            self.ticket_counter.write((round, sorted_number), ticket_counter);

            self.user_latest_round.write(caller, round);
            let ticket_info = UserTicketInfo { 
                picked_number: picked_number,
                claimed: false,
                straight_amount: straight_amount,
                box_amount: box_amount,
                set_amount: set_amount,
                mini_amount: mini_amount
            };
            self.user_tickets.write((caller, round), ticket_info);

            self.emit(TicketsBought {
                account: caller,
                ticket_info: ticket_info,
                total_cost: total_cost
            });
            self.reentrancy_guard.end();
            total_cost
        }

        fn claim_prize(ref self: ContractState) -> u256 {
            self.reentrancy_guard.start();

            let claimed_prize = self._claim_prize(get_caller_address());

            self.reentrancy_guard.end();
            claimed_prize
        }
    }

    #[generate_trait]
    impl InternalFunctions of InternalFunctionsTrait {
        fn _get_latest_game(self: @ContractState) -> (u256, GameInfo) {
            let latest_game_round = self.latest_game_round.read();
            let latest_game_info = self.game_info.read(latest_game_round);

            (latest_game_round, latest_game_info)
        }

        fn _latest_tickets_result(self: @ContractState, account: ContractAddress) -> (u256, bool, UserTicketInfo, u256) {
            let user_latest_round = self.user_latest_round.read(account);
            let user_tickets = self.user_tickets.read((account, user_latest_round));
            let game_info = self.game_info.read(user_latest_round);
            let revealed = if game_info.game_status == GameStatus::Ended {
                true
            }
            else {
                false
            };
            let unclaimed_prize = if revealed && !user_tickets.claimed {
                let prize_info = self.prize_info.read(user_latest_round);
                let mut total_prize = 0;
                if self._check_straight(game_info.result_number, user_tickets.picked_number) {
                    total_prize += (user_tickets.straight_amount + user_tickets.set_amount) * prize_info.single_straight_prize;
                }
                if self._check_box(game_info.result_number, user_tickets.picked_number) {
                    total_prize += (user_tickets.box_amount + user_tickets.set_amount) * prize_info.single_box_prize;
                }
                if self._check_mini(game_info.result_number, user_tickets.picked_number) {
                    total_prize += user_tickets.mini_amount * prize_info.single_mini_prize;
                }

                total_prize
            }
            else {
                0
            };

            (user_latest_round, revealed, user_tickets, unclaimed_prize)
        }

        fn _claim_prize(ref self: ContractState, account: ContractAddress) -> u256 {
            let (round, _, mut tickets, unclaimed_prize) = self._latest_tickets_result(account);
            if unclaimed_prize > 0 {
                IERC20Dispatcher { contract_address: self.ticket_payment_token.read() }.transfer(account, unclaimed_prize);
                tickets.claimed = true;
                self.user_tickets.write((account, round), tickets);

                self.emit(PrizeClaimed { account: account, round: round, prize: unclaimed_prize });
            }
            
            unclaimed_prize
        }

        fn _check_straight(self: @ContractState, result_number: u16, picked_number: u16) -> bool {
            result_number == picked_number
        }

        fn _check_box(self: @ContractState, result_number: u16, picked_number: u16) -> bool {
            self._number_to_sorted_digits(result_number) == self._number_to_sorted_digits(picked_number)
        }

        fn _check_mini(self: @ContractState, result_number: u16, picked_number: u16) -> bool {
            result_number % 1000 == picked_number % 1000
        }

        fn _total_straight_won(self: @ContractState, round: u256, result_number: u16) -> u256 {
            self.ticket_counter.read((round, result_number)).straight_amount
        }

        fn _total_box_won(self: @ContractState, round: u256, result_digits: Array<u16>) -> u256 {
            self.ticket_counter.read((round, self._digits_to_number(result_digits))).box_amount
        }

        fn _total_mini_won(self: @ContractState, round: u256, result_number: u16) -> u256 {
            let last_3_digits_number = result_number % 1000;
            let mut total_won = 0;
            let mut i: u16 = 0;
            while i < 10 {
                total_won += self.ticket_counter.read((round, last_3_digits_number + 1000 * i)).mini_amount;

                i += 1
            };

            total_won
        }

        fn _number_to_sorted_digits(self: @ContractState, mut number: u16) -> Array<u16> {
            let mut digits = ArrayTrait::new();
            let mut i: u256 = 0;
            while i < 4 {
                digits.append(number % 10);
                number /= 10;

                i += 1;
            };

            MergeSort::sort(digits.span())
        }

        fn _digits_to_number(self: @ContractState, digits: Array<u16>) -> u16 {
            *digits.at(3) * 1000 + *digits.at(2) * 100 + *digits.at(1) * 10 + *digits.at(0)
        }

        fn _calculate_single_prize(self: @ContractState, total_won: u256, total_prize_accumulated: u256) -> u256 {
            if total_won == 0 {
                0
            }
            else {
                total_prize_accumulated / total_won
            }
        }
    }
}