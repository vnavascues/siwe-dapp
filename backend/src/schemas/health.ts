const getHealthResponseSchema = {
  response: {
    "200": {
      $id: "health",
      type: "object",
      properties: {
        version: {
          type: "string",
        },
      },
      required: ["version"],
    },
  },
};

export const getHealthSchema = {
  ...getHealthResponseSchema,
  summary: "Get the status of the SIWE app API",
};
