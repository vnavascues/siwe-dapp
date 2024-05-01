import { WebSocketProvider } from "@ethersproject/providers";
import type { ContractTransaction, Wallet } from "ethers";
import { ethers } from "ethers";
import { FastifyBaseLogger } from "fastify";

import posterABI from "../libs/smart-contracts/abis/Poster.json";
import type { JSONObject } from "../libs/utils/types";
import { serializeContractTransaction } from "../serializers";
import type { Service } from "./types";

export async function servePostPoster(
  provider: WebSocketProvider,
  signer: Wallet,
  posterAddr: string,
  content: string,
  tag: string,
  logger: FastifyBaseLogger,
): Promise<Service> {
  // TODO: nonce manager...
  // TODO: overrides...
  logger.warn({ provider }, "*** provider");
  const poster = new ethers.Contract(posterAddr, posterABI, signer);
  let tx: ContractTransaction;
  try {
    tx = await poster.connect(signer).post(content, tag);
  } catch (error) {
    logger.error(error, `Poster.post(string,string) failed due to:`);
    return {
      error: {
        type: "failed to call `Poster.post(string,string)`",
      },
      success: false,
      statusCode: 400,
    };
  }

  return {
    data: {
      tx: serializeContractTransaction(tx),
      data: {
        content,
        tag,
      },
    } as unknown as JSONObject,
    success: true,
    statusCode: 201,
  };
}
