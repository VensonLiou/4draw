import { FC, ReactNode } from 'react'
import styles from './components.module.css'

interface Prop {
  children: ReactNode
  gap?: number
}

const StepContentContainer: FC<Prop> = ({ children, gap }) => {
  return (
    <div
      className={styles.stepContentContainer}
      style={{ gap }}
    >
      {children}
    </div>
  )
}

export default StepContentContainer