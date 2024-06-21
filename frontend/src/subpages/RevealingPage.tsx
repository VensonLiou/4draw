import { COLOR } from '@/css/Colors'
import useGameInfo from '@/hooks/useGameInfo'
import { Stack } from '@chakra-ui/react'
import { useEffect } from 'react'
import Loading from 'react-loading'

const RevealingPage = () => {
  const { latestGameRound, refetchInfo } = useGameInfo()

  useEffect(() => {
    const timer = setInterval(refetchInfo, 100000)

    return () => clearInterval(timer)
  }, [])

  if (!latestGameRound) return null
  return (
    <Stack alignItems={'center'} gap={0} >
      <h1 style={{ marginBlock: '80px 40px', fontSize: 48, lineHeight: '56px', fontWeight: 700 }}>Round #{latestGameRound} is Revealing.</h1>
      <Loading width={80} height={80} type='spokes' color={COLOR.Secondary} />
      <p style={{ fontSize: 20, lineHeight: '28px', fontWeight: 700, marginTop: '40px' }}>Please wait a few minutes.</p>
    </Stack>
  )
}

export default RevealingPage