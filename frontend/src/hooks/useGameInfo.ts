import ABI from "@/configs/ABI"
import { useAccount, useContractRead } from "@starknet-react/core"
import { BlockTag } from "starknet"

const useGameInfo = (round?: number, pickedNumber?: number) => {
  const { address: userAddress } = useAccount()

  const opt = {
    blockIdentifier: BlockTag.PENDING, // important
    abi: ABI as any,
    address: '0x'
  }

  const read = useContractRead
  const B = Boolean
  const { data: data1 } = read({ ...opt, functionName: 'randomness_contract' })
  const { data: data2 } = read({ ...opt, functionName: 'ticket_payment_token' })
  const { data: data3 } = read({ ...opt, functionName: 'reveal_config' })
  const { data: data4 } = read({ ...opt, functionName: 'latest_game_round' })
  const { data: data5 } = read({ ...opt, functionName: 'game_info', args: [round!], enabled: B(round) })
  const { data: data6 } = read({ ...opt, functionName: 'ticket_counter', args: [round!, pickedNumber!], enabled: B(round) && B(pickedNumber) })
  const { data: data7 } = read({ ...opt, functionName: 'user_latest_round', args: [userAddress!], enabled: B(userAddress) })
  const { data: data8 } = read({ ...opt, functionName: 'user_tickets', args: [userAddress!], enabled: B(userAddress) })
  const { data: data9 } = read({ ...opt, functionName: 'latest_tickets_result', args: [userAddress!], enabled: B(userAddress) })



  return {
    randomnessContract: data1,
    paymentTokenAddress: data2,
    revealConfig: data3,
    latestGameRound: data4,
    gameInfo: data5,
    ticketCounter: data6,
    userLatestRound: data7,
    userTickets: data8,
    latestTicketsResult: data9
  }
}

export default useGameInfo