import { atom, useAtom } from 'jotai';

export type PageName = 'last-round' | 'choose-number' | 'choose-bet-type' | 'place-bet' | 'bet-placed' | 'open-prize'| 'revealing'

const pageName = atom<PageName>('last-round');

export const usePage = () => useAtom(pageName)
