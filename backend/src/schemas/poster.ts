import { FromSchema } from "json-schema-to-ts";

// TODO: create a proper schema for ethers.ContractTransaction type
export interface ContractTx {
  hash: string;
}

export const contractTxSchema = {
  type: "object",
  properties: {
    hash: {
      type: "string",
    },
  },
  additionalProperties: false,
  required: ["hash"],
};

export const posterErrorSchema = {
  type: "object",
  properties: {
    type: {
      type: "string",
    },
    expected: {
      type: "string",
    },
    received: {
      type: "string",
    },
    code: {
      type: "string",
    },
    message: {
      type: "string",
    },
  },
  required: ["type"],
};

// *** POST poster ***

export const posterSchema = {
  type: "object",
  properties: {
    content: {
      type: "string",
      minLength: 1,
      // TODO: enable AJV custom format 'noEmptyString'. Currently checked in the service logic
      // import { UserFormat } from "../libs/ajv/const";
      // format: UserFormat.NO_EMPTY_STRING,
    },
    tag: {
      type: "string",
      minLength: 1,
      // TODO: enable AJV custom format 'noEmptyString'. Currently checked in the service logic
      // import { UserFormat } from "../libs/ajv/const";
      // format: UserFormat.NO_EMPTY_STRING,
    },
  },
  additionalProperties: false,
  required: ["content", "tag"],
} as const;

export const postPosterRequestSchema = {
  body: posterSchema,
} as const;

export type PostPosterRequest = FromSchema<typeof postPosterRequestSchema.body>;

export const postPosterResponseSchema = {
  response: {
    "201": {
      type: "object",
      properties: {
        data: {
          tx: contractTxSchema,
          data: posterSchema,
        },
        success: {
          type: "boolean",
        },
      },
      required: ["data", "success"],
    },
    "4XX": {
      type: "object",
      properties: {
        error: posterErrorSchema,
        success: {
          type: "boolean",
        },
      },
      required: ["error", "success"],
    },
  },
} as const;

export const postPosterSchema = {
  ...postPosterRequestSchema,
  ...postPosterResponseSchema,
  summary: "Post a comment in the Poster",
};
