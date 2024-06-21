import { BigNumberish } from "starknet";
import { divideString } from "./utils";


export const parseUnits = (value: BigNumberish, decimals = 18) => {
  const valueBN = BigInt(value);
  const factor = BigInt(10) ** BigInt(decimals);
  return valueBN * factor;
}


export const formatUnits = (value: BigNumberish, decimals = 18) => {
  const factor = BigInt(10) ** (BigInt(decimals));
  const formattedValue = divideString(String(value), factor);
  return formattedValue;
}