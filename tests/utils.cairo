use starknet::{
    ContractAddress,
    contract_address_const
};
use snforge_std::{ declare, ContractClassTrait };
use four_draw::four_draw::RevealConfig;

pub fn owner() -> ContractAddress {
    contract_address_const::<'OWNER'>()
}

pub fn user1() -> ContractAddress {
    contract_address_const::<'USER1'>()
}

pub fn user2() -> ContractAddress {
    contract_address_const::<'USER2'>()
}

pub fn deploy_two_tokens(initial_supply: u256) -> (ContractAddress, ContractAddress) {
    let owner = owner();
    let contract = declare("ERC20Upgradeable").unwrap();
    let name: ByteArray = "Token";
    let symbol: ByteArray = "TKN";
    let mut constructor_calldata = Default::default();
    Serde::serialize(@name, ref constructor_calldata);
    Serde::serialize(@symbol, ref constructor_calldata);
    Serde::serialize(@initial_supply, ref constructor_calldata);
    Serde::serialize(@owner, ref constructor_calldata);
    Serde::serialize(@owner, ref constructor_calldata);
    let (token0, _) = contract.deploy(@constructor_calldata).unwrap();
    let (token1, _) = contract.deploy(@constructor_calldata).unwrap();

    (token0, token1)
}

pub fn deploy_randomness(payment_token: ContractAddress, fixed_fee: u256) -> ContractAddress {
    let contract = declare("Randomness").unwrap();
    let mut constructor_calldata = Default::default();
    Serde::serialize(@payment_token, ref constructor_calldata);
    Serde::serialize(@fixed_fee, ref constructor_calldata);
    let (contract_address, _) = contract.deploy(@constructor_calldata).unwrap();

    contract_address
}

pub fn deploy_four_draw(
    randomness_contract: ContractAddress,
    ticket_payment_token: ContractAddress
) -> ContractAddress {
    let contract = declare("FourDraw").unwrap();
    let reveal_config = RevealConfig {
        max_fee: 1,
        callback_fee_limit: 1,
        publish_delay: 10
    };
    let mut constructor_calldata = Default::default();
    Serde::serialize(@randomness_contract, ref constructor_calldata);
    Serde::serialize(@ticket_payment_token, ref constructor_calldata);
    Serde::serialize(@reveal_config, ref constructor_calldata);
    Serde::serialize(@owner(), ref constructor_calldata);
    let (contract_address, _) = contract.deploy(@constructor_calldata).unwrap();

    contract_address
}