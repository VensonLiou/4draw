'use client'
import { getCroppedStringIfAddress } from '@/utils/utils'
import { HStack } from '@chakra-ui/react'
import { useAccount, useConnect, useDisconnect } from '@starknet-react/core'
import { useStarknetkitConnectModal } from 'starknetkit'
import TeaButton from './TeaButton/TeaButton'
import styles from './components.module.css'

const ConnectButton = () => {
  const { address: userAddress } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  const { starknetkitConnectModal } = useStarknetkitConnectModal({
    connectors: connectors as any
  })

  const connectWallet = async () => {
    const { connector } = await starknetkitConnectModal()
    connect({ connector })
  }


  if (!userAddress) return (
    <TeaButton
      title='Connect Wallet'
      onClick={connectWallet}
    />
  )

  return (
    <HStack>
      <div className={styles.networkButton}>
        <TeaButton
          title={'Starknet'}
          outlined
          minWidth={60}
        />
      </div>
      <TeaButton
        title={getCroppedStringIfAddress(userAddress)}
        outlined
        onClick={disconnect}
      />
    </HStack>
  )

}

export default ConnectButton