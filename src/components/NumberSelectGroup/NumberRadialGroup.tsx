'use client'
import { useUserNumbers } from '@/atoms/userNumbers.atom'
import { Radio, RadioGroup, Stack } from '@chakra-ui/react'
import { FC } from 'react'

interface Prop {
  nthNumber: number
}

const NumberRadialGroup: FC<Prop> = ({  nthNumber }) => {
  const [userNumbers, setUserNumbers] = useUserNumbers()
  const thisNumber = userNumbers[nthNumber]

  const onSelect = (nextValue?: string) => {
    if (Number(nextValue) === thisNumber) nextValue = undefined
    const newNumbers = [...userNumbers]
    newNumbers[nthNumber] = Number(nextValue)
    setUserNumbers(newNumbers)
  }
  return (
    <RadioGroup value={String(thisNumber)} colorScheme='p.600' onChange={onSelect}>
      <Stack spacing={4}>
        {NUMBERS.map(n => (
          <Radio
            key={n}
            value={n}
            colorScheme='p'
            color={'lightgrey'}
            width={'80px'}
            justifyContent={'center'}
            spacing={3}
          >
            {n}
          </Radio>
        ))}
      </Stack>
    </RadioGroup>
  )
}

export default NumberRadialGroup

const NUMBERS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']