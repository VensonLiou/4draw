import { BetType, useBetTypes } from '@/atoms/betTypes.atom'
import { CapitalizeFirstLetter } from '@/utils/utils'
import { HStack, NumberInput, NumberInputField, Stack } from '@chakra-ui/react'
import { FC } from 'react'
import styles from './SelectTypeSection.module.css'

const SelectTypeSection = () => {
  const [betTypes, setBetTypes] = useBetTypes()

  const onChange = (newValue: string, type: BetType) => {
    const newNumber = Number(newValue)
    let num: undefined | number
    if (newValue === '') num = undefined
    else if (newNumber > 99) num = newNumber % 100
    else if (newNumber < 0) num = 0
    else num = newNumber
    const newTypes = { ...betTypes }
    newTypes[type] = num
    setBetTypes(newTypes)
  }

  return (
    <section className={styles.container}>
      <Stack gap={6}>
        <TypeAmountInput type="straight" value={betTypes['straight']} onChange={onChange} />
        <TypeAmountInput type="box" value={betTypes['box']} onChange={onChange} />
        <TypeAmountInput type="set" value={betTypes['set']} onChange={onChange} />
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
    <HStack justifyContent={'space-between'} alignItems={'center'} minW={'280px'} maxW={320}>
      <h2 className={styles.typeName}>{CapitalizeFirstLetter(type)}: </h2>
      <HStack gap={4}>
        <NumberInput focusBorderColor='p.600' value={value === undefined ? '' : String(value)} >
          <NumberInputField
            textAlign={'center'}
            color={'p.600'}
            borderColor={'p.600'}
            fontSize={28}
            min={0} max={99}
            width={'50px'}
            type='number'
            padding={'1px 8px'}
            onChange={e => onChange(e.target.value, type)}
          />
        </NumberInput>
        <span>tickets</span>
      </HStack>
    </HStack>
  )
}