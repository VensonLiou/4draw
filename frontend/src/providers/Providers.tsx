'use client'
import { ChakraProvider } from '@chakra-ui/react'
import { ReactNode } from 'react'
import StarknetProvider from './StarknetProvider'
import { themes } from './themes'

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <StarknetProvider>
      <ChakraProvider resetCSS={false} theme={themes}>
        {children}
      </ChakraProvider>
    </StarknetProvider>
  )
}

export default Providers