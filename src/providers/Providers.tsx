'use client'
import { ChakraProvider } from '@chakra-ui/react'
import { ReactNode } from 'react'
import StarknetProvider from './StarknetProvider'
import { themes } from './themes'
import { Toaster, resolveValue, } from 'react-hot-toast'

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <StarknetProvider>
      <ChakraProvider resetCSS={false} theme={themes}>
        {children}
        <Toaster />
      </ChakraProvider>
    </StarknetProvider>
  )
}

export default Providers