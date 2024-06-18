import { FC, ReactNode } from 'react'
import styles from './Text.module.css'

interface Prop {
  children: ReactNode
}

const StepTitle: FC<Prop> = ({ children }) => {
  return (
    <h2 className={styles.title}>
      {children}
    </h2>
  )
}

export default StepTitle