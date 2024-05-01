import { FromSchema } from "json-schema-to-ts";

// *** GET profile ***

export const profileErrorSchema = {
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

export const profileDataSchema = {
  type: "object",
  properties: {
    id: {
      type: "string",
    },
    address: {
      type: "string",
    },
    name: {
      type: "string",
    },
    bio: {
      type: "string",
      nullable: true,
    },
    createdAt: {
      type: "string",
      format: "iso-date-time",
    },
    updatedAt: {
      type: "string",
      format: "iso-date-time",
    },
  },
  required: ["id", "address", "name", "bio", "createdAt", "updatedAt"],
} as const;

export type ProfileData = FromSchema<typeof profileDataSchema>;

export const getProfileRequestSchema = {
  params: {
    type: "object",
    properties: {
      address: {
        type: "string",
      },
    },
    additionalProperties: false,
    required: ["address"],
  },
} as const;
export type GetProfileRequest = FromSchema<typeof getProfileRequestSchema.params>;

export const getProfileResponseSchema = {
  response: {
    "200": {
      type: "object",
      properties: {
        data: profileDataSchema,
        success: {
          type: "boolean",
        },
      },
      required: ["data", "success"],
    },
    "4XX": {
      type: "object",
      properties: {
        error: profileErrorSchema,
        success: {
          type: "boolean",
        },
      },
      required: ["error", "success"],
    },
  },
} as const;

export const getProfileSchema = {
  ...getProfileRequestSchema,
  ...getProfileResponseSchema,
  summary: "Get the profile of the signed-in Ethereum address",
};

// *** POST profile ***

export const postProfileRequestSchema = {
  body: {
    type: "object",
    properties: {
      name: {
        type: "string",
        maxLength: 50,
        // TODO: enable AJV custom format 'noEmptyString'. Currently checked in the service logic
        // import { UserFormat } from "../libs/ajv/const";
        // format: UserFormat.NO_EMPTY_STRING,
      },
      bio: {
        type: "string",
        nullable: true,
        // TODO: enable AJV custom format 'noEmptyString'. Currently checked in the service logic
        // import { UserFormat } from "../libs/ajv/const";
        // format: UserFormat.NO_EMPTY_STRING,
      },
    },
    additionalProperties: false,
    required: ["name", "bio"],
  },
} as const;

export type PostProfileRequest = FromSchema<typeof postProfileRequestSchema.body>;

export const postProfileResponseSchema = {
  response: {
    "200": {
      type: "object",
      properties: {
        data: profileDataSchema,
        success: {
          type: "boolean",
        },
      },
      required: ["data", "success"],
    },
    "4XX": {
      type: "object",
      properties: {
        error: profileErrorSchema,
        success: {
          type: "boolean",
        },
      },
      required: ["error", "success"],
    },
  },
} as const;

export const postProfileSchema = {
  ...postProfileRequestSchema,
  ...postProfileResponseSchema,
  summary: "Create a profile for the signed-in Ethereum address",
};

// *** PATCH profile ***

export const patchProfileRequestSchema = {
  body: {
    type: "object",
    properties: {
      name: {
        type: "string",
        maxLength: 50,
        // TODO: enable AJV custom format 'noEmptyString'. Currently checked in the service logic
        // import { UserFormat } from "../libs/ajv/const";
        // format: UserFormat.NO_EMPTY_STRING,
      },
      bio: {
        type: "string",
        nullable: true,
        // TODO: enable AJV custom format 'noEmptyString'. Currently checked in the service logic
        // import { UserFormat } from "../libs/ajv/const";
        // format: UserFormat.NO_EMPTY_STRING,
      },
    },
    anyOf: [
      {
        required: ["name"],
      },
      {
        required: ["bio"],
      },
    ],
    additionalProperties: false,
  },
} as const;

export type PatchProfileRequest = FromSchema<typeof patchProfileRequestSchema.body>;

export const patchProfileResponseSchema = {
  response: {
    "200": {
      type: "object",
      properties: {
        data: profileDataSchema,
        success: {
          type: "boolean",
        },
      },
      required: ["data", "success"],
    },
    "4XX": {
      type: "object",
      properties: {
        error: profileErrorSchema,
        success: {
          type: "boolean",
        },
      },
      required: ["error", "success"],
    },
  },
} as const;

export const patchProfileSchema = {
  ...patchProfileRequestSchema,
  ...patchProfileResponseSchema,
  summary: "Update the profile of the signed-in Ethereum address",
};

// *** DELETE profile ***

export const deleteProfileResponseSchema = {
  response: {
    "200": {},
    "4XX": {
      type: "object",
      properties: {
        error: profileErrorSchema,
        success: {
          type: "boolean",
        },
      },
      required: ["error", "success"],
    },
  },
} as const;

export const deleteProfileSchema = {
  ...getProfileRequestSchema,
  ...deleteProfileResponseSchema,
  summary: "Delete the profile of the signed-in Ethereum address",
};
