import React, { FC } from 'react'
import styles from './SelectTypeSection.module.css'
import { BetType, useBetTypes } from '@/atoms/betTypes.atom'
import { HStack, PinInput, PinInputField, Stack } from '@chakra-ui/react'
import { CapitalizeFirstLetter } from '@/utils/utils'

const SelectTypeSection = () => {
  const [betTypes, setBetTypes] = useBetTypes()

  const onChange = (newValue: string, type: BetType) => {
    const newTypes = { ...betTypes }
    newTypes[type] = Number(newValue)
    setBetTypes(newTypes)
  }

  return (
    <section className={styles.container}>
      <Stack gap={6}>
        <TypeAmountInput type="straight" value={betTypes['straight']} onChange={onChange} />
        <TypeAmountInput type="set" value={betTypes['set']} onChange={onChange} />
        <TypeAmountInput type="box" value={betTypes['box']} onChange={onChange} />
        <TypeAmountInput type="mini" value={betTypes['mini']} onChange={onChange} />
      </Stack>
    </section>
  )
}

export default SelectTypeSection


interface Prop {
  type: BetType
  value?: number
  onChange: (newValue: string, type: BetType) => void
}

const TypeAmountInput: FC<Prop> = ({ type, value, onChange }) => {
  return (
    <HStack justifyContent={'space-between'} alignItems={'center'} minW={'280px'}>
      <h2 className={styles.typeName}>{CapitalizeFirstLetter(type)}: </h2>
      <HStack gap={4}>
        <PinInput placeholder='' focusBorderColor='p.600' value={value === undefined ? '' : String(value)} >
          <PinInputField
            color={'p.600'}
            borderColor={'p.600'}
            fontSize={28}
            min={0} max={99}
            onChange={e => onChange(e.target.value, type)}
          />
        </PinInput>
        <span>tickets</span>
      </HStack>
    </HStack>
  )
}