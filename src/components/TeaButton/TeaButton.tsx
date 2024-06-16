'use client'
import { FC } from 'react'
import Loading from 'react-loading'
import styles from './TeaButton.module.css'

interface Prop {
  title: string
  outlined?: boolean
  secondary?: boolean
  disabled?: boolean
  isLoading?: boolean
  onClick?: () => void
}

const TeaButton: FC<Prop> = ({ title, secondary, outlined, disabled, isLoading, onClick }) => {
  const loadingColor = !outlined
    ? '#f1f1f1'
    : secondary
      ? '#2C88D9'
      : '#6558F5'

  return (
    <button
      {...{ disabled, onClick }}
      className={
        styles.container + ' '
        + (secondary ? styles.secondary : '') + ' '
        + (outlined ? styles.outlined : '')
      }
    >
      {isLoading
        ? <Loading
          type='spinningBubbles'
          width={28} height={28}
          color={loadingColor}
        />
        : title}
    </button>
  )
}

export default TeaButton