'use client'
import { useUserNumbers } from '@/atoms/userNumbers.atom'
import { handleOrdinal } from '@/utils/handleOrdinal'
import { NumberInput, NumberInputField } from '@chakra-ui/react'
import { FC } from 'react'
import styles from './NumberSelectGroup.module.css'

interface Prop {
  nthNumber: number
}

const NumberSelectGroup: FC<Prop> = ({ nthNumber }) => {
  const nthDisplay = nthNumber + 1
  const [userNumbers, setUserNumbers] = useUserNumbers()
  const onNumberChange = (newValue?: number) => {
    const newNumber = Number(newValue)
    const newNumbers = [...userNumbers]
    newNumbers[nthNumber] = newNumber
    setUserNumbers(newNumbers)
  }
  return (
    <div className={styles.container}>
      <NumberInput min={0} max={9} >
        <NumberInputField
          textColor={'#6558F5'}
          borderColor={'#6558F5'}
          ringColor={'#6558F5'}
          color={'#6558F5'}
          fontSize={28}
          width={50}
          onChange={e => onNumberChange(Number(e.target.value))}
          value={userNumbers[nthNumber]}
        />
      </NumberInput>
      <h3>{nthDisplay}{handleOrdinal(nthDisplay)} Number</h3>
      
    </div>
  )
}

export default NumberSelectGroup