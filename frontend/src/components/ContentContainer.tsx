import React, { FC, ReactNode } from 'react'
import styles from './components.module.css'

interface Prop {
  children: ReactNode
  gap?: number
}

const ContentContainer: FC<Prop> = ({ children, gap }) => {
  return (
    <div
      className={styles.contentContainer}
      style={{ gap }}
    >
      {children}
    </div>
  )
}

export default ContentContainer