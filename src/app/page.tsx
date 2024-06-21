'use client'
import { PageName, usePage } from "@/atoms/page.atom";
import useGameInfo from "@/hooks/useGameInfo";
import BetPlacedPage from "@/subpages/BetPlacedPage";
import ChooseBetTypePage from "@/subpages/ChooseBetTypePage";
import ChooseNumberPage from "@/subpages/ChooseNumberPage";
import LastRoundPage from "@/subpages/LastRoundPage";
import PlaceBetPage from "@/subpages/PlaceBetPage";
import RevealPage from "@/subpages/RevealPage";
import { Spinner } from "@chakra-ui/react";
import { ReactNode } from "react";
import styles from "./page.module.css";
import RevealingPage from "@/subpages/RevealingPage";


export default function Home() {
  const [pageName, setPageName] = usePage()
  const { gameInfo, latestGameRound, latestTicketsResult } = useGameInfo()
  console.log(useGameInfo())

  if (latestGameRound === undefined) return (
    <main className={styles.main}>
      <Loading />
    </main>
  )
  // 檢查是不是第0輪
  const notStarted = gameInfo?.game_status === 'NotStarted'

  // 檢查有沒有前一輪
  const isFirstRound = latestGameRound === 1 && gameInfo?.game_status === 'Started'

  // 判斷本局是否 ended
  const isEnded = gameInfo?.game_status === 'Started' && (Date.now() / 1000) > gameInfo.end_time

  // 判斷是否已經開獎
  const isRevealed = gameInfo?.game_status === 'Ended'

  // 判斷用戶這輪有沒有下注，有就跳過選好
  const alreadyBought = latestTicketsResult.userLatestRound === latestGameRound

  // 判斷是否正在開獎
  const isRevealing = gameInfo?.game_status === 'Revealing'

  // console.log(latestTicketsResult.userLatestRound , latestGameRound)
  // console.log(alreadyBought)
  // console.log(isRevealed) 
  // console.log(isEnded)
  // console.log(pageName)

  let redirect: PageName = pageName

  if (notStarted) return <LastRoundPage />

  // 沒有前一輪，跳過結果頁
  else if (pageName === 'last-round' && isFirstRound) redirect = 'choose-number'

  // 有前一輪，已買票，但本輪還沒結束，改去下注完成頁面
  else if (!isEnded && alreadyBought) redirect = 'bet-placed'

  // 有前一輪，未買票，本輪結束但未開獎，改去開獎頁面
  else if (!alreadyBought && isEnded && !isRevealed) redirect = 'open-prize'



  // 但若已開獎，直接跳去結果頁
  if (isRevealed) setPageName('last-round')

  // 如果正在開獎
  if (isRevealing) setPageName('revealing')

  redirect = 'place-bet'

  const PAGE_MAP: { [page in PageName]: ReactNode } = {
    "last-round": <LastRoundPage />,
    "choose-number": <ChooseNumberPage />,
    "choose-bet-type": <ChooseBetTypePage />,
    "place-bet": <PlaceBetPage />,
    "bet-placed": <BetPlacedPage />,
    "open-prize": <RevealPage />,
    "revealing": <RevealingPage />
  }


  return (
    <main className={styles.main}>
      {gameInfo?.game_status
        ? PAGE_MAP[redirect]
        : <Loading />
      }
    </main>
  );
}


const Loading = () =>
  <Spinner
    thickness='6px'
    speed='0.8s'
    emptyColor='gray.200'
    color='p.600'
    size='xl'
  />