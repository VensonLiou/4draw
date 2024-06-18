import React, { FC, ReactNode } from 'react'
import styles from './components.module.css'

interface Prop {
  children: ReactNode
}

const ContentContaner: FC<Prop> = ({ children }) => {
  return (
    <div className={styles.contentContainer}>
      {children}
    </div>
  )
}

export default ContentContaner