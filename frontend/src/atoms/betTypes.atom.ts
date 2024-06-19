import { atom, useAtom } from 'jotai';

const betTypes = atom<BetTypes>({});

export const useBetTypes = () => useAtom(betTypes)

export type BetType = 'straight' | 'set' | 'box' | 'mini'

export type BetTypes = {
  straight?: number
  set?: number
  box?: number
  mini?: number
}