'use client'
import Image from 'next/image'
import ConnectButton from '../ConnectButton'
import styles from './Header.module.css'

const Header = () => {
  return (
    <header className={styles.header}>
      <Image
        alt='product name: 4 draw'
        src={'/logo-name-light.svg'}
        width={172}
        height={42}
        onClick={() => window.location.href = '/'}
        className={styles.logo}
      />
      <ConnectButton />
    </header>
  )
}

export default Header