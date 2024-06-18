'use client'
import { PageName, usePage } from "@/atoms/page.atom";
import ChooseNumberPage from "@/pages/ChooseNumberPage";
import { ReactNode } from "react";
import styles from "./page.module.css";
import ChooseBetTypePage from "@/pages/ChooseBetTypePage";

export default function Home() {
  const [pageName] = usePage()

  return (
    <main className={styles.main}>
      {PAGE_MAP[pageName]}
    </main>
  );
}

const PAGE_MAP: { [page in PageName]: ReactNode } = {
  "last-round": null,
  "choose-number": <ChooseNumberPage />,
  "choose-bet-type": <ChooseBetTypePage />,
  "place-bet": null,
  "bat-placed": null,
  "open-prize": null,
  "claim": null,
}
