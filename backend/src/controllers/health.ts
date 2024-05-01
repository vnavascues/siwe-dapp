import type { FastifyReply, FastifyRequest } from "fastify";

import packageJSON from "../../package.json";

export async function getHealthController(_: FastifyRequest, reply: FastifyReply) {
  return reply.status(200).send({ version: packageJSON.version });
}
