import type { FastifyReply, FastifyRequest } from "fastify";

export async function getPingController(_: FastifyRequest, reply: FastifyReply) {
  return reply.status(200).send("pong!");
}
