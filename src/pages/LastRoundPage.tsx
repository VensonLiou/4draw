import ContentContainer from '@/components/ContentContainer'
import { useAccount } from '@starknet-react/core'
import React from 'react'

const LastRoundPage = () => {
  const { address: userAddress } = useAccount()

  // 判斷是否已經開獎
  const isPrizeRevealed = true

  // 未開獎，前往開獎頁面
  if (!isPrizeRevealed) {

  }
  else {
    // 已開獎，前往領獎頁面

  }
  return (
    <ContentContainer>
      <p>Last Round</p>
    </ContentContainer>
  )
}

export default LastRoundPage