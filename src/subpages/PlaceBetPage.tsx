
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
import useGame from '@/hooks/useGame'
import useGameInfo from '@/hooks/useGameInfo'
import usePaymentToken from '@/hooks/usePaymentToken'
import { asyncWrapper } from '@/utils/asyncWrapper'
import { betTypesInvalid, userNumbersInvalid } from '@/utils/stateCheck'
import { useAccount } from '@starknet-react/core'
import { useState } from 'react'

const PlaceBetPage = () => {
  const { address: userAddress } = useAccount()
  const [, setPage] = usePage()
  const [userNumbers] = useUserNumbers()
  const [betTypes] = useBetTypes()
  const { approveAndBuy } = useGame()
  const { refetchPaymentToken } = usePaymentToken()
  const { refetchInfo } = useGameInfo()

  const back = () => setPage('choose-bet-type')
  const toNext = () => setPage('bet-placed')

  const [isBuying, setIsBuying] = useState(false);
  const buy = () => asyncWrapper({
    name: 'buy',
    shouldToast: true,
    setIsLoading: setIsBuying,
    asyncFn: async () => {
      const _userNumber = userNumbers.join('')
      const N = (input: any) => String(input ?? 0)

      await approveAndBuy(_userNumber, N(betTypes.straight), N(betTypes.box), N(betTypes.set), N(betTypes.mini))
    },
    onFinish: async () => await Promise.all([refetchInfo(), refetchPaymentToken()]),
    onSuccess: () => toNext()
  })

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
        functions={[back, buy]}
        disabled={[false, disableNext]}
        isLoading={[false, isBuying]}
      />

    </ContentContainer>
  )
}

export default PlaceBetPage