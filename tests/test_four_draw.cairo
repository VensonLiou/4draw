use starknet::{ ContractAddress };
use openzeppelin::token::erc20::interface::{ IERC20Dispatcher, IERC20DispatcherTrait };
use four_draw::{
    four_draw::{ IFourDrawDispatcher, IFourDrawDispatcherTrait, RevealConfig, FourDraw::Errors },
    randomness::{ IRandomnessDispatcher, IRandomnessDispatcherTrait }
};
use snforge_std::{
    start_cheat_caller_address,
    stop_cheat_caller_address,
    cheat_caller_address_global,
    stop_cheat_caller_address_global,
    cheat_block_number_global 
};
use super::utils::{ owner, user1, user2, invalid, deploy_four_draw, deploy_randomness, deploy_two_tokens };

fn setup() -> (IFourDrawDispatcher, IRandomnessDispatcher, IERC20Dispatcher) {
    let owner = owner();
    let user1 = user1();
    let user2 = user2();
    let initial_supply: u256 = 4000000000;

    let (token, randomness_payment_token) = deploy_two_tokens(initial_supply);
    let randomness = deploy_randomness(randomness_payment_token, 1);
    let four_draw = deploy_four_draw(randomness, token);

    let four_draw_dispatcher = IFourDrawDispatcher { contract_address: four_draw };
    let randomness_dispatcher = IRandomnessDispatcher { contract_address: randomness };
    let token_dispatcher = IERC20Dispatcher { contract_address: token };
    let randomness_payment_token_dispatcher = IERC20Dispatcher { contract_address: randomness_payment_token };

    cheat_caller_address_global(owner);
    randomness_payment_token_dispatcher.transfer(four_draw, initial_supply);
    token_dispatcher.transfer(user1, initial_supply / 2);
    token_dispatcher.transfer(user2, initial_supply / 2);
    stop_cheat_caller_address_global();

    (four_draw_dispatcher, randomness_dispatcher, token_dispatcher)
}

#[test]
fn test_deployment_correctness() {
    let (four_draw_dispatcher, randomness_dispatcher, token_dispatcher) = setup();
    assert(four_draw_dispatcher.randomness_contract().into() != 0, '4draw not deployed properly');
    assert(randomness_dispatcher.payment_token().into() != 0, 'payment token is zero');
    assert(token_dispatcher.total_supply() != 0, 'token not deployed properly');
}