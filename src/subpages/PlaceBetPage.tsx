
import { useBetTypes } from '@/atoms/betTypes.atom'
import { usePage } from '@/atoms/page.atom'
import { useUserNumbers } from '@/atoms/userNumbers.atom'
import BetTypeSummarySection from '@/components/BetTypeSummarySection/BetTypeSummarySection'
import ButtonGroup from '@/components/ButtonGroup/ButtonGroup'
import ContentContainer from '@/components/ContentContainer'
import FeeSection from '@/components/FeeSection/FeeSection'
import StepContainer from '@/components/StepContainer'
import StepContentContainer from '@/components/StepContentContainer'
import StepTitle from '@/components/Text/StepTitle'
import YourNumber from '@/components/Text/YourNumber'
import { betTypesInvalid, userNumbersInvalid } from '@/utils/stateCheck'
import { useAccount } from '@starknet-react/core'

const PlaceBetPage = () => {
  const { address: userAddress } = useAccount()
  const [, setPage] = usePage()
  const [userNumbers] = useUserNumbers()
  const [betTypes] = useBetTypes()

  const back = () => setPage('choose-bet-type')
  const toNext = () => setPage('bet-placed')

  const disableNext = userNumbersInvalid(userNumbers) || betTypesInvalid(betTypes) || !userAddress

  return (
    <ContentContainer>

      <StepContainer >
        <StepTitle step={3} title="Connect Wallet" />
        <StepContentContainer>
          <p style={{ fontSize: 20, marginBottom: 160 }}>
            Please connect your wallet to place your bet.
          </p>
        </StepContentContainer>
      </StepContainer>


      <StepContainer>
        <StepTitle step={4} title="Place your bet" />
        <StepContentContainer gap={20}>
          <YourNumber />
          <BetTypeSummarySection />
          <FeeSection />
        </StepContentContainer>
      </StepContainer>


      <ButtonGroup
        titles={['Back', 'Confirm']}
        functions={[back, toNext]}
        disabled={[false, disableNext]}
      />

    </ContentContainer>
  )
}

export default PlaceBetPage