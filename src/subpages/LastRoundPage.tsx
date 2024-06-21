import { usePage } from '@/atoms/page.atom'
import ContentContainer from '@/components/ContentContainer'
import ResultSection from '@/components/ResultSection/ResultSection'
import TeaButton from '@/components/TeaButton/TeaButton'
import YourNumber from '@/components/Text/YourNumber'
import useGameInfo from '@/hooks/useGameInfo'
import { HStack } from '@chakra-ui/react'
import { useAccount } from '@starknet-react/core'
import styles from './pages.module.css'

const LastRoundPage = () => {
  const { address: userAddress } = useAccount()
  const [, setPageName] = usePage()
  const { latestGameRound, latestTicketsResult, gameInfo, previusRoundResult } = useGameInfo()

  if (!latestGameRound) return null

  const latestRoundResult = gameInfo.latest_result_number
  const userLatestRoundResult = latestTicketsResult.userLatestRoundResult
  const displayedResult = userLatestRoundResult ?? latestRoundResult ?? previusRoundResult


  const userLatestRound = latestTicketsResult.userLatestRound
  const displayedRound = userLatestRound ||
    latestRoundResult === undefined
    ? latestGameRound - 1
    : latestGameRound

  const userLatestRoundNumber = latestTicketsResult.userTickets?.picked_number

  const gameNotStarted = gameInfo.game_status === 'NotStarted'
  const waitingForNextRound = gameNotStarted || gameInfo.game_status === 'Ended'

  return (
    <ContentContainer>
      {!gameNotStarted && <h2 className={styles.title}>
        The Winning Numbers for Round #{displayedRound} are:
      </h2>}

      <HStack gap={8}>
        {displayedResult?.map(i => (
          <span key={i} className={styles.winningNumber}>
            {i}
          </span>
        ))}
      </HStack>

      {(userAddress && userLatestRoundResult)
        ? <>
          <YourNumber _userNumbers={userLatestRoundNumber} />
          <ResultSection />
        </>
        : <>
          {waitingForNextRound && <p>Please wait for game manager to start a new round.</p>}
          <TeaButton title='Place a New Bet' onClick={() => setPageName('choose-number')} disabled={waitingForNextRound} />
        </>
      }
    </ContentContainer>
  )
}

export default LastRoundPage