import ABI from "@/configs/ABI"
import { MOCK_GAME_INFO } from "@/mocks/mocks"
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
  const { data: data1, refetch: r1 } = read({ ...opt, functionName: 'latest_game_round' })
  const { data: data2, refetch: r2 } = read({ ...opt, functionName: 'game_info', args: [String(data1)!], enabled: B(data1) })
  const { data: data3, refetch: r3 } = read({ ...opt, functionName: 'user_latest_round', args: [userAddress!], enabled: B(userAddress) })
  const { data: data4, refetch: r4 } = read({ ...opt, functionName: 'latest_tickets_result', args: [userAddress!], enabled: B(userAddress) })
  const { data: data5, refetch: r5 } = read({ ...opt, functionName: 'game_info', args: [String(data3)!], enabled: B(data3) })

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

  const userLatestRoundResult = ((Boolean(userLatestRound) ? data5 : {}) as { result_number?: bigint }).result_number

  const userTickets = _userTickets && {
    picked_number: bigintishToArray(_userTickets.picked_number),
    claimed: _userTickets.claimed,
    straight_amount: Number(_userTickets.straight_amount),
    box_amount: Number(_userTickets.box_amount),
    set_amount: Number(_userTickets.set_amount),
    mini_amount: Number(_userTickets.mini_amount),
  }

  const refetchInfo = async () => {
    await Promise.all([r1(), r2(), r3(), r4(), r5(),])
  }


  return MOCK_GAME_INFO
  // return {
  //   latestGameRound: data1 === undefined ? undefined : Number(data1),
  //   gameInfo: data2 ? {
  //     end_time: Number(end_time),
  //     game_status: game_status.activeVariant() as GameStatus,
  //     latest_result_number: bigintishToArray(result_number),
  //     ticket_price: ticket_price as bigint,
  //     total_box_prize_accumulated: total_box_prize_accumulated as bigint,
  //     total_mini_prize_accumulated: total_mini_prize_accumulated as bigint,
  //     total_straight_prize_accumulated: total_straight_prize_accumulated as bigint
  //   } : undefined,
  //   latestTicketsResult: {
  //     userLatestRound: Number(userLatestRound),
  //     revealed,
  //     userTickets,
  //     unclaimed_prize,
  //     userLatestRoundResult: userLatestRoundResult === undefined ? undefined : bigintishToArray(userLatestRoundResult)
  //   },
  //   refetchInfo,
  // }
}

export default useGameInfo

export type GameInfo = {
  end_time: number;
  game_status: GameStatus;
  result_number: number[] | undefined;
  ticket_price: bigint;
  total_box_prize_accumulated: bigint;
  total_mini_prize_accumulated: bigint;
  total_straight_prize_accumulated: bigint;
}

type GameStatus = 'NotStarted' | 'Started' | 'Revealing' | 'Ended'

type UserTicketInfo = {
  picked_number: bigint
  claimed: boolean
  straight_amount: bigint
  box_amount: bigint
  set_amount: bigint
  mini_amount: bigint
}