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
  const [, setPageName] = usePage()
  const { latestGameRound, latestTicketsResult, gameInfo, previusRoundResult } = useGameInfo()


  const latestRoundResult = gameInfo.latest_result_number
  const userLatestRoundResult = latestTicketsResult.userLatestRoundResult
  const displayedResult = userLatestRoundResult ?? latestRoundResult ?? previusRoundResult

  const userLatestRoundNumber = latestTicketsResult.userTickets?.picked_number

  const gameNotStarted = gameInfo.game_status === 'NotStarted'
  const waitingForNextRound = gameNotStarted || gameInfo.game_status === 'Ended'

  const userPlayedBefore = latestTicketsResult.userLatestRound > 0

  if (latestGameRound === undefined) return null

  const displayedRound = !userPlayedBefore && latestRoundResult === undefined
    ? latestGameRound - 1
    : latestGameRound



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

      {!userPlayedBefore && waitingForNextRound && <p>Please wait for game manager to start a new round.</p>}

      {userPlayedBefore ? <>
        <YourNumber _userNumbers={userLatestRoundNumber} />
        <ResultSection />
      </>
        : <TeaButton title='Place a New Bet' onClick={() => setPageName('choose-number')} disabled={waitingForNextRound} />
      }
    </ContentContainer>
  )
}

export default LastRoundPage