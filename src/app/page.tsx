'use client'
import { PageName, usePage } from "@/atoms/page.atom";
import useGameInfo from "@/hooks/useGameInfo";
import BetPlacedPage from "@/pages/BetPlacedPage";
import ChooseBetTypePage from "@/pages/ChooseBetTypePage";
import ChooseNumberPage from "@/pages/ChooseNumberPage";
import LastRoundPage from "@/pages/LastRoundPage";
import PlaceBetPage from "@/pages/PlaceBetPage";
import { Spinner } from "@chakra-ui/react";
import { ReactNode } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [pageName] = usePage()
  const { gameInfo, latestGameRound, latestTicketsResult } = useGameInfo()

  // 檢查有沒有前一輪
  const isFirstRound = latestGameRound === 1 && gameInfo?.game_status === 'Started'

  // 判斷本局是否 ended
  const isEnded = gameInfo?.game_status === 'Ended'

  // 判斷是否已經開獎
  const isRevealed = gameInfo?.game_status === 'Ended'


  let redirect: PageName = pageName

  // 沒有前一輪，跳過結果頁
  if (pageName === 'last-round' && isFirstRound) redirect = 'choose-number'

  // 有前一輪，但未開獎，改去開獎頁面
  else if (isEnded && !isRevealed) redirect = 'open-prize'

  // redirect = 'open-prize'

  const PAGE_MAP: { [page in PageName]: ReactNode } = {
    "last-round": <LastRoundPage />,
    "choose-number": <ChooseNumberPage />,
    "choose-bet-type": <ChooseBetTypePage />,
    "place-bet": <PlaceBetPage />,
    "bet-placed": <BetPlacedPage />,
    "open-prize": "open-prize",
    "claim": "claim",
  }


  return (
    <main className={styles.main}>
      {gameInfo?.game_status
        ? PAGE_MAP[redirect]
        : <Spinner
          thickness='6px'
          speed='0.8s'
          emptyColor='gray.200'
          color='p.600'
          size='xl'
        />
      }
    </main>
  );
}
