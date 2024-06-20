import ABI from "@/configs/ABI"
import { useAccount, useContractRead } from "@starknet-react/core"
import { BlockTag, CairoCustomEnum, num } from "starknet"

const useGameInfo = (round?: number, pickedNumber?: number) => {
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
  const { data: data4 } = read({ ...opt, functionName: 'user_tickets', args: [userAddress!], enabled: B(userAddress) })
  const { data: data5 } = read({ ...opt, functionName: 'latest_tickets_result', args: [userAddress!], enabled: B(userAddress) })

  // console.log('/ /// / /// / ///')
  // console.log(['latest_game_round', data1])
  // console.log(['game_info', data2])
  // console.log(['user_latest_round', data3])
  // console.log(['user_tickets', data4])
  // console.log(['latest_tickets_result', data5])

  const {
    end_time,
    game_status,
    result_number,
    ticket_price,
    total_box_prize_accumulated,
    total_mini_prize_accumulated,
    total_straight_prize_accumulated
  } = data2 as any ?? {}

  return {
    latestGameRound: data1 as undefined | bigint,
    gameInfo: data2 ? {
      end_time: Number(end_time),
      game_status: game_status.activeVariant() as GameStatus,
      result_number: Array.from(String(result_number), Number),
      ticket_price: ticket_price as bigint,
      total_box_prize_accumulated: total_box_prize_accumulated as bigint,
      total_mini_prize_accumulated: total_mini_prize_accumulated as bigint,
      total_straight_prize_accumulated: total_straight_prize_accumulated as bigint
    } : undefined,
    userLatestRound: data3 as undefined | bigint,
    userTickets: data4 as undefined | bigint,
    latestTicketsResult: data5 as undefined | bigint
  }
}

export default useGameInfo

type GameStatus = 'NotStarted' | 'Started' | 'Revealing' | 'Ended' 