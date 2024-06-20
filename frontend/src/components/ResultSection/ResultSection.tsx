import { usePage } from '@/atoms/page.atom'
import { asyncWrapper } from '@/utils/asyncWrapper'
import { formatUnits } from '@/utils/parseUnits'
import { FC, useState } from 'react'
import ButtonGroup from '../ButtonGroup/ButtonGroup'
import styles from './ResultSection.module.css'

interface Prop {
  isWin: boolean,
  isClaimed: boolean
  prize?: bigint
}

const ResultSection: FC<Prop> = ({ isWin, isClaimed, prize }) => {
  const [, setPageName] = usePage()
  const [isClaiming, setIsClaiming] = useState(false);

  const toChooseNumber = () => setPageName('choose-number')
  const claimPrize = () => asyncWrapper({
    name: 'claimPrize',
    shouldToast: true,
    setIsLoading: setIsClaiming,
    asyncFn: async () => {

    },
  })

  const disablePlaceAnotherBet = isClaiming
  const disableClaimPrize = isClaimed

  return (
    <div className={styles.container}>
      {isWin
        ? <p>
          Congratulations!<br />
          You won <span className={styles.prize}>{formatUnits(prize, 18)} USDC!</span>
        </p>
        : <p>Good luck next time!</p>
      }


      <ButtonGroup
        titles={['Place Another Bet', isClaimed ? 'Claimed' : 'Claim Prize']}
        outlined={[true, false]}
        functions={[toChooseNumber, claimPrize]}
        isLoading={[isClaiming, isClaiming]}
        disabled={[disablePlaceAnotherBet, disableClaimPrize]}
      />
    </div>
  )
}

export default ResultSection