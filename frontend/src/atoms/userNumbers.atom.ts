import { atom, useAtom } from 'jotai';

const userNumbers = atom<(number | undefined)[]>([]);

export const useUserNumbers = () => useAtom(userNumbers)