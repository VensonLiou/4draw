use starknet::{ ContractAddress, get_block_number };
use openzeppelin::token::erc20::interface::{ IERC20Dispatcher, IERC20DispatcherTrait };
use four_draw::{
    four_draw::{ IFourDrawDispatcher, IFourDrawDispatcherTrait, RevealConfig, GameStatus },
    randomness::{ IRandomnessDispatcher, IRandomnessDispatcherTrait }
};
use snforge_std::{
    start_cheat_caller_address,
    stop_cheat_caller_address,
    cheat_block_number_global,
    stop_cheat_block_number_global,
    cheat_block_timestamp_global,
    stop_cheat_block_timestamp_global
};
use super::utils::{ owner, user1, user2, deploy_four_draw, deploy_randomness, deploy_two_tokens };

fn setup() -> (IFourDrawDispatcher, IRandomnessDispatcher, IERC20Dispatcher, IERC20Dispatcher) {
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

    start_cheat_caller_address(randomness_payment_token, owner);
    randomness_payment_token_dispatcher.transfer(four_draw, initial_supply);
    stop_cheat_caller_address(randomness_payment_token);

    start_cheat_caller_address(token, owner);
    token_dispatcher.transfer(user1, initial_supply / 2);
    token_dispatcher.transfer(user2, initial_supply / 2);
    stop_cheat_caller_address(token);

    (four_draw_dispatcher, randomness_dispatcher, token_dispatcher, randomness_payment_token_dispatcher)
}

#[test]
fn test_deployment_correctness() {
    let (four_draw_dispatcher, randomness_dispatcher, token_dispatcher, randomness_payment_token_dispatcher) = setup();
    assert(four_draw_dispatcher.randomness_contract().into() != 0, '4draw not deployed properly');
    assert(randomness_dispatcher.get_payment_token().into() != 0, 'Payment token is zero');
    assert(token_dispatcher.total_supply() != 0, 'Token not deployed properly');
    assert(randomness_payment_token_dispatcher.total_supply() != 0, 'Token not deployed properly');
}

#[test]
fn test_randomness_contract_correctness() {
    let (four_draw_dispatcher, randomness_dispatcher, _, _) = setup();
    assert(four_draw_dispatcher.randomness_contract() == randomness_dispatcher.contract_address, 'Randomness contract incorrect');
}

#[test] 
fn test_randomness_payment_token_correctness() {
    let (four_draw_dispatcher, randomness_dispatcher, _, _) = setup();
    assert(four_draw_dispatcher.randomness_payment_token() == randomness_dispatcher.get_payment_token(), 'Randomness token incorrect');
}

#[test]
fn test_ticket_payment_token_correctness() {
    let (four_draw_dispatcher, _, token_dispatcher, _) = setup();
    assert(four_draw_dispatcher.ticket_payment_token() == token_dispatcher.contract_address, 'Ticket payment token incorrect');
}

#[test]
fn test_reveal_config_correctness() {
    let (four_draw_dispatcher, _, _, _) = setup();
    let reveal_config = four_draw_dispatcher.reveal_config();
    assert(reveal_config.max_fee == 1, 'Incorrect max fee');
    assert(reveal_config.callback_fee_limit == 1, 'Incorrect callback fee limit');
    assert(reveal_config.publish_delay == 10, 'Incorrect publish delay');
}

#[test]
#[should_panic(expected: ('Caller is not the owner', ))]
fn test_non_owner_set_reveal_config() {
    let (four_draw_dispatcher, _, _, _) = setup();
    let reveal_config = RevealConfig {
        max_fee: 2,
        callback_fee_limit: 2,
        publish_delay: 2
    };
    four_draw_dispatcher.set_reveal_config(reveal_config);
}

#[test]
fn test_owner_set_reveal_config() {
    let (four_draw_dispatcher, _, _, _) = setup();
    let reveal_config = RevealConfig {
        max_fee: 2,
        callback_fee_limit: 2,
        publish_delay: 2
    };

    start_cheat_caller_address(four_draw_dispatcher.contract_address, owner());
    four_draw_dispatcher.set_reveal_config(reveal_config);
    stop_cheat_caller_address(four_draw_dispatcher.contract_address);

    let reveal_config = four_draw_dispatcher.reveal_config();
    assert(reveal_config.max_fee == 2, 'Incorrect max fee');
    assert(reveal_config.callback_fee_limit == 2, 'Incorrect callback fee limit');
    assert(reveal_config.publish_delay == 2, 'Incorrect publish delay');
}

#[test]
#[should_panic(expected: ('Caller is not the owner', ))]
fn test_non_owner_start_new_game() {
    let (four_draw_dispatcher, _, _, _) = setup();
    four_draw_dispatcher.start_new_game(100, 9999);
}

#[test]
#[should_panic(expected: ('Invalid game status', ))]
fn test_owner_start_new_game_wrong_game_status() {
    let (four_draw_dispatcher, _, _, _) = setup();

    start_cheat_caller_address(four_draw_dispatcher.contract_address, owner());
    four_draw_dispatcher.start_new_game(100, 9999);
    four_draw_dispatcher.start_new_game(100, 99999);
    stop_cheat_caller_address(four_draw_dispatcher.contract_address);
}

#[test]
#[should_panic(expected: ('Invalid timestamp', ))]
fn test_owner_start_new_game_wrong_time() {
    let (four_draw_dispatcher, _, _, _) = setup();

    cheat_block_timestamp_global(10000);
    start_cheat_caller_address(four_draw_dispatcher.contract_address, owner());
    four_draw_dispatcher.start_new_game(100, 9999);
    stop_cheat_block_timestamp_global();
    stop_cheat_caller_address(four_draw_dispatcher.contract_address);
}

#[test]
fn test_owner_start_new_game() {
    let (four_draw_dispatcher, _, _, _) = setup();
    let ticket_price = 100;
    let end_time = 9999;

    start_cheat_caller_address(four_draw_dispatcher.contract_address, owner());
    four_draw_dispatcher.start_new_game(ticket_price, end_time);
    let latest_game_round = four_draw_dispatcher.latest_game_round();
    assert(latest_game_round == 1, 'Incorrect latest round');

    let game_info = four_draw_dispatcher.game_info(latest_game_round);
    assert(game_info.ticket_price == ticket_price, 'Incorrect ticket price');
    assert(game_info.end_time == end_time, 'Incorrent end time');
    assert(game_info.game_status == GameStatus::Started, 'Incorrect game status');
    stop_cheat_caller_address(four_draw_dispatcher.contract_address);
}

#[test]
#[should_panic(expected: ('Invalid game status', ))]
fn test_request_reveal_result_wrong_game_status() {
    let (four_draw_dispatcher, _, _, _) = setup();

    start_cheat_caller_address(four_draw_dispatcher.contract_address, owner());
    four_draw_dispatcher.request_reveal_result(0);
    stop_cheat_caller_address(four_draw_dispatcher.contract_address);
}

#[test]
#[should_panic(expected: ('Invalid timestamp', ))]
fn test_request_reveal_result_wrong_time() {
    let (four_draw_dispatcher, _, _, _) = setup();

    start_cheat_caller_address(four_draw_dispatcher.contract_address, owner());
    four_draw_dispatcher.start_new_game(100, 9999);
    stop_cheat_caller_address(four_draw_dispatcher.contract_address);

    four_draw_dispatcher.request_reveal_result(0);
}

#[test]
fn test_request_reveal_result() {
    let (four_draw_dispatcher, _, _, randomness_payment_token_dispatcher) = setup();

    start_cheat_caller_address(four_draw_dispatcher.contract_address, owner());
    four_draw_dispatcher.start_new_game(100, 9999);
    stop_cheat_caller_address(four_draw_dispatcher.contract_address);

    cheat_block_timestamp_global(10000);
    four_draw_dispatcher.request_reveal_result(0);
    let latest_game_round = four_draw_dispatcher.latest_game_round();
    let game_info = four_draw_dispatcher.game_info(latest_game_round);
    assert(game_info.game_status == GameStatus::Revealing, 'Incorrect game status');
    assert(game_info.randomness_request_id == 1, 'Incorrect request id');
    assert(
        randomness_payment_token_dispatcher.balance_of(four_draw_dispatcher.contract_address) == 4000000000 - 1,
        'Incorrect balance'
    );
    stop_cheat_block_timestamp_global();
}

#[test]
#[should_panic(expected: ('Invalid number', ))]
fn test_buy_ticket_invalid_pick() {
    let (four_draw_dispatcher, _, _, _) = setup();
    four_draw_dispatcher.buy_tickets(10000, 1, 1, 1, 1);
}

#[test]
#[should_panic(expected: ('Invalid game status', ))]
fn test_buy_ticket_wrong_game_status() {
    let (four_draw_dispatcher, _, _, _) = setup();
    four_draw_dispatcher.buy_tickets(1000, 1, 1, 1, 1);
}

#[test]
#[should_panic(expected: ('Invalid timestamp', ))]
fn test_buy_ticket_wrong_time() {
    let (four_draw_dispatcher, _, _, _) = setup();

    start_cheat_caller_address(four_draw_dispatcher.contract_address, owner());
    four_draw_dispatcher.start_new_game(100, 9999);
    stop_cheat_caller_address(four_draw_dispatcher.contract_address);

    cheat_block_timestamp_global(10000);
    four_draw_dispatcher.buy_tickets(1000, 1, 1, 1, 1);
    stop_cheat_block_timestamp_global();
}

#[test]
#[should_panic(expected: ('Already picked', ))]
fn test_buy_ticket_already_picked() {
    let (four_draw_dispatcher, _, token_dispatcher, _) = setup();

    start_cheat_caller_address(four_draw_dispatcher.contract_address, owner());
    four_draw_dispatcher.start_new_game(100, 9999);
    stop_cheat_caller_address(four_draw_dispatcher.contract_address);

    start_cheat_caller_address(token_dispatcher.contract_address, user1());
    token_dispatcher.approve(four_draw_dispatcher.contract_address, 4000000000);
    stop_cheat_caller_address(token_dispatcher.contract_address);

    start_cheat_caller_address(four_draw_dispatcher.contract_address, user1());
    four_draw_dispatcher.buy_tickets(1000, 1, 1, 1, 1);
    four_draw_dispatcher.buy_tickets(2000, 1, 1, 1, 1);
    stop_cheat_caller_address(four_draw_dispatcher.contract_address);
}

#[test]
#[should_panic(expected: ('Invalid amount', ))]
fn test_buy_ticket_wrong_amount() {
    let (four_draw_dispatcher, _, _, _) = setup();

    start_cheat_caller_address(four_draw_dispatcher.contract_address, owner());
    four_draw_dispatcher.start_new_game(100, 9999);
    stop_cheat_caller_address(four_draw_dispatcher.contract_address);

    four_draw_dispatcher.buy_tickets(1000, 0, 0, 0, 0);
}

#[test]
fn test_buy_ticket() {
    let (four_draw_dispatcher, _, token_dispatcher, _) = setup();
    let user1 = user1();
    let user2 = user2();
    let ticket_price = 100;

    start_cheat_caller_address(four_draw_dispatcher.contract_address, owner());
    four_draw_dispatcher.start_new_game(ticket_price, 9999);
    stop_cheat_caller_address(four_draw_dispatcher.contract_address);

    start_cheat_caller_address(token_dispatcher.contract_address, user1);
    token_dispatcher.approve(four_draw_dispatcher.contract_address, 4000000000);
    stop_cheat_caller_address(token_dispatcher.contract_address);

    start_cheat_caller_address(four_draw_dispatcher.contract_address, user1);
    four_draw_dispatcher.buy_tickets(2113, 2, 2, 2, 2);
    stop_cheat_caller_address(four_draw_dispatcher.contract_address);

    start_cheat_caller_address(token_dispatcher.contract_address, user2);
    token_dispatcher.approve(four_draw_dispatcher.contract_address, 4000000000);
    stop_cheat_caller_address(token_dispatcher.contract_address);

    start_cheat_caller_address(four_draw_dispatcher.contract_address, user2);
    four_draw_dispatcher.buy_tickets(1213, 4, 4, 4, 4);
    stop_cheat_caller_address(four_draw_dispatcher.contract_address);

    // game info check
    let round = four_draw_dispatcher.latest_game_round();
    let game_info = four_draw_dispatcher.game_info(round);
    assert(game_info.total_straight_prize_accumulated == ticket_price * 12, 'Incorrect straight accumulated');
    assert(game_info.total_box_prize_accumulated == ticket_price * 12, 'Incorrect box accumulated');
    assert(game_info.total_mini_prize_accumulated == ticket_price * 6, 'Incorrect mini accumulated');

    // tick counter check
    let ticket_counter = four_draw_dispatcher.ticket_counter(round, 2113);
    assert(ticket_counter.straight_amount == 4, 'Incorrect straight counter');
    assert(ticket_counter.mini_amount == 2, 'Incorrect mini counter');

    let ticket_counter = four_draw_dispatcher.ticket_counter(round, 1213);
    assert(ticket_counter.straight_amount == 8, 'Incorrect straight counter');
    assert(ticket_counter.mini_amount == 4, 'Incorrect mini counter');

    let ticket_counter = four_draw_dispatcher.ticket_counter(round, 3211);
    assert(ticket_counter.box_amount == 12, 'Incorrect box counter');

    // user ticket check
    let user1_ticket = four_draw_dispatcher.user_tickets(user1, round);
    let user2_ticket = four_draw_dispatcher.user_tickets(user2, round);
    assert(user1_ticket.picked_number == 2113, 'Incorrect picked number');
    assert(!user1_ticket.claimed, 'Incorrect claim status');
    assert(user1_ticket.straight_amount == 2, 'Incorrect straight amount');
    assert(user1_ticket.box_amount == 2, 'Incorrect box amount');
    assert(user1_ticket.set_amount == 2, 'Incorrect set amount');
    assert(user1_ticket.mini_amount == 2, 'Incorrect mini amount');
    assert(user2_ticket.picked_number == 1213, 'Incorrect picked number');
    assert(!user2_ticket.claimed, 'Incorrect claim status');
    assert(user2_ticket.straight_amount == 4, 'Incorrect straight amount');
    assert(user2_ticket.box_amount == 4, 'Incorrect box amount');
    assert(user2_ticket.set_amount == 4, 'Incorrect set amount');
    assert(user2_ticket.mini_amount == 4, 'Incorrect mini amount');
}

#[test]
#[should_panic(expected: ('Invalid game status', ))]
fn test_receive_random_words_wrong_game_status() {
    let (four_draw_dispatcher, _, _, _) = setup();

    start_cheat_caller_address(four_draw_dispatcher.contract_address, owner());
    four_draw_dispatcher.start_new_game(100, 9999);
    stop_cheat_caller_address(four_draw_dispatcher.contract_address);

    four_draw_dispatcher.receive_random_words(
        four_draw_dispatcher.contract_address,
        0,
        array![1234].span(),
        ArrayTrait::new()
    );
}

#[test]
#[should_panic(expected: ('Caller not randomness contract', ))]
fn test_non_randomness_receive_random_words() {
    let (four_draw_dispatcher, _, _, _) = setup();

    start_cheat_caller_address(four_draw_dispatcher.contract_address, owner());
    four_draw_dispatcher.start_new_game(100, 9999);
    stop_cheat_caller_address(four_draw_dispatcher.contract_address);

    cheat_block_timestamp_global(10000);
    four_draw_dispatcher.request_reveal_result(0);
    four_draw_dispatcher.receive_random_words(
        four_draw_dispatcher.contract_address,
        0,
        (array![1234]).span(),
        ArrayTrait::new()
    );
    stop_cheat_block_timestamp_global();
}

#[test]
#[should_panic(expected: ('Fulfillment delay too short', ))]
fn test_receive_random_words_delay_too_short() {
    let (four_draw_dispatcher, _, _, _) = setup();

    start_cheat_caller_address(four_draw_dispatcher.contract_address, owner());
    four_draw_dispatcher.start_new_game(100, 9999);
    stop_cheat_caller_address(four_draw_dispatcher.contract_address);

    cheat_block_timestamp_global(10000);
    start_cheat_caller_address(four_draw_dispatcher.contract_address, four_draw_dispatcher.randomness_contract());
    four_draw_dispatcher.request_reveal_result(0);
    four_draw_dispatcher.receive_random_words(
        four_draw_dispatcher.contract_address,
        0,
        array![1234].span(),
        ArrayTrait::new()
    );
    stop_cheat_caller_address(four_draw_dispatcher.contract_address);
    stop_cheat_block_timestamp_global();
}

#[test]
fn test_receive_random_words() {
    let (four_draw_dispatcher, _, token_dispatcher, _) = setup();
    let user1 = user1();
    let user2 = user2();
    let ticket_price = 100;

    start_cheat_caller_address(four_draw_dispatcher.contract_address, owner());
    four_draw_dispatcher.start_new_game(ticket_price, 9999);
    stop_cheat_caller_address(four_draw_dispatcher.contract_address);

    start_cheat_caller_address(token_dispatcher.contract_address, user1);
    token_dispatcher.approve(four_draw_dispatcher.contract_address, 4000000000);
    stop_cheat_caller_address(token_dispatcher.contract_address);

    start_cheat_caller_address(four_draw_dispatcher.contract_address, user1);
    four_draw_dispatcher.buy_tickets(2113, 2, 2, 2, 2);
    stop_cheat_caller_address(four_draw_dispatcher.contract_address);

    start_cheat_caller_address(token_dispatcher.contract_address, user2);
    token_dispatcher.approve(four_draw_dispatcher.contract_address, 4000000000);
    stop_cheat_caller_address(token_dispatcher.contract_address);

    start_cheat_caller_address(four_draw_dispatcher.contract_address, user2);
    four_draw_dispatcher.buy_tickets(1213, 4, 4, 4, 4);
    stop_cheat_caller_address(four_draw_dispatcher.contract_address);

    cheat_block_timestamp_global(10000);
    four_draw_dispatcher.request_reveal_result(0);
    start_cheat_caller_address(four_draw_dispatcher.contract_address, four_draw_dispatcher.randomness_contract());
    cheat_block_number_global(get_block_number() + 10);
    four_draw_dispatcher.receive_random_words(
        four_draw_dispatcher.contract_address,
        0,
        array![2113].span(),
        ArrayTrait::new()
    );
    stop_cheat_block_number_global();
    stop_cheat_caller_address(four_draw_dispatcher.contract_address);
    stop_cheat_block_timestamp_global();

    let round = four_draw_dispatcher.latest_game_round();
    let prize_info = four_draw_dispatcher.prize_info(round);
    assert(prize_info.total_straight_won == 4, 'Incorrect straight won');
    assert(prize_info.total_box_won == 12, 'Incorrect box won');
    assert(prize_info.total_mini_won == 2, 'Incorrect mini won');
    assert(prize_info.single_straight_prize == ticket_price * 12 / 4, 'Incorrect straight prize');
    assert(prize_info.single_box_prize == ticket_price * 12 / 12, 'Incorrect box prize');
    assert(prize_info.single_mini_prize == ticket_price * 6 / 2, 'Incorrect mini prize');
}

#[test]
#[should_panic(expected: ('No unclaimed prize', ))]
fn test_claim_prize_no_prize() {
    let (four_draw_dispatcher, _, _, _) = setup();
    
    four_draw_dispatcher.claim_prize();
}

#[test]
fn test_claim_prize() {
    let (four_draw_dispatcher, _, token_dispatcher, _) = setup();
    let user1 = user1();
    let user2 = user2();
    let ticket_price = 100;

    start_cheat_caller_address(four_draw_dispatcher.contract_address, owner());
    four_draw_dispatcher.start_new_game(ticket_price, 9999);
    stop_cheat_caller_address(four_draw_dispatcher.contract_address);

    start_cheat_caller_address(token_dispatcher.contract_address, user1);
    token_dispatcher.approve(four_draw_dispatcher.contract_address, 4000000000);
    stop_cheat_caller_address(token_dispatcher.contract_address);

    start_cheat_caller_address(four_draw_dispatcher.contract_address, user1);
    four_draw_dispatcher.buy_tickets(1234, 1, 1, 1, 1);
    stop_cheat_caller_address(four_draw_dispatcher.contract_address);

    start_cheat_caller_address(token_dispatcher.contract_address, user2);
    token_dispatcher.approve(four_draw_dispatcher.contract_address, 4000000000);
    stop_cheat_caller_address(token_dispatcher.contract_address);

    start_cheat_caller_address(four_draw_dispatcher.contract_address, user2);
    four_draw_dispatcher.buy_tickets(4321, 1, 1, 1, 1);
    stop_cheat_caller_address(four_draw_dispatcher.contract_address);

    cheat_block_timestamp_global(10000);
    four_draw_dispatcher.request_reveal_result(0);
    start_cheat_caller_address(four_draw_dispatcher.contract_address, four_draw_dispatcher.randomness_contract());
    cheat_block_number_global(get_block_number() + 10);
    four_draw_dispatcher.receive_random_words(
        four_draw_dispatcher.contract_address,
        0,
        array![1234].span(),
        ArrayTrait::new()
    );
    stop_cheat_block_number_global();
    stop_cheat_caller_address(four_draw_dispatcher.contract_address);
    stop_cheat_block_timestamp_global();
    
    let user1_balance_before = token_dispatcher.balance_of(user1);
    let user2_balance_before = token_dispatcher.balance_of(user2);

    start_cheat_caller_address(four_draw_dispatcher.contract_address, user1);
    four_draw_dispatcher.claim_prize();
    stop_cheat_caller_address(four_draw_dispatcher.contract_address);

    start_cheat_caller_address(four_draw_dispatcher.contract_address, user2);
    four_draw_dispatcher.claim_prize();
    stop_cheat_caller_address(four_draw_dispatcher.contract_address);

    let user1_balance_after = token_dispatcher.balance_of(user1);
    let user2_balance_after = token_dispatcher.balance_of(user2);
    assert(user1_balance_after - user1_balance_before == ticket_price * 8, 'Incorrect user1 prize');
    assert(user2_balance_after - user2_balance_before == ticket_price * 2, 'Incorrect user2 prize');
}

#[test]
fn test_claim_prize_accumulated() {
    let (four_draw_dispatcher, _, token_dispatcher, _) = setup();
    let user1 = user1();
    let ticket_price = 100;

    start_cheat_caller_address(four_draw_dispatcher.contract_address, owner());
    four_draw_dispatcher.start_new_game(ticket_price, 9999);
    stop_cheat_caller_address(four_draw_dispatcher.contract_address);

    start_cheat_caller_address(token_dispatcher.contract_address, user1);
    token_dispatcher.approve(four_draw_dispatcher.contract_address, 4000000000);
    stop_cheat_caller_address(token_dispatcher.contract_address);

    start_cheat_caller_address(four_draw_dispatcher.contract_address, user1);
    four_draw_dispatcher.buy_tickets(1234, 1, 1, 1, 1);
    stop_cheat_caller_address(four_draw_dispatcher.contract_address);

    cheat_block_timestamp_global(10000);
    four_draw_dispatcher.request_reveal_result(0);
    start_cheat_caller_address(four_draw_dispatcher.contract_address, four_draw_dispatcher.randomness_contract());
    cheat_block_number_global(get_block_number() + 10);
    four_draw_dispatcher.receive_random_words(
        four_draw_dispatcher.contract_address,
        0,
        array![5678].span(),
        ArrayTrait::new()
    );
    stop_cheat_block_number_global();
    stop_cheat_caller_address(four_draw_dispatcher.contract_address);
    stop_cheat_block_timestamp_global();

    start_cheat_caller_address(four_draw_dispatcher.contract_address, owner());
    four_draw_dispatcher.start_new_game(ticket_price, 19999);
    stop_cheat_caller_address(four_draw_dispatcher.contract_address);

    start_cheat_caller_address(four_draw_dispatcher.contract_address, user1);
    four_draw_dispatcher.buy_tickets(4321, 1, 1, 1, 1);
    stop_cheat_caller_address(four_draw_dispatcher.contract_address);

    cheat_block_timestamp_global(20000);
    four_draw_dispatcher.request_reveal_result(0);
    start_cheat_caller_address(four_draw_dispatcher.contract_address, four_draw_dispatcher.randomness_contract());
    cheat_block_number_global(get_block_number() + 10);
    four_draw_dispatcher.receive_random_words(
        four_draw_dispatcher.contract_address,
        0,
        array![4321].span(),
        ArrayTrait::new()
    );
    stop_cheat_block_number_global();
    stop_cheat_caller_address(four_draw_dispatcher.contract_address);
    stop_cheat_block_timestamp_global();
    
    let user1_balance_before = token_dispatcher.balance_of(user1);

    start_cheat_caller_address(four_draw_dispatcher.contract_address, user1);
    four_draw_dispatcher.claim_prize();
    stop_cheat_caller_address(four_draw_dispatcher.contract_address);

    let user1_balance_after = token_dispatcher.balance_of(user1);
    assert(user1_balance_after - user1_balance_before == ticket_price * 10, 'Incorrect user1 prize');
}