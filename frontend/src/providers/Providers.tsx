'use client'
import { COLOR } from '@/css/Colors'
import { ChakraProvider } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'
import StarknetProvider from './StarknetProvider'
import { themes } from './themes'

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <StarknetProvider>
      <ChakraProvider resetCSS={false} theme={themes}>
        {children}
        <Toaster
          toastOptions={{
            style: { backgroundColor: '#333', color: COLOR.White }
          }}
        />
      </ChakraProvider>
    </StarknetProvider>
  )
}

export default Providers