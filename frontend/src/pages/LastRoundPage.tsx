import { usePage } from '@/atoms/page.atom'
import ContentContainer from '@/components/ContentContainer'
import ResultSection from '@/components/ResultSection/ResultSection'
import TeaButton from '@/components/TeaButton/TeaButton'
import YourNumber from '@/components/Text/YourNumber'
import { HStack } from '@chakra-ui/react'
import { useAccount } from '@starknet-react/core'
import styles from './pages.module.css'
import useGameInfo from '@/hooks/useGameInfo'

const LastRoundPage = () => {
  const { address: userAddress } = useAccount()
  const [, setPageName] = usePage()
  const { latestGameRound, latestTicketsResult } = useGameInfo()

  const userLatestRound = latestTicketsResult.userLatestRound


  const userLatestRoundNumber = latestTicketsResult.userTickets.picked_number
  const userLatestRoundResult = latestTicketsResult.userLatestRoundResult

  const isWin = Boolean(
    (userLatestRoundResult && userLatestRoundNumber)
    && userLatestRoundResult.join('') === userLatestRoundNumber.join('')
  )

  const isClaimed = latestTicketsResult.userTickets?.claimed

  const prize = latestTicketsResult.unclaimed_prize


  return (
    <ContentContainer>
      <h2 className={styles.title}>
        The Winning Numbers for Round #{userLatestRound || latestGameRound} are:
      </h2>

      <HStack gap={8}>
        {userLatestRoundResult?.map(i => (
          <span key={i} className={styles.winningNumber}>
            {i}
          </span>
        ))}
      </HStack>
      {userAddress && userLatestRoundResult
        ? <>
          <YourNumber _userNumbers={userLatestRoundNumber} />
          <ResultSection isClaimed={isClaimed} isWin={isWin} prize={prize} />
        </>
        : <TeaButton title='Place a New Bet' onClick={() => setPageName('choose-number')} />
      }
    </ContentContainer>
  )
}

export default LastRoundPage