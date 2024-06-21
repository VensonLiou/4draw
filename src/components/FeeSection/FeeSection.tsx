import { BetType, useBetTypes } from '@/atoms/betTypes.atom'
import { roundString } from '@/utils/utils'
import { HStack, Stack } from '@chakra-ui/react'
import Image from 'next/image'
import styles from './FeeSection.module.css'
import { FC } from 'react'
import useGameInfo from '@/hooks/useGameInfo'
import { formatUnits } from '@/utils/parseUnits'
import usePaymentToken from '@/hooks/usePaymentToken'

interface Prop {
  showDetail?: boolean
}

const FeeSection: FC<Prop> = ({ showDetail }) => {
  const [betTypes] = useBetTypes()
  const { gameInfo } = useGameInfo()
  const { decimals, symbol } = usePaymentToken()
  const price = gameInfo.ticket_price
  const setPrice = gameInfo.ticket_price * 2n
  const formattedPrice = formatUnits(price, decimals)
  const formattedSetPrice = formatUnits(setPrice, decimals)


  const entries = Object.entries(betTypes)
  const fee = entries.reduce((prev, currentEntry) => {
    const [key, value] = currentEntry
    if (key === 'set') return prev + BigInt(value ?? 0n) * setPrice
    return prev + (BigInt(value ?? 0n) * price)
  }, 0n)

  const formattedFee = formatUnits(fee, decimals)

  return (
    <section className={styles.container}>
      <Stack gap={'20px'}>
        <HStack alignItems={'center'} gap={3}>
          <p>Fees: </p>
          <HStack alignItems={'center'} gap={1}>
            <Image
              alt='fee token'
              src={'/icon-tokens/ic-usdc.svg'}
              width={20}
              height={20}
            />
            <span>{roundString(formattedFee, 4)}</span>
          </HStack>
        </HStack>

        {showDetail && <p>
          {formattedPrice} {symbol ?? ''} for Straight, Box, and Mini types.<br />
          {formattedSetPrice} {symbol ?? ''} for Set type.
        </p>}
      </Stack>
    </section>
  )
}

export default FeeSection