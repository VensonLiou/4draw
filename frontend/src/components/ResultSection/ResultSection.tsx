import { usePage } from '@/atoms/page.atom'
import { asyncWrapper } from '@/utils/asyncWrapper'
import { useState } from 'react'
import ButtonGroup from '../ButtonGroup/ButtonGroup'
import styles from './ResultSection.module.css'

const ResultSection = () => {
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
  const isClaimed = false
  const disableClaimPrize = isClaimed

  const prize = '500.00'

  return (
    <div className={styles.container}>
      <p>
        Congratulations!<br />
        You won <span className={styles.prize}>{prize} USDC!</span>
      </p>

      <ButtonGroup
        titles={['Place Another Bet', 'Claim Prize']}
        outlined={[true, false]}
        functions={[toChooseNumber, claimPrize]}
        isLoading={[isClaiming, isClaiming]}
        disabled={[disablePlaceAnotherBet, disableClaimPrize]}
      />
    </div>
  )
}

export default ResultSection