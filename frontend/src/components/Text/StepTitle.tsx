import { FC } from 'react'
import styles from './Text.module.css'

interface Prop {
  title?: string
  step: number
}

const StepTitle: FC<Prop> = ({ title, step }) => {
  return (
    <h2 className={styles.title}>
      {step}. {title}
    </h2>
  )
}

export default StepTitle