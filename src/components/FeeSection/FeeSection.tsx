import React from 'react'
import styles from './FeeSection.module.css'
import Image from 'next/image'
import { HStack, Stack } from '@chakra-ui/react'
import { roundString } from '@/utils/utils'

const FeeSection = () => {

  const fee = 4

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