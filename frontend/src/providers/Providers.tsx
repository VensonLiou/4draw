'use client'
import { ChakraProvider } from '@chakra-ui/react'
import { ReactNode } from 'react'

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <ChakraProvider resetCSS={false}>
      {children}
    </ChakraProvider>
  )
}

export default Providers