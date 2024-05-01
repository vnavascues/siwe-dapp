import { WebSocketProvider } from "@ethersproject/providers";
import fastifyCookie from "@fastify/cookie";
import cors from "@fastify/cors";
import fastifyEnv from "@fastify/env";
import fastifySession, { FastifySessionOptions } from "@fastify/session";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import fastifyPrisma from "@joggr/fastify-prisma";
import { PrismaClient } from "@prisma/client";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import type { Wallet } from "ethers";
import fastify from "fastify";
import type { DoneFuncWithErrOrRes, FastifyError, FastifyReply, FastifyRequest } from "fastify";

import packageJSON from "../package.json";
import { UserFormat } from "./libs/ajv/const";
import { evmAddressFormat, noEmptyStringFormat } from "./libs/ajv/formats";
import { getBlockchainConnection } from "./libs/ethers";
import { logger } from "./libs/logger/logger";
import { authSiweRouterV1, healthRouterV1, pingRouter, posterRouterV1, profileRouterV1 } from "./routes";
import { configSchema } from "./schemas";
import type { Config } from "./schemas";

declare module "fastify" {
  export interface FastifyInstance {
    config: Config;
    blockchain: {
      provider: WebSocketProvider;
      signer: Wallet;
    };
  }
}

const server = fastify({
  logger,
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, async () => {
    const err = await server.close();
    console.log(`close application on ${signal}`);
    process.exit(err ? 1 : 0);
  });
}
process.on("unhandledRejection", (e) => {
  logger.fatal(e);
  process.exit(1);
});

export const start = async () => {
  // Read & validate env vars
  const ajvConfig = {
    allErrors: false, // NB: when set to `true`, a DoS attack is possible.
    removeAdditional: true,
    useDefaults: true,
    coerceTypes: true,
    allowUnionTypes: true,
  };
  const ajv = new Ajv(ajvConfig);
  addFormats(ajv);
  ajv.addFormat(UserFormat.NO_EMPTY_STRING, noEmptyStringFormat);
  ajv.addFormat(UserFormat.EVM_ADDRESS, evmAddressFormat);
  server.log.info(
    { config: ajvConfig, formats: [UserFormat.NO_EMPTY_STRING, UserFormat.EVM_ADDRESS] },
    "Ajv: instantiated formats",
  );

  const fastifyEnvConfig = {
    schema: configSchema,
    dotenv: true,
    ajv,
  };
  await server.register(fastifyEnv, fastifyEnvConfig);
  server.log.info({ config: { ...fastifyEnvConfig, ajv: true } }, "fastify: registered environment");

  // Set cors
  const corsConfig = {
    origin: ["http://localhost:8080", server.config.FRONT_END as string],
    methods: ["GET", "PUT", "PATCH", "POST", "DELETE"],
    credentials: true,
  };
  await server.register(cors, corsConfig);
  server.log.info({ config: corsConfig }, "fastify: registered CORS");

  // Set db client
  await server.register(fastifyPrisma, { client: new PrismaClient() });
  server.log.info("fastify: registered Prisma");

  // Set blockchain provider
  const blockchainConnection = getBlockchainConnection(server.config.RPC_URL, server.config.PRIVATE_KEY);
  server.blockchain = blockchainConnection;
  server.log.info(
    {
      provider: {
        network: blockchainConnection.provider._network,
        connection: blockchainConnection.provider.connection,
      },
      signer: {
        address: await blockchainConnection.signer.getAddress(),
      },
    },
    "fastify: instantiated blockchain",
  );

  // Set sessions
  await server.register(fastifyCookie);
  server.log.info({ config: corsConfig }, "fastify: registered cookie");

  const sessionConfig: FastifySessionOptions = {
    secret: server.config.SESSION_SECRET,
    cookieName: "siwe_app_session",
    saveUninitialized: true,
    cookie: { secure: "auto", sameSite: true },
  };
  await server.register(fastifySession, sessionConfig);
  // TODO: fix "redacted"
  server.log.info({ config: { ...sessionConfig, secret: "[REDACTED]" } }, "fastify: registered session");

  // Set error handler
  server.setErrorHandler((error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
    if (error.validation) {
      return reply
        .status(400)
        .send({ success: false, error: { type: error.message, code: error.code, message: error.message } });
    }
    server.log.error(error, "uncaught error");
    const code = error.code || "internalError";
    let statusCode = error.statusCode || 500;
    statusCode = statusCode >= 500 ? statusCode : 500;
    return reply.status(500).send({ error: { statusCode, code, message: error.message } });
  });
  server.log.info(
    {
      error: {
        validation: {
          statusCode: 400,
        },
        default: {
          statusCode: 500,
        },
      },
    },
    "fastify: set 'error' handler",
  );

  // Set not found handler
  server.setNotFoundHandler(
    {
      preValidation: (request: FastifyRequest, reply: FastifyReply, done: DoneFuncWithErrOrRes) => {
        done();
      },
      preHandler: (request: FastifyRequest, reply: FastifyReply, done: DoneFuncWithErrOrRes) => {
        done();
      },
    },
    async function (request: FastifyRequest, reply: FastifyReply) {
      return reply.status(404).send({
        error: {
          statusCode: 404,
          code: "notFound",
          message: "Requested resource not found",
        },
      });
    },
  );
  server.log.info(
    {
      error: {
        validation: {
          statusCode: 400,
        },
        unknown: {
          statusCode: 500,
        },
      },
    },
    "fastify: set 'notFound' error handler",
  );

  // Set Swagger
  const swaggerConfig = {
    openapi: {
      info: {
        title: "SIWE app API",
        description: "SIWE app Swagger API",
        version: packageJSON.version,
      },
      servers: [{ url: `http://${server.config.HOST}:${server.config.PORT}` }],
    },
  };
  await server.register(fastifySwagger, swaggerConfig);
  server.log.info(
    {
      config: swaggerConfig,
    },
    "fastify: registered Swagger",
  );

  // Set Swagger UI
  const swaggerUiConfig = {
    routePrefix: "/api/docs",
  };
  await server.register(fastifySwaggerUI, swaggerUiConfig);
  server.log.info(
    {
      config: swaggerConfig,
    },
    "fastify: registered SwaggerUI",
  );

  // Register routes
  // TODO: helper function that generates `METHOD url` for each controller route
  await server.register(authSiweRouterV1, { prefix: "/api/v1" });
  server.log.info("fastify: registered 'authSiweRouterV1'");

  await server.register(healthRouterV1, { prefix: "/api/v1" });
  server.log.info("fastify: registered 'healthRouterV1'");

  await server.register(pingRouter, { prefix: "/api" });
  server.log.info("fastify: registered 'pingRouter'");

  await server.register(posterRouterV1, { prefix: "/api/v1" });
  server.log.info("fastify: registered 'posterRouterV1'");

  await server.register(profileRouterV1, { prefix: "/api/v1" });
  server.log.info("fastify: registered 'profileRouterV1'");

  // Start Fastify server
  try {
    await server.listen({ port: server.config.PORT, host: server.config.HOST });
  } catch (err) {
    server.log.fatal(err);
    await server.close();
    process.exit(1);
  }
  server.log.info({ address: server.server.address() }, "fastify: listening at");
};
