import { handleOrdinal } from '@/utils/handleOrdinal'
import { FC } from 'react'
import NumberRadialGroup from './NumberRadialGroup'
import styles from './NumberSelectGroup.module.css'
import Pin from './Pin'

interface Prop {
  nthNumber: number
}

const NumberSelectGroup: FC<Prop> = ({ nthNumber }) => {
  const nthDisplay = nthNumber + 1
  return (
    <div className={styles.container}>
      <Pin nthNumber={nthNumber} />

      <h3 style={{ textAlign: 'center' }}>{nthDisplay}{handleOrdinal(nthDisplay)} Number</h3>

      <NumberRadialGroup nthNumber={nthNumber} />
    </div>
  )
}

export default NumberSelectGroup