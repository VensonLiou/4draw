import { BetTypes, useBetTypes } from '@/atoms/betTypes.atom'
import { Dot } from '../TotalBetSection/TotalBetSection'
import styles from './BetTypeSummarySection.module.css'

const BetTypeSummarySection = ({ _betTypes }: { _betTypes?: BetTypes }) => {
  const [globalBetTypes] = useBetTypes()

  const betTypes = _betTypes ?? globalBetTypes

  const straightBets = betTypes.straight ?? 0
  const boxBets = betTypes.box ?? 0
  const setBets = betTypes.set ?? 0
  const miniBets = betTypes.mini ?? 0

  return (
    <section>
      <ul className={styles.betTypeList}>

        <li className={styles.betType}>
          <div className={styles.row}><Dot /> Straight:</div>
          <span>{straightBets} </span>
        </li>

        <li className={styles.betType}>
          <div className={styles.row}><Dot /> Box:</div>
          <span>{boxBets} </span>
        </li>

        <li className={styles.betType}>
          <div className={styles.row}><Dot /> Set:</div>
          <span>{setBets} </span>
        </li>

        <li className={styles.betType}>
          <div className={styles.row}><Dot /> Mini:</div>
          <span>{miniBets} </span>
        </li>

      </ul>
    </section>
  )
}

export default BetTypeSummarySection