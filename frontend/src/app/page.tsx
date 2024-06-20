'use client'
import { PageName, usePage } from "@/atoms/page.atom";
import BetPlacedPage from "@/pages/BetPlacedPage";
import ChooseBetTypePage from "@/pages/ChooseBetTypePage";
import ChooseNumberPage from "@/pages/ChooseNumberPage";
import LastRoundPage from "@/pages/LastRoundPage";
import PlaceBetPage from "@/pages/PlaceBetPage";
import { ReactNode } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [pageName] = usePage()

  // TODO: 檢查有沒有前一輪
  const isFirstRound = true

  // TODO: 判斷是否已經開獎
  const isPrizeRevealed = true

  let redirect: PageName = pageName

  // 沒有前一輪，直接去選號頁
  if (pageName === 'last-round' && isFirstRound) redirect = 'choose-number'
  
  // 有前一輪，但未開獎，改去開獎頁面
  else if (!isPrizeRevealed) redirect = 'open-prize'


  return (
    <main className={styles.main}>
      {PAGE_MAP[redirect]}
    </main>
  );
}

const PAGE_MAP: { [page in PageName]: ReactNode } = {
  "last-round": <LastRoundPage />,
  "choose-number": <ChooseNumberPage />,
  "choose-bet-type": <ChooseBetTypePage />,
  "place-bet": <PlaceBetPage />,
  "bet-placed": <BetPlacedPage />,
  "open-prize": "open-prize",
  "claim": "claim",
}
