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

pub fn invalid() -> ContractAddress {
    contract_address_const::<'INVALID'>()
}

pub fn deploy_token(name: ByteArray, symbol: ByteArray, initial_supply: u256, recipient: ContractAddress) -> ContractAddress {
    let contract = declare("ERC20Upgradeable").unwrap();
    let mut constructor_calldata = Default::default();
    Serde::serialize(@name, ref constructor_calldata);
    Serde::serialize(@symbol, ref constructor_calldata);
    Serde::serialize(@initial_supply, ref constructor_calldata);
    Serde::serialize(@recipient, ref constructor_calldata);
    let (contract_address, _) = contract.deploy(@constructor_calldata).unwrap();

    contract_address
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
    ticket_payment_token: ContractAddress,
    reveal_config: RevealConfig
) -> ContractAddress {
    let contract = declare("FourDraw").unwrap();
    let mut constructor_calldata = Default::default();
    Serde::serialize(@randomness_contract, ref constructor_calldata);
    Serde::serialize(@ticket_payment_token, ref constructor_calldata);
    Serde::serialize(@reveal_config, ref constructor_calldata);
    let (contract_address, _) = contract.deploy(@constructor_calldata).unwrap();

    contract_address
}