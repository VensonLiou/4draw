import { BetType, useBetTypes } from '@/atoms/betTypes.atom'
import { roundString } from '@/utils/utils'
import { HStack, Stack } from '@chakra-ui/react'
import Image from 'next/image'
import styles from './FeeSection.module.css'

const FeeSection = () => {
  const [betTypes] = useBetTypes()

  const entries = Object.entries(betTypes)
  const fee = entries.reduce((prev, currentEntry) => {
    const [key, value] = currentEntry as [BetType, number]
    if (key === 'set') return prev + (2 * (value ?? 0))
    return prev + ((value ?? 0) * 1)
  }, 0)

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
            <span>{roundString(String(fee), 2)}</span>
          </HStack>
        </HStack>

        <p>
          1 USDC for Straight, Box, and Mini types.<br />
          2 USDC for Set type.
        </p>
      </Stack>
    </section>
  )
}

export default FeeSection