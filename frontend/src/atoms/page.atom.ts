import { atom, useAtom } from 'jotai';

export type PageName = 'last-round' | 'choose-number' | 'choose-bet-type' | 'place-bet' | 'bat-placed' | 'open-prize' | 'claim'

const pageName = atom<PageName>('choose-number');

export const usePage = () => useAtom(pageName)
