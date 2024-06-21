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
import useGameInfo from '@/hooks/useGameInfo'
import { betTypesInvalid } from '@/utils/stateCheck'
import { Stack } from '@chakra-ui/react'

const ChooseBetTypePage = () => {

  const [, setPage] = usePage()
  const [betTypes] = useBetTypes()
  const { gameInfo } = useGameInfo()

  const price = gameInfo.ticket_price
  const doublePrice = gameInfo.ticket_price * 2n
  const entries = Object.entries(betTypes)
  const fee = entries.reduce((prev, currentEntry) => {
    const [key, value] = currentEntry
    if (key === 'set') return prev + BigInt(value ?? 0n) * doublePrice
    return prev + (BigInt(value ?? 0n) * price)
  }, 0n)


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
              <FeeSection showDetail fee={fee} />
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