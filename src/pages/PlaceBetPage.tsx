import { usePage } from '@/atoms/page.atom'
import { useUserNumbers } from '@/atoms/userNumbers.atom'
import ButtonGroup from '@/components/ButtonGroup/ButtonGroup'
import ContentContainer from '@/components/ContentContainer'
import FeeSection from '@/components/FeeSection/FeeSection'
import StepContainer from '@/components/StepContainer'
import StepContentContainer from '@/components/StepContentContainer'
import StepTitle from '@/components/Text/StepTitle'
import YourNumber from '@/components/Text/YourNumber'

const PlaceBetPage = () => {

  const [, setPage] = usePage()
  const [userNumbers] = useUserNumbers()

  const back = () => setPage('choose-bet-type')
  const toNext = () => setPage('bet-placed')

  const disableNext = userNumbers.length !== 4 || [...userNumbers].some(i => i === undefined)

  return (
    <ContentContainer>
      <StepContainer >
        <StepTitle step={3} title="Connect Wallet" />
        <StepContentContainer>
          <p style={{ fontSize: 20, marginBottom: 160 }}>Please connect your wallet to place your bet.</p>
        </StepContentContainer>
      </StepContainer>

      <StepContainer>
        <StepTitle step={4} title="Place your bet" />
        <StepContentContainer gap={20}>
          <YourNumber />
          <FeeSection />
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

export default PlaceBetPage