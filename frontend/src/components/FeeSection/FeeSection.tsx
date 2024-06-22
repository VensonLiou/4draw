import useGameInfo from '@/hooks/useGameInfo'
import usePaymentToken from '@/hooks/usePaymentToken'
import { formatUnits } from '@/utils/parseUnits'
import { roundString } from '@/utils/utils'
import { Button, HStack, Stack } from '@chakra-ui/react'
import Image from 'next/image'
import { FC } from 'react'
import styles from './FeeSection.module.css'
import { COLOR } from '@/css/Colors'

interface Prop {
  showDetail?: boolean
  fee: bigint
  isBalanceEnough?: boolean
}

const FeeSection: FC<Prop> = ({ showDetail, fee, isBalanceEnough }) => {
  const { gameInfo } = useGameInfo()
  const { balance, decimals, symbol, mintTPT } = usePaymentToken()

  const price = gameInfo.ticket_price
  const doublePrice = gameInfo.ticket_price * 2n

  const formattedPrice = formatUnits(price, decimals)
  const formattedDoublePrice = formatUnits(doublePrice, decimals)

  const formattedBalance = balance === undefined ? '- -' : formatUnits(balance, decimals)
  const formattedFee = formatUnits(fee, decimals)

  const mintAmount = 100n * 10n ** BigInt(decimals ?? 0)

  return (
    <Stack alignItems={'stretch'} w={200}>
      {/* fee */}
      <section className={styles.container}>
        <Stack gap={'20px'} >
          <HStack justifyContent={'space-between'} alignItems={'center'} gap={3}>
            <p>Fees: </p>
            <HStack alignItems={'center'} gap={1}>
              <Image
                alt='fee token'
                src={'/icon-tokens/ic-usdc.svg'}
                width={20}
                height={20}
              />
              <span>{roundString(formattedFee, 2)}</span>

            </HStack>
          </HStack>
          {showDetail && <p>
            {formattedPrice} {symbol ?? ''} for Straight, Box, and Mini types.<br />
            {formattedDoublePrice} {symbol ?? ''} for Set type.
          </p>}
        </Stack>
      </section>

      {/* user balance */}
      {isBalanceEnough !== undefined &&
        <HStack alignItems={'center'} justifyContent={'space-between'} gap={3}>
          <p>Balance: </p>
          <HStack alignItems={'center'} gap={1}>
            <Image
              alt='fee token'
              src={'/icon-tokens/ic-usdc.svg'}
              width={20}
              height={20}
            />
            <span style={isBalanceEnough ? {} : { color: COLOR.Warning }}>
              {roundString(formattedBalance, 2)}
            </span>
          </HStack>
        </HStack>}

      {!isBalanceEnough &&
        <Button size="sm" onClick={() => mintTPT(mintAmount)}>
          Mint 100 {symbol} (for test)
        </Button>}
    </Stack>

  )
}

export default FeeSection