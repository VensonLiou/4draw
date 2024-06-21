import { usePage } from '@/atoms/page.atom'
import useGame from '@/hooks/useGame'
import useGameInfo from '@/hooks/useGameInfo'
import { asyncWrapper } from '@/utils/asyncWrapper'
import { formatUnits } from '@/utils/parseUnits'
import { FC, useState } from 'react'
import ButtonGroup from '../ButtonGroup/ButtonGroup'
import styles from './ResultSection.module.css'
import usePaymentToken from '@/hooks/usePaymentToken'

interface Prop {

}

const ResultSection: FC<Prop> = () => {
  const [, setPageName] = usePage()
  const [isClaiming, setIsClaiming] = useState(false);
  const { refetchInfo } = useGameInfo()
  const { refetchPaymentToken } = usePaymentToken()
  const { claimPrize } = useGame()


  const { latestGameRound, latestTicketsResult, gameInfo } = useGameInfo()

  const userLatestRound = latestTicketsResult.userLatestRound


  const userLatestRoundNumber = latestTicketsResult.userTickets?.picked_number
  const userLatestRoundResult = latestTicketsResult.userLatestRoundResult

  const isWin = Boolean(
    (userLatestRoundResult && userLatestRoundNumber)
    && userLatestRoundResult.join('') === userLatestRoundNumber.join('')
  )

  const isClaimed = Boolean(latestTicketsResult.userTickets?.claimed)

  const prize = latestTicketsResult.unclaimed_prize

  const gameNotStarted = gameInfo.game_status === 'NotStarted'
  const waitingForNextRound = gameNotStarted || gameInfo.game_status === 'Ended'

  // functions
  const toChooseNumber = () => setPageName('choose-number')
  const claim = () => asyncWrapper({
    name: 'claim',
    shouldToast: true,
    setIsLoading: setIsClaiming,
    asyncFn: claimPrize,
    onSuccess: async () => await Promise.all([refetchInfo(), refetchPaymentToken()])
  })

  // disables
  const disablePlaceAnotherBet = isClaiming || Boolean(gameNotStarted)
  const disableClaimPrize = isClaimed

  return (
    <div className={styles.container}>
      <p>
        {isWin && <span>Congratulations!<br /></span>}
        {isWin && isClaimed
          ? <>You have claimed your prize.</>
          : <>You won <span className={styles.prize}>{formatUnits(prize, 18)} USDC!</span></>
        }
      </p>

      {waitingForNextRound && <p>Please wait for game manager to start a new round.</p>}
      <ButtonGroup
        titles={[
          'Place Another Bet',
          isClaimed ? 'Claimed' : 'Claim Prize'
        ]}
        outlined={[true, false]}
        functions={[toChooseNumber, claim]}
        isLoading={[false, isClaiming]}
        disabled={[disablePlaceAnotherBet, disableClaimPrize]}
      />
    </div>
  )
}

export default ResultSection