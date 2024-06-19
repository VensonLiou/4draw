use starknet::ContractAddress;

#[starknet::interface]
pub trait IRandomness<TContractState> {
    fn get_payment_token(self: @TContractState) -> ContractAddress;
    fn request_random(
        ref self: TContractState,
        seed: u64,
        callback_address: ContractAddress,
        callback_fee_limit: u128,
        publish_delay: u64,
        num_words: u64,
        calldata: Array<felt252>
    ) -> u64;
    fn submit_random(
        ref self: TContractState,
        requestor_address: ContractAddress,
        request_id: u64,
        random_words: Span<felt252>,
        calldata: Array<felt252>
    );
}

#[starknet::contract]
mod Randomness {
    use starknet::{
        ContractAddress,
        get_caller_address,
        get_block_number,
        get_contract_address
    };
    use openzeppelin::token::erc20::interface::{ IERC20Dispatcher, IERC20DispatcherTrait };
    use four_draw::four_draw::{ IFourDrawDispatcher, IFourDrawDispatcherTrait };

    #[storage]
    struct Storage {
        payment_token: ContractAddress,
        fixed_fee: u256,
        request_id: LegacyMap::<ContractAddress, u64>,
        min_block: LegacyMap::<u64, u64>
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        payment_token: ContractAddress,
        fixed_fee: u256
    ) {
        self.payment_token.write(payment_token);
        self.fixed_fee.write(fixed_fee);
    }

    #[abi(embed_v0)]
    impl IRandomnessImpl of super::IRandomness<ContractState> {
        fn get_payment_token(self: @ContractState) -> ContractAddress {
            self.payment_token.read()
        }

        fn request_random(
            ref self: ContractState,
            seed: u64,
            callback_address: ContractAddress,
            callback_fee_limit: u128, //the max amount the user can pay for the callback
            publish_delay: u64,
            num_words: u64,
            calldata: Array<felt252>
        ) -> u64 {
            let caller_address = get_caller_address();
            let request_id = self.request_id.read(caller_address) + 1;
            self.request_id.write(caller_address, request_id);
            self.min_block.write(request_id, get_block_number() + publish_delay);
            let token_dispatcher = IERC20Dispatcher { contract_address: self.payment_token.read() };
            token_dispatcher.transfer_from(caller_address, get_contract_address(), self.fixed_fee.read());

            request_id
        }

        fn submit_random(
            ref self: ContractState,
            requestor_address: ContractAddress,
            request_id: u64,
            random_words: Span<felt252>,
            calldata: Array<felt252>
        ) {
            IFourDrawDispatcher{ contract_address: requestor_address }.receive_random_words(
                requestor_address,
                request_id,
                random_words,
                calldata.clone()
            );
        }
    }
}