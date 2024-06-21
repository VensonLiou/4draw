import useGameInfo from '@/hooks/useGameInfo'
import usePaymentToken from '@/hooks/usePaymentToken'
import { formatUnits } from '@/utils/parseUnits'
import { addString, commafy } from '@/utils/utils'
import { FC } from 'react'
import styles from './TotalBetSection.module.css'

const TotalBetSection = () => {
  const { gameInfo } = useGameInfo()
  const { decimals, symbol } = usePaymentToken()

  const straightBets = formatUnits(gameInfo.total_straight_prize_accumulated, decimals)
  const BoxBets = formatUnits(gameInfo.total_box_prize_accumulated, decimals)
  const miniBets = formatUnits(gameInfo.total_mini_prize_accumulated, decimals)
  const totalBets = addString(addString(straightBets, BoxBets), miniBets)

  return (
    <section className={styles.container}>
      <h3 className={styles.total}>Total Bets <span>{commafy(totalBets)} {symbol ?? ''}</span></h3>


      <ul className={styles.betTypeList}>

        <li className={styles.betType}>
          <div className={styles.row}><Dot /> Straight:</div>
          <span>{commafy(straightBets)} {symbol ?? ''}</span>
        </li>

        <li className={styles.betType}>
          <div className={styles.row}><Dot /> Box:</div>
          <span>{commafy(BoxBets)} {symbol ?? ''}</span>
        </li>

        <li className={styles.betType}>
          <div className={styles.row}><Dot /> Mini:</div>
          <span>{commafy(miniBets)} {symbol ?? ''}</span>
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
