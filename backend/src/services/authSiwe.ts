import type { FastifyBaseLogger } from "fastify";
import type { SiweResponse } from "siwe";
import { SiweErrorType, SiweMessage, generateNonce } from "siwe";

import type { SiweMessage as SiweMessageType } from "../schemas";
import type { Service } from "./types";

export function serveGetNonce(): Service {
  return {
    data: { nonce: generateNonce() },
    success: true,
    statusCode: 200,
  };
}

export async function servePostSignIn(
  message: string | SiweMessageType,
  signature: string,
  nonce: undefined | string,
  logger: FastifyBaseLogger,
): Promise<Service> {
  const siweMessage = new SiweMessage(message);
  let statusCode = 200;
  let siweResponse: SiweResponse;
  try {
    siweResponse = await siweMessage.verify({ signature, nonce });
  } catch (error) {
    logger.error(error);
    siweResponse = error as SiweResponse;
    switch (error) {
      case SiweErrorType.EXPIRED_MESSAGE: {
        statusCode = 440;
        break;
      }
      case SiweErrorType.INVALID_SIGNATURE: {
        statusCode = 400;
        break;
      }
      default: {
        statusCode = 500;
        break;
      }
    }
  }

  return {
    data: siweResponse.data,
    error: siweResponse.error,
    success: statusCode === 200,
    statusCode,
  };
}
