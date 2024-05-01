import type { FastifyReply, FastifyRequest } from "fastify";

export async function authSiwePreHandler(request: FastifyRequest, reply: FastifyReply): Promise<void | FastifyReply> {
  // @ts-expect-error: fix type
  if (request.session.siwe === undefined) {
    return reply
      .status(401)
      .send({ success: false, error: { type: "Unauthorized. Sign-in with your Ethereum address" } });
  }
}
