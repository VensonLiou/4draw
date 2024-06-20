import ABI from '@/configs/ABI';
import { useAccount, useContract } from '@starknet-react/core';
import toast from 'react-hot-toast';
import { AccountInterface, Contract } from 'starknet';

const useGame = () => {
  const { account } = useAccount()

  // prepare contract
  const { contract } = useContract({
    abi: ABI,
    address: process.env.NEXT_CONTRACT_ADDRESS,
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


  return {
    requestRevealResult,
    buyTickets,
    claimPrize,
  }
}

export default useGame

type Prop = {
  contract?: Contract
  account?: AccountInterface
  functionName: string
  args?: any[]
}

const checkRunWait = async ({ contract, account, functionName, args }: Prop) => {
  if (!contract || !account) return toast.error('contract not ready.')
  if (!args) args = []
  const res = await contract[functionName](...args)
  await account?.waitForTransaction(res.transaction_hash)
}