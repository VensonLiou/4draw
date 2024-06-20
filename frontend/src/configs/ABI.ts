const ABI = [
  {
    "name": "UpgradeableImpl",
    "type": "impl",
    "interface_name": "openzeppelin::upgrades::interface::IUpgradeable"
  },
  {
    "name": "openzeppelin::upgrades::interface::IUpgradeable",
    "type": "interface",
    "items": [
      {
        "name": "upgrade",
        "type": "function",
        "inputs": [
          {
            "name": "new_class_hash",
            "type": "core::starknet::class_hash::ClassHash"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      }
    ]
  },
  {
    "name": "FourDrawImpl",
    "type": "impl",
    "interface_name": "four_draw::four_draw::IFourDraw"
  },
  {
    "name": "core::integer::u256",
    "type": "struct",
    "members": [
      {
        "name": "low",
        "type": "core::integer::u128"
      },
      {
        "name": "high",
        "type": "core::integer::u128"
      }
    ]
  },
  {
    "name": "four_draw::four_draw::RevealConfig",
    "type": "struct",
    "members": [
      {
        "name": "max_fee",
        "type": "core::integer::u256"
      },
      {
        "name": "callback_fee_limit",
        "type": "core::integer::u128"
      },
      {
        "name": "publish_delay",
        "type": "core::integer::u64"
      }
    ]
  },
  {
    "name": "four_draw::four_draw::GameStatus",
    "type": "enum",
    "variants": [
      {
        "name": "NotStarted",
        "type": "()"
      },
      {
        "name": "Started",
        "type": "()"
      },
      {
        "name": "Revealing",
        "type": "()"
      },
      {
        "name": "Ended",
        "type": "()"
      }
    ]
  },
  {
    "name": "four_draw::four_draw::GameInfo",
    "type": "struct",
    "members": [
      {
        "name": "ticket_price",
        "type": "core::integer::u256"
      },
      {
        "name": "end_time",
        "type": "core::integer::u64"
      },
      {
        "name": "randomness_request_id",
        "type": "core::integer::u64"
      },
      {
        "name": "result_number",
        "type": "core::integer::u16"
      },
      {
        "name": "game_status",
        "type": "four_draw::four_draw::GameStatus"
      },
      {
        "name": "total_straight_prize_accumulated",
        "type": "core::integer::u256"
      },
      {
        "name": "total_box_prize_accumulated",
        "type": "core::integer::u256"
      },
      {
        "name": "total_mini_prize_accumulated",
        "type": "core::integer::u256"
      }
    ]
  },
  {
    "name": "four_draw::four_draw::TicketCounter",
    "type": "struct",
    "members": [
      {
        "name": "straight_amount",
        "type": "core::integer::u256"
      },
      {
        "name": "box_amount",
        "type": "core::integer::u256"
      },
      {
        "name": "mini_amount",
        "type": "core::integer::u256"
      }
    ]
  },
  {
    "name": "core::bool",
    "type": "enum",
    "variants": [
      {
        "name": "False",
        "type": "()"
      },
      {
        "name": "True",
        "type": "()"
      }
    ]
  },
  {
    "name": "four_draw::four_draw::UserTicketInfo",
    "type": "struct",
    "members": [
      {
        "name": "picked_number",
        "type": "core::integer::u16"
      },
      {
        "name": "claimed",
        "type": "core::bool"
      },
      {
        "name": "straight_amount",
        "type": "core::integer::u256"
      },
      {
        "name": "box_amount",
        "type": "core::integer::u256"
      },
      {
        "name": "set_amount",
        "type": "core::integer::u256"
      },
      {
        "name": "mini_amount",
        "type": "core::integer::u256"
      }
    ]
  },
  {
    "name": "core::array::Span::<core::felt252>",
    "type": "struct",
    "members": [
      {
        "name": "snapshot",
        "type": "@core::array::Array::<core::felt252>"
      }
    ]
  },
  {
    "name": "four_draw::four_draw::IFourDraw",
    "type": "interface",
    "items": [
      {
        "name": "randomness_contract",
        "type": "function",
        "inputs": [],
        "outputs": [
          {
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "randomness_payment_token",
        "type": "function",
        "inputs": [],
        "outputs": [
          {
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "ticket_payment_token",
        "type": "function",
        "inputs": [],
        "outputs": [
          {
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "reveal_config",
        "type": "function",
        "inputs": [],
        "outputs": [
          {
            "type": "four_draw::four_draw::RevealConfig"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "latest_game_round",
        "type": "function",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "game_info",
        "type": "function",
        "inputs": [
          {
            "name": "round",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "four_draw::four_draw::GameInfo"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "ticket_counter",
        "type": "function",
        "inputs": [
          {
            "name": "round",
            "type": "core::integer::u256"
          },
          {
            "name": "picked_number",
            "type": "core::integer::u16"
          }
        ],
        "outputs": [
          {
            "type": "four_draw::four_draw::TicketCounter"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "user_latest_round",
        "type": "function",
        "inputs": [
          {
            "name": "account",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "user_tickets",
        "type": "function",
        "inputs": [
          {
            "name": "account",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "round",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "four_draw::four_draw::UserTicketInfo"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "latest_tickets_result",
        "type": "function",
        "inputs": [
          {
            "name": "account",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "(core::integer::u256, core::bool, four_draw::four_draw::UserTicketInfo, core::integer::u256)"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "set_reveal_config",
        "type": "function",
        "inputs": [
          {
            "name": "reveal_config",
            "type": "four_draw::four_draw::RevealConfig"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "start_new_game",
        "type": "function",
        "inputs": [
          {
            "name": "ticket_price",
            "type": "core::integer::u256"
          },
          {
            "name": "end_time",
            "type": "core::integer::u64"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "request_reveal_result",
        "type": "function",
        "inputs": [
          {
            "name": "seed",
            "type": "core::integer::u64"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "receive_random_words",
        "type": "function",
        "inputs": [
          {
            "name": "requestor_address",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "request_id",
            "type": "core::integer::u64"
          },
          {
            "name": "random_words",
            "type": "core::array::Span::<core::felt252>"
          },
          {
            "name": "calldata",
            "type": "core::array::Array::<core::felt252>"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "buy_tickets",
        "type": "function",
        "inputs": [
          {
            "name": "picked_number",
            "type": "core::integer::u16"
          },
          {
            "name": "straight_amount",
            "type": "core::integer::u256"
          },
          {
            "name": "box_amount",
            "type": "core::integer::u256"
          },
          {
            "name": "set_amount",
            "type": "core::integer::u256"
          },
          {
            "name": "mini_amount",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "external"
      },
      {
        "name": "claim_prize",
        "type": "function",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "external"
      }
    ]
  },
  {
    "name": "OwnableImpl",
    "type": "impl",
    "interface_name": "openzeppelin::access::ownable::interface::IOwnable"
  },
  {
    "name": "openzeppelin::access::ownable::interface::IOwnable",
    "type": "interface",
    "items": [
      {
        "name": "owner",
        "type": "function",
        "inputs": [],
        "outputs": [
          {
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "transfer_ownership",
        "type": "function",
        "inputs": [
          {
            "name": "new_owner",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "renounce_ownership",
        "type": "function",
        "inputs": [],
        "outputs": [],
        "state_mutability": "external"
      }
    ]
  },
  {
    "name": "OwnableCamelOnlyImpl",
    "type": "impl",
    "interface_name": "openzeppelin::access::ownable::interface::IOwnableCamelOnly"
  },
  {
    "name": "openzeppelin::access::ownable::interface::IOwnableCamelOnly",
    "type": "interface",
    "items": [
      {
        "name": "transferOwnership",
        "type": "function",
        "inputs": [
          {
            "name": "newOwner",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "renounceOwnership",
        "type": "function",
        "inputs": [],
        "outputs": [],
        "state_mutability": "external"
      }
    ]
  },
  {
    "name": "constructor",
    "type": "constructor",
    "inputs": [
      {
        "name": "randomness_contract",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "ticket_payment_token",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "reveal_config",
        "type": "four_draw::four_draw::RevealConfig"
      },
      {
        "name": "owner",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "four_draw::four_draw::FourDraw::RevealConfigUpdated",
    "type": "event",
    "members": [
      {
        "kind": "data",
        "name": "reveal_config",
        "type": "four_draw::four_draw::RevealConfig"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "four_draw::four_draw::FourDraw::NewGameStarted",
    "type": "event",
    "members": [
      {
        "kind": "data",
        "name": "round",
        "type": "core::integer::u256"
      },
      {
        "kind": "data",
        "name": "ticket_price",
        "type": "core::integer::u256"
      },
      {
        "kind": "data",
        "name": "end_time",
        "type": "core::integer::u64"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "four_draw::four_draw::FourDraw::GameRevealRequested",
    "type": "event",
    "members": [
      {
        "kind": "data",
        "name": "round",
        "type": "core::integer::u256"
      },
      {
        "kind": "data",
        "name": "request_id",
        "type": "core::integer::u64"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "four_draw::four_draw::FourDraw::GameRevealed",
    "type": "event",
    "members": [
      {
        "kind": "data",
        "name": "round",
        "type": "core::integer::u256"
      },
      {
        "kind": "data",
        "name": "result_number",
        "type": "core::integer::u16"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "four_draw::four_draw::FourDraw::TicketsBought",
    "type": "event",
    "members": [
      {
        "kind": "data",
        "name": "account",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "data",
        "name": "ticket_info",
        "type": "four_draw::four_draw::UserTicketInfo"
      },
      {
        "kind": "data",
        "name": "total_cost",
        "type": "core::integer::u256"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "four_draw::four_draw::FourDraw::PrizeClaimed",
    "type": "event",
    "members": [
      {
        "kind": "data",
        "name": "account",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "data",
        "name": "round",
        "type": "core::integer::u256"
      },
      {
        "kind": "data",
        "name": "prize",
        "type": "core::integer::u256"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "openzeppelin::upgrades::upgradeable::UpgradeableComponent::Upgraded",
    "type": "event",
    "members": [
      {
        "kind": "data",
        "name": "class_hash",
        "type": "core::starknet::class_hash::ClassHash"
      }
    ]
  },
  {
    "kind": "enum",
    "name": "openzeppelin::upgrades::upgradeable::UpgradeableComponent::Event",
    "type": "event",
    "variants": [
      {
        "kind": "nested",
        "name": "Upgraded",
        "type": "openzeppelin::upgrades::upgradeable::UpgradeableComponent::Upgraded"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "openzeppelin::access::ownable::ownable::OwnableComponent::OwnershipTransferred",
    "type": "event",
    "members": [
      {
        "kind": "key",
        "name": "previous_owner",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "key",
        "name": "new_owner",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "openzeppelin::access::ownable::ownable::OwnableComponent::OwnershipTransferStarted",
    "type": "event",
    "members": [
      {
        "kind": "key",
        "name": "previous_owner",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "key",
        "name": "new_owner",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "kind": "enum",
    "name": "openzeppelin::access::ownable::ownable::OwnableComponent::Event",
    "type": "event",
    "variants": [
      {
        "kind": "nested",
        "name": "OwnershipTransferred",
        "type": "openzeppelin::access::ownable::ownable::OwnableComponent::OwnershipTransferred"
      },
      {
        "kind": "nested",
        "name": "OwnershipTransferStarted",
        "type": "openzeppelin::access::ownable::ownable::OwnableComponent::OwnershipTransferStarted"
      }
    ]
  },
  {
    "kind": "enum",
    "name": "openzeppelin::security::reentrancyguard::ReentrancyGuardComponent::Event",
    "type": "event",
    "variants": []
  },
  {
    "kind": "enum",
    "name": "four_draw::four_draw::FourDraw::Event",
    "type": "event",
    "variants": [
      {
        "kind": "nested",
        "name": "RevealConfigUpdated",
        "type": "four_draw::four_draw::FourDraw::RevealConfigUpdated"
      },
      {
        "kind": "nested",
        "name": "NewGameStarted",
        "type": "four_draw::four_draw::FourDraw::NewGameStarted"
      },
      {
        "kind": "nested",
        "name": "GameRevealRequested",
        "type": "four_draw::four_draw::FourDraw::GameRevealRequested"
      },
      {
        "kind": "nested",
        "name": "GameRevealed",
        "type": "four_draw::four_draw::FourDraw::GameRevealed"
      },
      {
        "kind": "nested",
        "name": "TicketsBought",
        "type": "four_draw::four_draw::FourDraw::TicketsBought"
      },
      {
        "kind": "nested",
        "name": "PrizeClaimed",
        "type": "four_draw::four_draw::FourDraw::PrizeClaimed"
      },
      {
        "kind": "flat",
        "name": "UpgradeableEvent",
        "type": "openzeppelin::upgrades::upgradeable::UpgradeableComponent::Event"
      },
      {
        "kind": "flat",
        "name": "OwnableEvent",
        "type": "openzeppelin::access::ownable::ownable::OwnableComponent::Event"
      },
      {
        "kind": "flat",
        "name": "ReentrancyGuardEvent",
        "type": "openzeppelin::security::reentrancyguard::ReentrancyGuardComponent::Event"
      }
    ]
  }
] as const

export default ABI