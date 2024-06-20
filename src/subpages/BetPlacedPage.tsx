import { Stack } from '@chakra-ui/react'

const BetPlacedPage = () => {

  return (
    <Stack alignItems={'center'} gap={0} >
      <h1 style={{ marginBlock: '80px 40px', fontSize: 48, lineHeight: '56px', fontWeight: 700 }}>Bet Placed!</h1>
      <p style={{ fontSize: 20, lineHeight: '28px', fontWeight: 700 }}>Winning numbers for Round #123 will be revealed at 15:00 June 23, 2024.</p>
    </Stack>
  )
}

export default BetPlacedPage