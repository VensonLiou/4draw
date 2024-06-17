import Image from 'next/image'
import styles from './Header.module.css'
import TeaButton from '../TeaButton/TeaButton'

const Header = () => {
  return (
    <header className={styles.header}>
      <Image
        alt='product name: 4 draw'
        src={'/logo-name-light.svg'}
        width={172}
        height={42}
      />

      <TeaButton 
        title='Connect Wallet'
      />
    </header>
  )
}

export default Header