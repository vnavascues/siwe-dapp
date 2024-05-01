import { WebSocketProvider } from "@ethersproject/providers";
import type { Wallet } from "ethers";

export interface BlockchainConfig {
  provider: WebSocketProvider;
  signer: Wallet;
}
