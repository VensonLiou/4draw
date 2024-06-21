import { BetTypes } from '@/atoms/betTypes.atom'
import BetTypeSummarySection from '@/components/BetTypeSummarySection/BetTypeSummarySection'
import FeeSection from '@/components/FeeSection/FeeSection'
import StepContentContainer from '@/components/StepContentContainer'
import YourNumber from '@/components/Text/YourNumber'
import useGameInfo from '@/hooks/useGameInfo'
import { formatDate } from '@/utils/utils'
import { Stack } from '@chakra-ui/react'

const BetPlacedPage = () => {
  const { latestGameRound, gameInfo, latestTicketsResult } = useGameInfo()
  const { picked_number, straight_amount, box_amount, set_amount, mini_amount } = latestTicketsResult.userTickets ?? {}
  const endTimeString = formatDate(gameInfo.end_time, 'HH:MM mmmm dd, yyyy')
  const betTypes: BetTypes = {
    straight: straight_amount,
    box: box_amount,
    set: set_amount,
    mini: mini_amount,
  }

  return (
    <Stack alignItems={'center'} gap={0} >
      <h1 style={{ marginBlock: '80px 40px', fontSize: 48, lineHeight: '56px', fontWeight: 700 }}>Bet Placed!</h1>
      <Stack gap={'20px'}>
        <YourNumber _userNumbers={picked_number} />
        <BetTypeSummarySection _betTypes={betTypes} />
      </Stack>
      <p style={{ fontSize: 20, lineHeight: '28px', fontWeight: 700, marginTop: 40 }}>Winning numbers for Round #{latestGameRound ?? ''} can be revealed at {endTimeString}.</p>
    </Stack>
  )
}

export default BetPlacedPage