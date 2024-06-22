import ABI from '@/configs/ABI';
import { multiplyString } from '@/utils/utils';
import { useAccount, useContract } from '@starknet-react/core';
import toast from 'react-hot-toast';
import { AccountInterface, CallData, Contract, cairo } from 'starknet';
import useGameInfo from './useGameInfo';


const CONTRACT_ADDRESS = process.env.NEXT_CONTRACT_ADDRESS
const TOKEN_ADDRESS = process.env.NEXT_TOKEN_ADDRESS

const useGame = () => {
  const { account } = useAccount()
  const { gameInfo } = useGameInfo()
  const basePrice = gameInfo.ticket_price

  // prepare contract
  const { contract } = useContract({
    abi: ABI,
    address: CONTRACT_ADDRESS,
  });

  // connect account with contract
  account && contract?.connect(account)


  const requestRevealResult = async () => {
    await checkRunWait({
      account,
      contract,
      functionName: 'request_reveal_result',
      args: [Math.round(Math.random() * 10000000)]
    })
  }


  const buyTickets = async (picked_number: string, straight_amount: string, box_amount: string, set_amount: string, mini_amount: string) => {
    await checkRunWait({
      account,
      contract,
      functionName: 'buy_tickets',
      args: [picked_number, straight_amount, box_amount, set_amount, mini_amount]
    })
  }



  const claimPrize = async () => {
    await checkRunWait({
      account,
      contract,
      functionName: 'claim_prize'
    })
  }

  const approveAndBuy = async (picked_number: bigint, straight_amount: bigint, box_amount: bigint, set_amount: bigint, mini_amount: bigint) => {
    if (!account || !basePrice) return
    const p = basePrice
    const totalFee = multiplyString(straight_amount, String(p))
      + multiplyString(box_amount, String(p))
      + multiplyString(set_amount, String(p * 2n))
      + multiplyString(mini_amount, String(p))

    const multiCall = await account.execute([
      {
        contractAddress: TOKEN_ADDRESS,
        entrypoint: 'approve',
        calldata: CallData.compile({
          spender: CONTRACT_ADDRESS,
          amount: cairo.uint256(totalFee)
        })
      },
      {
        contractAddress: CONTRACT_ADDRESS,
        entrypoint: 'buy_tickets',
        calldata: CallData.compile({
          picked_number: picked_number,
          straight_amount: cairo.uint256(straight_amount),
          box_amount: cairo.uint256(box_amount),
          set_amount: cairo.uint256(set_amount),
          mini_amount: cairo.uint256(mini_amount),
        })
      }
    ])

    const Response = await account?.waitForTransaction(multiCall?.transaction_hash)
  }


  return {
    requestRevealResult,
    buyTickets,
    claimPrize,
    approveAndBuy
  }
}

export default useGame

type Prop = {
  contract?: Contract
  account?: AccountInterface
  functionName: string
  args?: any[]
}

export const checkRunWait = async ({ contract, account, functionName, args }: Prop) => {
  if (!contract || !account) return toast.error('contract not ready.')
  if (!args) args = []

  // staticCall 
  // const { calldata } = contract.populate(functionName, args)
  // const staticCallResult = await account?.simulateTransaction(
  //   [{
  //     type: TransactionType.INVOKE,
  //     calldata,
  //     entrypoint: functionName,
  //     contractAddress: contract.address,
  //   }],
  //   { skipValidate: true }
  // )
  // console.log({ staticCallResult })


  const res = await contract[functionName](...args)
  await account?.waitForTransaction(res.transaction_hash)
}