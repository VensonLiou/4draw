import { usePage } from '@/atoms/page.atom'
import TeaButton from '@/components/TeaButton/TeaButton'
import useGame from '@/hooks/useGame'
import useGameInfo from '@/hooks/useGameInfo'
import { asyncWrapper } from '@/utils/asyncWrapper'
import { Stack } from '@chakra-ui/react'
import { useAccount } from '@starknet-react/core'
import { useState } from 'react'

const RevealPage = () => {
  const { latestGameRound, refetchInfo } = useGameInfo()
  const { address: userAddress } = useAccount()
  const { requestRevealResult } = useGame()
  const [, setPageName] = usePage()

  const [isRevealing, setIsRevealing] = useState(false);

  const reveal = () => asyncWrapper({
    name: 'reveal',
    shouldToast: true,
    setIsLoading: () => { },
    asyncFn: async () => {
      setIsRevealing(true)
      await requestRevealResult()
    },
    onError: () => setIsRevealing(false),
    onSuccess: async () => setPageName('revealing'),
    onFinish: async () => await refetchInfo(),
  })

  return (
    <Stack alignItems={'center'} gap={0} >
      <h1 style={{ marginBlock: '80px 40px', fontSize: 40, lineHeight: '48px', fontWeight: 700 }}>
        Round #{latestGameRound} Ended.
      </h1>

      {!userAddress &&
        <p style={{ fontSize: 20, lineHeight: '28px', fontWeight: 700, marginBottom: 40 }}>
          Connect your wallet to check your numbers.
        </p>
      }

      <TeaButton
        title={'Reveal Winning Numbers'}
        disabled={Boolean(!userAddress)}
        onClick={reveal}
        isLoading={isRevealing}
      />
    </Stack>
  )
}

export default RevealPage