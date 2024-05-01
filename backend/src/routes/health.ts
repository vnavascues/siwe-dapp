import { FastifyInstance } from "fastify";

import { getHealthController } from "../controllers";
import { getHealthSchema } from "../schemas";

export async function healthRouterV1(fastify: FastifyInstance) {
  fastify.route({
    method: "GET",
    url: "/health",
    handler: getHealthController,
    schema: getHealthSchema,
  });
}
