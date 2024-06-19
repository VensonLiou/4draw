import { useUserNumbers } from '@/atoms/userNumbers.atom'
import styles from './Text.module.css'

const YourNumber = () => {

  const [userNumbers] = useUserNumbers()
  const text = userNumbers.join(' ')

  return (
    <p className={styles.yourNumber_title}>
      Your Number: <span className={styles.number}>{text}</span>
    </p>
  )
}

export default YourNumber