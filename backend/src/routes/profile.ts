import { FastifyInstance } from "fastify";

import {
  deleteProfileController,
  getProfileController,
  patchProfileController,
  postProfileController,
} from "../controllers";
import { authSiwePreHandler, validateParamsAddressPreHandler } from "../middlewares";
import { deleteProfileSchema, getProfileSchema, patchProfileSchema, postProfileSchema } from "../schemas";

export async function profileRouterV1(fastify: FastifyInstance) {
  fastify.route({
    method: "GET",
    url: "/profile/:address",
    preHandler: [authSiwePreHandler, validateParamsAddressPreHandler],
    handler: getProfileController,
    schema: getProfileSchema,
  });
  fastify.route({
    method: "POST",
    url: "/profile/:address",
    preHandler: [authSiwePreHandler, validateParamsAddressPreHandler],
    handler: postProfileController,
    schema: postProfileSchema,
  });
  fastify.route({
    method: "PATCH",
    url: "/profile/:address",
    preHandler: [authSiwePreHandler, validateParamsAddressPreHandler],
    handler: patchProfileController,
    schema: patchProfileSchema,
  });
  fastify.route({
    method: "DELETE",
    url: "/profile/:address",
    preHandler: [authSiwePreHandler, validateParamsAddressPreHandler],
    handler: deleteProfileController,
    schema: deleteProfileSchema,
  });
}
