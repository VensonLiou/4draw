import { usePage } from '@/atoms/page.atom'
import { useUserNumbers } from '@/atoms/userNumbers.atom'
import ButtonGroup from '@/components/ButtonGroup/ButtonGroup'
import ContentContainer from '@/components/ContentContainer'
import NumberSelectGroup from '@/components/NumberSelectGroup/NumberSelectGroup'
import StepContainer from '@/components/StepContainer'
import StepContentContainer from '@/components/StepContentContainer'
import StepTitle from '@/components/Text/StepTitle'
import { HStack } from '@chakra-ui/react'

const ChooseNumberPage = () => {
  const [, setPage] = usePage()
  const toNext = () => setPage('choose-bet-type')
  const [userNumbers] = useUserNumbers()
  const disableNext = userNumbers.length !== 4 || [...userNumbers].some(i => i === undefined)
  
  return (
    <ContentContainer>
      <StepContainer>
        <StepTitle step={1} title="Choose your numbers" />
        <StepContentContainer>
          <HStack gap={[2, 5]}>
            <NumberSelectGroup nthNumber={0} />
            <NumberSelectGroup nthNumber={1} />
            <NumberSelectGroup nthNumber={2} />
            <NumberSelectGroup nthNumber={3} />
          </HStack>
        </StepContentContainer>
      </StepContainer>
      <ButtonGroup
        titles={['Next']}
        functions={[toNext]}
        outlined={[false]}
        disabled={[disableNext]}
      />
    </ContentContainer>
  )
}

export default ChooseNumberPage