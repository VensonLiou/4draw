import { atom, useAtom } from 'jotai';

const betTypes = atom<BetTypes>({});

export const useBetTypes = () => useAtom(betTypes)

export type BetType = 'straight' | 'box' | 'set' | 'mini'

export type BetTypes = {
  straight?: number
  box?: number
  set?: number
  mini?: number
}