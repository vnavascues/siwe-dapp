const getPingResponseSchema = {
  response: {
    "200": {
      type: "string",
    },
  },
};

export const getPingSchema = {
  ...getPingResponseSchema,
  summary: "Check whether the SIWE app service is running",
};
