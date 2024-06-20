import Decimal from 'decimal.js';

Decimal.set({ toExpNeg: -100, toExpPos: 100, precision: 40 })

type BigIntish = string | bigint


export const Dec = (str: BigIntish) => new Decimal(str.toString())


export const addString = (str1: BigIntish, str2: BigIntish) => Dec(str1).add(Dec(str2)).toString()
export const subtractString = (str1: BigIntish, str2: BigIntish) => Dec(str1).sub(Dec(str2)).toString()
export const multiplyString = (str1: BigIntish, str2: BigIntish) => Dec(str1).mul(Dec(str2)).toString()
export const divideString = (str1: BigIntish, str2: BigIntish) => Dec(str1).div(Dec(str2)).toString()

export const floorString = (str: BigIntish) => Dec(str).floor().toString()
export const ceilString = (str: BigIntish) => Dec(str).ceil().toString()

export const maxString = (str1: BigIntish, str2: BigIntish) => Dec(str1).gte(Dec(str2)) ? str1 : str2
export const minString = (str1: BigIntish, str2: BigIntish) => Dec(str1).lte(Dec(str2)) ? str1 : str2


export const roundString = (str: string, to: number) => {
  if (str === '- -') return str
  if (str === 'NaN') return '- -'
  try {
    const BN = Dec(str)
    const resolution = Dec('5').dividedBy(Dec('10').pow(to + 1))
    const minDisplayedValue = Dec('1').dividedBy(Dec('10').pow(to))
    if (!BN.eq(0) && BN.abs().lt(resolution)) return `${(BN.lt('0') ? '- <' : '< ')}${minDisplayedValue.toString()}`
    if (to >= 0) return BN.toFixed(to)
    return Dec(BN.dividedBy(10 ** -to).toFixed(0)).mul(10 ** -to).toFixed(2).toString()
  } catch (e) {
    console.log(e)
    return '- -'
  }
}


export const commafy = (num: string | number) => {
  num = String(num)
  let str = num.split(".");
  str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return str.join(".");
}


export const CapitalizeFirstLetter = (str: string) => {
  return str.split(' ').map(w => (
    Array.from(w.split('')).map((s, idx) => idx === 0 ? s.toUpperCase() : s).join('')
  )).join(' ')
}


export const getCroppedStringIfAddress = (str?: string, charRemained: number = 4): string => {
  if (!str) return ''
  const isAddress = str.length >= 42 && str.slice(0, 2) === '0x'
  if (!isAddress) return str
  const head = str.substring(0, charRemained)
  const tail = str.slice(-1 * charRemained)
  return head + '...' + tail
}

export const bigintishToArray = (n?: number | bigint | string) => {
  if (n === undefined) return

  const arr = Array.from(String(n), Number)
  while (arr.length < 4) {
    arr.unshift(0)
  }
  return arr
}

export const sleep = async (ms: number) => {
  await new Promise(res => setTimeout(() => {
    res('')
  }, ms))
}