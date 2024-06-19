import { mainnet } from "@starknet-react/chains";
import { StarknetConfig, argent, braavos, publicProvider } from "@starknet-react/core";
import { FC, ReactNode } from 'react';

const provider = publicProvider()
const connectors = [
  argent(),
  braavos(),
]

interface Prop {
  children: ReactNode
}

const StarknetProvider: FC<Prop> = ({ children }) => {
  return (
    <StarknetConfig
      chains={[mainnet]}
      provider={provider}
      connectors={connectors as any}
      autoConnect={true}
    >
      {children}
    </StarknetConfig>
  )
}

export default StarknetProvider