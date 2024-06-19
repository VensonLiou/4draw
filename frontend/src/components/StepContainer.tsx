import { FC, ReactNode } from 'react'
import styles from './components.module.css'

interface Prop {
  children: ReactNode
  gap?: number
}

const StepContainer: FC<Prop> = ({ children, gap }) => {
  return (
    <div
      className={styles.stepContainer}
      style={{ gap }}
    >
      {children}
    </div>
  )
}

export default StepContainer