import { useBetTypes } from "@/atoms/betTypes.atom";
import { useUserNumbers } from "@/atoms/userNumbers.atom";

export const userNumbersInvalid = (userNumbers: ReturnType<typeof useUserNumbers>[0]) => {
  return userNumbers.length !== 4 || [...userNumbers].some(i => i === undefined)
}

export const betTypesInvalid = (betTypes: ReturnType<typeof useBetTypes>[0]) => {
  return Object.values(betTypes).every(i => !i)
}