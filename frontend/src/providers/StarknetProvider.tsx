import { sepolia } from "@starknet-react/chains";
import { StarknetConfig, argent, publicProvider } from "@starknet-react/core";
import { FC, ReactNode } from 'react';

const provider = publicProvider()
const connectors = [
  argent(),
]

interface Prop {
  children: ReactNode
}

const StarknetProvider: FC<Prop> = ({ children }) => {
  return (
    <StarknetConfig
      chains={[sepolia]}
      provider={provider}
      connectors={connectors as any}
      autoConnect={true}
    >
      {children}
    </StarknetConfig>
  )
}

export default StarknetProvider