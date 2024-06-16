use starknet::ContractAddress;

#[derive(Copy, Drop, Serde, starknet::Store)]
struct GameInfo {
    ticket_price: u256,
    end_time: u64,
    result: u16,
    game_status: GameStatus,
    total_straight_prize_accumulated: u256,
    total_box_prize_accumulated: u256,
    total_mini_prize_accumulated: u256
}

#[derive(Copy, Drop, Serde, starknet::Store)]
struct PrizeInfo {
    total_straight_won: u256,
    total_box_won: u256,
    total_mini_won: u256,
    single_straight_prize: u256,
    single_box_prize: u256,
    single_mini_prize: u256
}

#[derive(Copy, Drop, Serde, starknet::Store)]
struct UserTicketInfo {
    picked: u16,
    claimed: bool,
    straight_amount: u256,
    box_amount: u256,
    set_amount: u256,
    mini_amount: u256
}

#[derive(Copy, Drop, Serde, starknet::Store)]
struct TicketCounter {
    straight_amount: u256,
    box_amount: u256,
    mini_amount: u256
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
    fn latest_game_round(self: @TContractState) -> u256;
    fn latest_tickets(self: @TContractState, account: ContractAddress) -> (u256, bool, UserTicketInfo, u256);

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
        picked: u16,
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
        GameStatus
    };
    use starknet::{
        ContractAddress,
        ClassHash,
        get_block_timestamp,
        get_caller_address,
        get_contract_address
    };
    use openzeppelin::{
        upgrades::{ UpgradeableComponent, interface::IUpgradeable },
        access::ownable::OwnableComponent,
        security::ReentrancyGuardComponent,
        token::erc20::interface::{ IERC20Dispatcher, IERC20DispatcherTrait }
    };
    use alexandria_sorting::MergeSort;
    use four_draw::randomness:: { IRandomnessDispatcher, IRandomnessDispatcherTrait };

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
        latest_game_round: u256,
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
        NewGameStarted: NewGameStarted,
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
    struct NewGameStarted {
        round: u256,
        ticket_price: u256,
        end_time: u64
    }

    #[derive(Drop, starknet::Event)]
    struct TicketsBought {
        account: ContractAddress,
        straight_amount: u256,
        box_amount: u256,
        set_amount: u256,
        mini_amount: u256
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
        ticket_payment_token: ContractAddress
    ) {
        self.randomness_contract.write(randomness_contract);
        self.ticket_payment_token.write(ticket_payment_token);
    }

    #[abi(embed_v0)]
    impl FourDrawImpl of super::IFourDraw<ContractState> {
        fn randomness_contract(self: @ContractState) -> ContractAddress {
            self.randomness_contract.read()
        }

        fn ticket_payment_token(self: @ContractState) -> ContractAddress {
            self.ticket_payment_token.read()
        }

        fn latest_game_round(self: @ContractState) -> u256 {
            self.latest_game_round.read()
        }

        fn latest_tickets(self: @ContractState, account: ContractAddress) -> (u256, bool, UserTicketInfo, u256) {
            self._latest_tickets(account)
        }

        fn start_new_game(ref self: ContractState, ticket_price: u256, end_time: u64) {
            self.ownable.assert_only_owner();
            let (round, info) = self._get_latest_game();
            assert(
                info.game_status == GameStatus::Ended || info.game_status == GameStatus::NotStarted,
                Errors::INVALID_GAME_STATUS
            );
            assert(get_block_timestamp() < end_time, Errors::INVALID_TIMESTAMP);
            

            // accumulate last round prize
            let new_game_round = round + 1;
            self.game_info.write(new_game_round, GameInfo {
                ticket_price: ticket_price,
                end_time: end_time,
                result: 0,
                game_status: GameStatus::Started,
                total_straight_prize_accumulated: 0,
                total_box_prize_accumulated: 0,
                total_mini_prize_accumulated: 0
            });
            
            self.emit(NewGameStarted { round: new_game_round, ticket_price: ticket_price, end_time: end_time });
        }

        fn request_reveal_result(ref self: ContractState, seed: u64) {
            self.reentrancy_guard.start();
            let (round, mut info) = self._get_latest_game();
            assert(info.game_status == GameStatus::Started, Errors::INVALID_GAME_STATUS);
            assert(info.end_time <= get_block_timestamp(), Errors::INVALID_TIMESTAMP);

            info.game_status = GameStatus::Revealing;
            
            // emit
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

            // emit
            self.reentrancy_guard.end();
        }

        fn buy_tickets(
            ref self: ContractState,
            picked: u16,
            straight_amount: u256,
            box_amount: u256,
            set_amount: u256,
            mini_amount: u256
        ) -> u256 {
            self.reentrancy_guard.start();
            let (round, mut info) = self._get_latest_game();
            assert(picked < 10000, Errors::INVALID_NUMBER);
            assert(info.game_status == GameStatus::Started, Errors::INVALID_GAME_STATUS);
            assert(info.end_time > get_block_timestamp(), Errors::INVALID_TIMESTAMP);
            let caller = get_caller_address();
            assert(self.user_latest_round.read(caller) == round, Errors::ALREADY_PICKED);

            self._claim_prize(caller);
            let straight_cost = info.ticket_price * (straight_amount + set_amount);
            let box_cost = info.ticket_price * (box_amount + set_amount);
            let mini_cost = info.ticket_price * mini_amount;
            let total_cost = straight_cost + box_cost + mini_cost;
            assert(total_cost > 0, Errors::INVALID_AMOUNT);
            IERC20Dispatcher { contract_address: self.ticket_payment_token.read() }.transfer_from(
                caller,
                get_contract_address(),
                total_cost
            );

            info.total_straight_prize_accumulated += straight_cost;
            info.total_box_prize_accumulated += box_cost;
            info.total_mini_prize_accumulated += mini_cost;
            self.game_info.write(round, info);

            let mut ticket_counter = self.ticket_counter.read((round, picked));
            ticket_counter.straight_amount += straight_amount + set_amount;
            ticket_counter.box_amount += box_amount + set_amount;
            ticket_counter.mini_amount += mini_amount;
            self.ticket_counter.write((round, picked), ticket_counter);

            self.emit(TicketsBought {
                account: caller,
                straight_amount: straight_amount,
                box_amount: box_amount,
                set_amount: set_amount,
                mini_amount: mini_amount
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
            let latest_info = self.game_info.read(latest_game_round);

            (latest_game_round, latest_info)
        }

        fn _latest_tickets(self: @ContractState, account: ContractAddress) -> (u256, bool, UserTicketInfo, u256) {
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
                if self._check_straight(game_info.result, user_tickets.picked) {
                    total_prize += (user_tickets.straight_amount + user_tickets.set_amount) * prize_info.single_straight_prize;
                }
                if self._check_box(game_info.result, user_tickets.picked) {
                    total_prize += (user_tickets.box_amount + user_tickets.set_amount) * prize_info.single_box_prize;
                }
                if self._check_mini(game_info.result, user_tickets.picked) {
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
            let (round, _, mut tickets, unclaimed_prize) = self._latest_tickets(account);
            if unclaimed_prize > 0 {
                IERC20Dispatcher { contract_address: self.ticket_payment_token.read() }.transfer(account, unclaimed_prize);
                tickets.claimed = true;
                self.user_tickets.write((account, round), tickets);

                self.emit(PrizeClaimed { account: account, round: round, prize: unclaimed_prize });
            }
            
            unclaimed_prize
        }

        fn _check_straight(self: @ContractState, result: u16, picked: u16) -> bool {
            result == picked
        }

        fn _check_box(self: @ContractState, result: u16, picked: u16) -> bool {
            self._number_to_digits(result) == self._number_to_digits(picked)
        }

        fn _check_mini(self: @ContractState, result: u16, picked: u16) -> bool {
            result % 1000 == picked % 1000
        }

        fn _number_to_digits(self: @ContractState, mut number: u16) -> Array<u16> {
            let mut digits = ArrayTrait::new();
            let mut i: u256 = 0;
            while i < 4 {
                digits.append(number % 10);
                number /= 10;

                i += 1;
            };

            MergeSort::sort(digits.span())
        }
    }
}