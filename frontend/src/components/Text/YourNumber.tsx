import { useUserNumbers } from '@/atoms/userNumbers.atom'
import styles from './Text.module.css'

const YourNumber = ({ _userNumbers }: { _userNumbers?: (number)[] }) => {

  const [userNumbers] = useUserNumbers()
  const text = (_userNumbers ?? userNumbers).join(' ')

  return (
    <p className={styles.yourNumber_title}>
      Your Number: <span className={styles.number}>{text}</span>
    </p>
  )
}

export default YourNumber