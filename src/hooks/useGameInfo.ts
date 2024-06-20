import ABI from "@/configs/ABI"
import { bigintishToArray } from "@/utils/utils"
import { useAccount, useContractRead } from "@starknet-react/core"
import { BlockTag } from "starknet"

const useGameInfo = () => {
  const { address: userAddress } = useAccount()

  const opt = {
    blockIdentifier: BlockTag.PENDING, // important
    abi: ABI,
    address: process.env.NEXT_CONTRACT_ADDRESS
  }

  const read = useContractRead
  const B = Boolean
  const { data: data1 } = read({ ...opt, functionName: 'latest_game_round' })
  const { data: data2 } = read({ ...opt, functionName: 'game_info', args: [String(data1)!], enabled: B(data1) })
  const { data: data3 } = read({ ...opt, functionName: 'user_latest_round', args: [userAddress!], enabled: B(userAddress) })
  const { data: data4 } = read({ ...opt, functionName: 'latest_tickets_result', args: [userAddress!], enabled: B(userAddress) })

  // console.log('/ /// / /// / ///')
  // console.log(['latest_game_round', data1])
  // console.log(['game_info', data2])
  // console.log(['user_latest_round', data3])
  // console.log(['latest_tickets_result', data4])

  const {
    end_time,
    game_status,
    result_number,
    ticket_price,
    total_box_prize_accumulated,
    total_mini_prize_accumulated,
    total_straight_prize_accumulated
  } = data2 as any ?? {}

  const { 0: userLatestRound, 1: revealed, 2: _userTickets, 3: unclaimed_prize } = (
    data4 ? data4 : {}
  ) as { 0?: bigint, 1?: boolean, 2?: UserTicketInfo, 3?: bigint }

  const userTickets = _userTickets && {
    picked_number: bigintishToArray(_userTickets.picked_number),
    claimed: _userTickets.claimed,
    straight_amount: Number(_userTickets.straight_amount),
    box_amount: Number(_userTickets.box_amount),
    set_amount: Number(_userTickets.set_amount),
    mini_amount: Number(_userTickets.mini_amount),
  }

  return {
    latestGameRound: data1 === undefined ? undefined : Number(data1),
    gameInfo: data2 ? {
      end_time: Number(end_time),
      game_status: game_status.activeVariant() as GameStatus,
      result_number: bigintishToArray(result_number),
      ticket_price: ticket_price as bigint,
      total_box_prize_accumulated: total_box_prize_accumulated as bigint,
      total_mini_prize_accumulated: total_mini_prize_accumulated as bigint,
      total_straight_prize_accumulated: total_straight_prize_accumulated as bigint
    } : undefined,
    userLatestRound: data3 === undefined ? undefined : Number(data3),
    latestTicketsResult: {
      userLatestRound: Number(userLatestRound),
      revealed,
      userTickets,
      unclaimed_prize
    }
  }
}

export default useGameInfo

type GameStatus = 'NotStarted' | 'Started' | 'Revealing' | 'Ended'

type UserTicketInfo = {
  picked_number: bigint
  claimed: boolean
  straight_amount: bigint
  box_amount: bigint
  set_amount: bigint
  mini_amount: bigint
}