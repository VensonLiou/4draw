import useGameInfo from '@/hooks/useGameInfo'
import { formatDate } from '@/utils/utils'
import { Stack } from '@chakra-ui/react'

const BetPlacedPage = () => {
  const { latestGameRound, gameInfo } = useGameInfo()

  const endTimeString = formatDate(gameInfo.end_time, 'HH:MM mmmm dd, yyyy')

  return (
    <Stack alignItems={'center'} gap={0} >
      <h1 style={{ marginBlock: '80px 40px', fontSize: 48, lineHeight: '56px', fontWeight: 700 }}>Bet Placed!</h1>
      <p style={{ fontSize: 20, lineHeight: '28px', fontWeight: 700 }}>Winning numbers for Round #{latestGameRound ?? ''} can be revealed at {endTimeString}.</p>
    </Stack>
  )
}

export default BetPlacedPage