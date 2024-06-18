'use client'
import { useUserNumbers } from '@/atoms/userNumbers.atom'
import { PinInput, PinInputField } from '@chakra-ui/react'
import { FC } from 'react'

interface Prop {
  nthNumber: number
}

const Pin: FC<Prop> = ({ nthNumber }) => {
  const [userNumbers, setUserNumbers] = useUserNumbers()
  const thisNumber = userNumbers[nthNumber]

  return (
    <PinInput placeholder='' focusBorderColor='p.600' value={thisNumber?.toString()} >
      <PinInputField
        readOnly
        color={'p.600'}
        borderColor={'p.600'}
        fontSize={28}
        min={0} max={9}
      />
    </PinInput>
  )
}

export default Pin