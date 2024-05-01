import { ethers } from "ethers";
import type { FastifyReply, FastifyRequest } from "fastify";

import type { GetProfileRequest } from "../schemas";

export async function validateParamsAddressPreHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void | FastifyReply> {
  // NB: `address` format is validated here first instead of via schema `format` to do not return
  // a generic `FST_ERR_VALIDATION` error response.
  const rawParamsAddress = (request.params as GetProfileRequest).address;
  if (!ethers.utils.isAddress(rawParamsAddress)) {
    return reply.status(400).send({
      success: false,
      error: {
        type: "Invalid EVM address",
        received: rawParamsAddress,
      },
    });
  }

  const paramsAddress = ethers.utils.getAddress((request.params as GetProfileRequest).address as string); // NB: checksum

  // @ts-expect-error: fix type
  const sessionAddress = request.session.siwe.address; // NB: checksum

  if (sessionAddress !== paramsAddress) {
    return reply.status(422).send({
      success: false,
      error: {
        type: "Query parameter address does not match session address",
        expected: sessionAddress,
        received: paramsAddress,
      },
    });
  }

  return;
}
