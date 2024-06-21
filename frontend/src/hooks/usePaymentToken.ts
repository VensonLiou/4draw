import TokenABI from '@/configs/TokenABI'
import { useAccount, useContractRead } from '@starknet-react/core'
import { BlockTag } from 'starknet'

const TOKEN_ADDRESS = process.env.NEXT_TOKEN_ADDRESS

const usePaymentToken = () => {
  const { address: userAddress } = useAccount()

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


  const refetchAll = () => Promise.all([r1(), r2(), r3()])


  return {
    balance: balance as bigint | undefined,
    decimals: decimals === undefined ? undefined : Number(decimals),
    symbol: symbol as string | undefined,
    refetchPaymentToken: refetchAll
  }
}

export default usePaymentToken