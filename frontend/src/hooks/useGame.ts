import ABI from '@/configs/ABI';
import { useAccount, useContract } from '@starknet-react/core';
import toast from 'react-hot-toast';
import { AccountInterface, Contract } from 'starknet';

const useGame = () => {
  const { account } = useAccount()

  // prepare contract
  const { contract } = useContract({
    abi: ABI as any,
    address: '0x',
  });

  // connect account with contract
  account && contract?.connect(account)


  const startNewGame = async (ticketPrice: bigint, endTime: bigint) => {
    await checkRunWait({
      account,
      contract,
      functionName: 'start_new_game',
      args: [ticketPrice, endTime]
    })
  }


  const requestRevealResult = async (seed: number) => {
    await checkRunWait({
      account,
      contract,
      functionName: 'request_reveal_result',
      args: [seed]
    })
  }


  const buyTickets = async (picked_number: bigint, straight_amount: bigint, box_amount: bigint, set_amount: bigint, mini_amount: bigint) => {
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
      functionName: 'claimPrize'
    })

    return {
      startNewGame,
      requestRevealResult,
      buyTickets,
      claimPrize,
    }
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