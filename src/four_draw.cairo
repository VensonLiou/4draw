use starknet::ContractAddress;

#[derive(Copy, Drop, Serde, starknet::Store)]
struct GameInfo {
    ticket_price: u256,
    end_time: u64,
    result: u16,
    game_status: GameStatus,
    total_straight_accumulated: u256,
    total_box_accumulated: u256,
    total_mini_accumulated: u256
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
    fn unclaimed_balance(self: @TContractState, account: ContractAddress) -> u256;

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
        straight_amount: u256,
        box_amount: u256,
        mini_amount: u256
    ) -> u256;
    fn claim_balance(ref self: TContractState) -> u256;
}

#[starknet::contract]
mod FourDraw {
    use super::{
        GameInfo,
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
    }

    #[storage]
    struct Storage {
        randomness_contract: ContractAddress,
        ticket_payment_token: ContractAddress,
        latest_game_round: u256,
        game_info: LegacyMap::<u256, GameInfo>,
        ticket_price: u256,
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

        fn unclaimed_balance(self: @ContractState, account: ContractAddress) -> u256 {
            1
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
                total_straight_accumulated: 0,
                total_box_accumulated: 0,
                total_mini_accumulated: 0
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
            straight_amount: u256,
            box_amount: u256,
            mini_amount: u256
        ) -> u256 {
            self.reentrancy_guard.start();

            // emit
            self.reentrancy_guard.end();
            1
        }

        fn claim_balance(ref self: ContractState) -> u256 {
            self.reentrancy_guard.start();

            // emit
            self.reentrancy_guard.end();
            1
        }
    }

    #[generate_trait]
    impl InternalFunctions of InternalFunctionsTrait {
        fn _get_latest_game(self: @ContractState) -> (u256, GameInfo) {
            let latest_game_round = self.latest_game_round.read();
            let latest_info = self.game_info.read(latest_game_round);

            (latest_game_round, latest_info)
        }

        fn _calculate_balance(self: @ContractState) -> u256 {
            1
        }
    }
}