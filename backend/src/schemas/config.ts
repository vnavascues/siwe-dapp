import { FromSchema } from "json-schema-to-ts";

import { LoggerLevel } from "../libs/logger/logger";

export const configSchema = {
  type: "object",
  properties: {
    ADDRESS_POSTER: {
      type: "string",
      // TODO: validate ethereum address
      minLength: 42,
      maxLength: 42,
    },
    // CHAIN_ID: {
    //   type: "number",
    //   // TODO: validate chain ID
    //   minimum: 1,
    // },
    DATABASE_URL: {
      type: "string",
      format: "uri",
    },
    FRONT_END: {
      type: "string",
      format: "uri",
    },
    HOST: {
      type: "string",
      format: "hostname",
    },
    LOG_LEVEL: {
      type: "string",
      default: LoggerLevel.INFO,
    },
    NAME: {
      type: "string",
    },
    PORT: {
      type: "number",
      default: 8080,
    },
    PRIVATE_KEY: {
      type: "string",
      minLength: 1,
    },
    RPC_URL: {
      type: "string",
      format: "uri",
    },
    SESSION_SECRET: {
      type: "string",
      minLength: 32, // NB: from @fastify/session docs
    },
    SESSION_EXPIRATION_IN_SECONDS: {
      type: "number",
      minimum: 300, // NB: 5 minutes
      default: 86_400, // NB: 24 hours
    },
    SHADOW_DATABASE_URL: {
      type: "string",
      format: "uri",
    },
  },
  required: [
    "ADDRESS_POSTER",
    "CHAIN_ID",
    "DATABASE_URL",
    "HOST",
    "LOG_LEVEL",
    "NAME",
    "PORT",
    "PRIVATE_KEY",
    "RPC_URL",
    "SESSION_SECRET",
    "SESSION_EXPIRATION_IN_SECONDS",
    "SHADOW_DATABASE_URL",
  ],
} as const;

export type Config = FromSchema<typeof configSchema>;
