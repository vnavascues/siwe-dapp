import { FastifyInstance } from "fastify";

import { deleteSignOffController, getNonceController, postSignInController } from "../controllers";
import { authSiwePreHandler } from "../middlewares";
import { deleteSignOffSchema, getNonceSchema, postSignInSchema } from "../schemas";

export async function authSiweRouterV1(fastify: FastifyInstance) {
  fastify.route({
    method: "GET",
    url: "/auth/siwe/nonce",
    handler: getNonceController,
    schema: getNonceSchema,
  });
  fastify.route({
    method: "POST",
    url: "/auth/siwe/signin",
    handler: postSignInController,
    schema: postSignInSchema,
  });
  fastify.route({
    method: "DELETE",
    url: "/auth/siwe/signoff",
    preHandler: [authSiwePreHandler],
    handler: deleteSignOffController,
    schema: deleteSignOffSchema,
  });
}
