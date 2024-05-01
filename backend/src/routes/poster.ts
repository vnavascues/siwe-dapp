import { FastifyInstance } from "fastify";

import { postPosterController } from "../controllers";
import { postPosterSchema } from "../schemas";

export async function posterRouterV1(fastify: FastifyInstance) {
  //   fastify.route({
  //     method: "GET",
  //     url: "/profile/:address",
  //     preHandler: [authSiwePreHandler, validateParamsAddressPreHandler],
  //     handler: getProfileController,
  //     schema: getProfileSchema,
  //   });
  fastify.route({
    method: "POST",
    url: "/poster",
    handler: postPosterController,
    schema: postPosterSchema,
  });
  //   fastify.route({
  //     method: "PATCH",
  //     url: "/profile/:address",
  //     preHandler: [authSiwePreHandler, validateParamsAddressPreHandler],
  //     handler: patchProfileController,
  //     schema: patchProfileSchema,
  //   });
  //   fastify.route({
  //     method: "DELETE",
  //     url: "/profile/:address",
  //     preHandler: [authSiwePreHandler, validateParamsAddressPreHandler],
  //     handler: deleteProfileController,
  //     schema: deleteProfileSchema,
  //   });
}
