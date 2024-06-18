import { usePage } from '@/atoms/page.atom'
import ButtonGroup from '@/components/ButtonGroup/ButtonGroup'
import ContentContainer from '@/components/ContentContainer'
import StepContainer from '@/components/StepContainer'
import StepContentContainer from '@/components/StepContentContainer'
import StepTitle from '@/components/Text/StepTitle'

const ChooseBetTypePage = () => {
  const [, setPage] = usePage()
  const back = () => setPage('choose-number')
  const toNext = () => setPage('choose-bet-type')
  return (
    <ContentContainer>
      <StepContainer>
        <StepTitle step={2} title="Choose Bet Type & Insert Number of Tickets" />
        <StepContentContainer>

          content

        </StepContentContainer>
      </StepContainer>
      <ButtonGroup
        functions={[back, toNext]}
      />
    </ContentContainer>
  )
}

export default ChooseBetTypePage