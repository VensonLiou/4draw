import { useBetTypes } from '@/atoms/betTypes.atom'
import { usePage } from '@/atoms/page.atom'
import ButtonGroup from '@/components/ButtonGroup/ButtonGroup'
import ContentContainer from '@/components/ContentContainer'
import FeeSection from '@/components/FeeSection/FeeSection'
import SelectTypeSection from '@/components/SelectTypeSection/SelectTypeSection'
import StepContainer from '@/components/StepContainer'
import StepContentContainer from '@/components/StepContentContainer'
import StepTitle from '@/components/Text/StepTitle'
import YourNumber from '@/components/Text/YourNumber'
import TotalBetSection from '@/components/TotalBetSection/TotalBetSection'
import TypeExplainSection from '@/components/TypeExplainSection/TypeExplainSection'
import { betTypesInvalid } from '@/utils/stateCheck'
import { Stack } from '@chakra-ui/react'

const ChooseBetTypePage = () => {

  const [, setPage] = usePage()
  const [betTypes] = useBetTypes()

  const back = () => setPage('choose-number')
  const toNext = () => setPage('place-bet')

  const disableNext = betTypesInvalid(betTypes)

  return (
    <ContentContainer>
      <YourNumber />
      <StepContainer>
        <StepTitle step={2} title="Choose Bet Type & Insert Number of Tickets" />
        <StepContentContainer>

          <Stack
            gap={['40px', null, null, '80px']}
            direction={['column', null, null, 'row']}
          >
            <SelectTypeSection />
            <Stack gap={'40px'}>
              <TypeExplainSection />
              <FeeSection showDetail />
            </Stack>
          </Stack>

          <TotalBetSection />

        </StepContentContainer>
      </StepContainer>
      <ButtonGroup
        functions={[back, toNext]}
        disabled={[false, disableNext]}
      />
    </ContentContainer>
  )
}

export default ChooseBetTypePage