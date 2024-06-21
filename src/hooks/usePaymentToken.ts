import TokenABI from '@/configs/TokenABI'
import { useAccount, useContractRead } from '@starknet-react/core'
import { BlockTag } from 'starknet'

const TOKEN_ADDRESS = process.env.NEXT_TOKEN_ADDRESS
const CONTRACT_ADDRESS = process.env.NEXT_CONTRACT_ADDRESS

const usePaymentToken = () => {
  const { address: userAddress } = useAccount()

  const opt = {
    blockIdentifier: BlockTag.PENDING, // important
    abi: TokenABI,
    address: TOKEN_ADDRESS
  }


  const { data: data1, refetch: r1 } = useContractRead({
    ...opt,
    functionName: 'balanceOf',
    args: [userAddress!],
    enabled: Boolean(userAddress)
  })
  const { data: data2, refetch: r2 } = useContractRead({ ...opt, functionName: 'decimals' })

  const refetchAll = () => Promise.all([
    r1(), r2()
  ])

  return {
    balance: data1 as bigint | undefined,
    decimal: data2 === undefined ? undefined : String(data2),
    refetchAll
  }
}

export default usePaymentToken