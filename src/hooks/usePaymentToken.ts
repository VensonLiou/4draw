import TokenABI from '@/configs/TokenABI'
import { useAccount, useContract, useContractRead } from '@starknet-react/core'
import { BlockTag } from 'starknet'
import { checkRunWait } from './useGame'

const TOKEN_ADDRESS = process.env.NEXT_TOKEN_ADDRESS

const usePaymentToken = () => {
  const { address: userAddress, account } = useAccount()

  const opt = {
    blockIdentifier: BlockTag.PENDING, // important
    abi: TokenABI,
    address: TOKEN_ADDRESS
  }

  const { data: balance, refetch: r1 } = useContractRead({
    ...opt,
    functionName: 'balanceOf',
    args: [userAddress!],
    enabled: Boolean(userAddress)
  })

  const { data: decimals, refetch: r2 } = useContractRead({
    ...opt,
    functionName: 'decimals'
  })

  const { data: symbol, refetch: r3 } = useContractRead({
    ...opt,
    functionName: 'symbol'
  })

  // prepare contract
  const { contract } = useContract({
    abi: TokenABI,
    address: process.env.NEXT_TOKEN_ADDRESS,
  });


  // connect account with contract
  account && contract?.connect(account)


  const mintTPT = async (amount: bigint) => {
    await checkRunWait({
      account,
      contract,
      functionName: 'mint',
      args: [userAddress, amount]
    })
  }


  const refetchAll = () => Promise.all([r1(), r2(), r3()])


  return {
    balance: balance as bigint | undefined,
    decimals: decimals === undefined ? undefined : Number(decimals),
    symbol: symbol as string | undefined,
    refetchPaymentToken: refetchAll,
    mintTPT
  }
}

export default usePaymentToken