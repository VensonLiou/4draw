import { usePage } from '@/atoms/page.atom'
import ContentContainer from '@/components/ContentContainer'
import ResultSection from '@/components/ResultSection/ResultSection'
import TeaButton from '@/components/TeaButton/TeaButton'
import YourNumber from '@/components/Text/YourNumber'
import { HStack } from '@chakra-ui/react'
import { useAccount } from '@starknet-react/core'
import styles from './pages.module.css'

const LastRoundPage = () => {
  const { address: userAddress } = useAccount()
  const [pageName, setPageName] = usePage()

  // 判斷是否已經開獎
  const isPrizeRevealed = true


  const winningNumber = [1, 2, 3, 4] as number[] | undefined

  const userLastRoundNumber = [3, 1, 4, 1] as number[] | undefined
  // const userLastRoundNumber = undefined

  const isWin = (winningNumber && userLastRoundNumber)
    && winningNumber.join('') === userLastRoundNumber.join('')


  return (
    <ContentContainer>
      <h2 className={styles.title}>
        The Winning Numbers for Round #123 are:
      </h2>

      <HStack gap={8}>
        {winningNumber?.map(i => (
          <span key={i} className={styles.winningNumber}>
            {i}
          </span>
        ))}
      </HStack>
      {userAddress && userLastRoundNumber
        ? <>
          <YourNumber _userNumbers={userLastRoundNumber} />
          <ResultSection />
        </>
        : <TeaButton title='Place a New Bet' onClick={() => setPageName('choose-number')} />
      }
    </ContentContainer>
  )
}

export default LastRoundPage