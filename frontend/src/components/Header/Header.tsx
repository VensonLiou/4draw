'use client'
import Image from 'next/image'
import ConnectButton from '../ConnectButton'
import styles from './Header.module.css'
import useGameInfo from '@/hooks/useGameInfo'
import { HStack } from '@chakra-ui/react'

const Header = () => {
  const { latestGameRound } = useGameInfo()
  return (
    <header className={styles.header}>
      <HStack gap={8}>
        <Image
          alt='product name: 4 draw'
          src={'/logo-name-light.svg'}
          width={172}
          height={42}
          onClick={() => window.location.href = '/'}
          className={styles.logo}
        />
        {latestGameRound && <span>Round #{latestGameRound}</span>}
      </HStack>
      <ConnectButton />
    </header>
  )
}

export default Header