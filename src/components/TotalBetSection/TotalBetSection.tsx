import { commafy } from '@/utils/utils'
import styles from './TotalBetSection.module.css'
import { FC } from 'react'

const TotalBetSection = () => {

  const straightBets = 500
  const BoxBets = 500
  const miniBets = 500
  const totalBets = straightBets + BoxBets + miniBets

  return (
    <section className={styles.container}>
      <h3 className={styles.total}>Total Bets <span>{commafy(totalBets)} USDC</span></h3>


      <ul className={styles.betTypeList}>

        <li className={styles.betType}>
          <div className={styles.row}><Dot /> Straight:</div>
          <span>{straightBets} USDC</span>
        </li>

        <li className={styles.betType}>
          <div className={styles.row}><Dot /> Box:</div>
          <span>{BoxBets} USDC</span>
        </li>

        <li className={styles.betType}>
          <div className={styles.row}><Dot /> Mini:</div>
          <span>{miniBets} USDC</span>
        </li>

      </ul>
    </section>
  )
}

export default TotalBetSection

interface DotProp {
  style?: { [name: string]: any }
}

export const Dot: FC<DotProp> = ({ style }) => (
  <div className={styles.dot} style={style} />
)
