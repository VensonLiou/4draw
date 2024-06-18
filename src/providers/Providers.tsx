'use client'
import { ChakraProvider } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { themes } from './themes'

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <ChakraProvider resetCSS={false} theme={themes}>
      {children}
    </ChakraProvider>
  )
}

export default Providers