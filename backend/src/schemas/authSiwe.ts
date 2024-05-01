import { FromSchema } from "json-schema-to-ts";

// *** GET nonce ***
export const getNonceResponseSchema = {
  response: {
    "200": {
      type: "object",
      properties: {
        success: {
          type: "boolean",
        },
        data: {
          nonce: {
            type: "string",
          },
        },
      },
    },
  },
} as const;

export const getNonceSchema = {
  ...getNonceResponseSchema,
  summary: "Generate a Sign-In with Ethereum (SIWE) nonce",
};

// *** POST sign-in ***

export const siweMessageSchema = {
  type: "object",
  properties: {
    domain: {
      type: "string",
    },
    address: {
      type: "string",
    },
    statement: {
      type: "string",
    },
    uri: {
      type: "string",
    },
    version: {
      type: "string",
    },
    chainId: {
      type: "number",
    },
    nonce: {
      type: "string",
    },
    issuedAt: {
      type: "string",
    },
    expirationTime: {
      type: "string",
    },
    notBefore: {
      type: "string",
    },
    requestId: {
      type: "string",
    },
    resources: {
      type: "array",
      items: {
        type: "string",
      },
    },
  },
  additionalProperties: false,
  required: ["domain", "address", "uri", "version", "chainId", "nonce"],
} as const;

export type SiweMessage = FromSchema<typeof siweMessageSchema>;

export const postSignInRequestSchema = {
  body: {
    type: "object",
    properties: {
      message: { oneOf: [{ type: "string" }, siweMessageSchema] },
      signature: {
        type: "string",
      },
    },
    additionalProperties: false,
    required: ["message", "signature"],
  },
} as const;

export type PostSignInRequest = FromSchema<typeof postSignInRequestSchema.body>;

export const siweResponseErrorSchema = {
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

export const siweResponseDataSchema = siweMessageSchema;

export const siweResponseSchema = {
  type: "object",
  properties: {
    data: siweResponseDataSchema,
    error: siweResponseErrorSchema,
  },
  required: ["data", "success"],
};

export const postSignInResponeSchema = {
  response: {
    "200": siweResponseSchema,
    "4xx": siweResponseSchema,
  },
};

export const postSignInSchema = {
  ...postSignInRequestSchema,
  ...postSignInResponeSchema,
  summary: "Sign-In with Ethereum (SIWE) an address",
};

// *** DELETE sign-off ***

export const deleteSignOffResponseSchema = {
  response: {
    "200": {
      properties: {
        success: {
          type: "boolean",
        },
      },
    },
  },
};

export const deleteSignOffSchema = {
  ...deleteSignOffResponseSchema,
  summary: "Sign-Off an already signed-in Ethereum address",
};
