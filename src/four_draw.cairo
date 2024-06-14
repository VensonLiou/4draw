use starknet::ContractAddress;

#[starknet::interface]
pub trait IFourDraw<TContractState> {
    fn receive_random_words(
        ref self: TContractState,
        requestor_address: ContractAddress,
        request_id: u64,
        random_words: Span<felt252>,
        calldata: Array<felt252>
    );
}

#[starknet::contract]
mod FourDraw {
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
        
    }

    #[storage]
    struct Storage {
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
        #[flat]
        UpgradeableEvent: UpgradeableComponent::Event,
        #[flat]
        OwnableEvent: OwnableComponent::Event,
        #[flat]
        ReentrancyGuardEvent: ReentrancyGuardComponent::Event
    }

    #[constructor]
    fn constructor(ref self: ContractState) {

    }

    #[abi(embed_v0)]
    impl FourDrawImpl of super::IFourDraw<ContractState> {
        fn receive_random_words(
            ref self: ContractState,
            requestor_address: ContractAddress,
            request_id: u64,
            random_words: Span<felt252>,
            calldata: Array<felt252>
        ) {
            self.reentrancy_guard.start();


            self.reentrancy_guard.end();
        }
    }

    #[generate_trait]
    impl InternalFunctions of InternalFunctionsTrait {
        
    }
}