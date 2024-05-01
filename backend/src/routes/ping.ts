import { FastifyInstance } from "fastify";

import { getPingController } from "../controllers";
import { getPingSchema } from "../schemas";

export async function pingRouter(fastify: FastifyInstance) {
  fastify.route({
    method: "GET",
    url: "/ping",
    handler: getPingController,
    schema: getPingSchema,
  });
}
