import { HStack } from '@chakra-ui/react'
import { FC } from 'react'
import TeaButton from '../TeaButton/TeaButton'
import styles from './ButtonGroup.module.css'

interface Prop {
  titles?: string[]
  functions?: (() => void)[]
  outlined?: boolean[]
  disabled?: boolean[]
  isLoading?: boolean[]
}

const ButtonGroup: FC<Prop> = ({ titles, functions, outlined, disabled, isLoading }) => {
  if (!titles) titles = ['Back', 'Next']
  if (!outlined) outlined = [true, false]

  return (
    <HStack className={styles.container} gap={[4, 10]} flexWrap={'wrap'}>
      {titles?.map((title, idx) => (
        <TeaButton
          key={title}
          title={title}
          onClick={functions?.[idx]}
          outlined={outlined?.[idx]}
          disabled={disabled?.[idx]}
          isLoading={isLoading?.[idx]}
          secondary
        />
      ))}
    </HStack>
  )
}

export default ButtonGroup