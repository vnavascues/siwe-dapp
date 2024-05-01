import type { WebSocketProvider } from "@ethersproject/providers";
import { ethers } from "ethers";
import type { Wallet } from "ethers";
import path from "path";

import { logger as parentLogger } from "../logger/logger";
import type { BlockchainConfig } from "./types";

const logger = parentLogger.child({ name: path.relative(process.cwd(), __filename) });

export function getWalletSigner(privateKey: string): ethers.Wallet {
  let signer: ethers.Wallet;
  try {
    signer = new ethers.Wallet(privateKey);
  } catch (error) {
    logger.child({ privateKey }).error(error, `unexpected error instantiating Wallet`);
    throw error;
  }
  return signer;
}

export function getWebSocketProvider(rpcUrl: string): WebSocketProvider {
  let provider: WebSocketProvider;
  try {
    provider = new ethers.providers.WebSocketProvider(rpcUrl);
  } catch (error) {
    logger.child({ rpcUrl }).error(error, `unexpected error instantiating WebSocketProvider`);
    throw error;
  }
  return provider;
}

export function getBlockchainConnection(rpcUrl: string, privateKey: string): BlockchainConfig {
  return {
    provider: getWebSocketProvider(rpcUrl),
    signer: getWalletSigner(privateKey),
  };
}
