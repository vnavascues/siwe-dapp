import type { SiweMessage } from "siwe";

import type { JSONObject } from "../libs/utils/types";
import type { ContractTx as szContractTx, ProfileData as szProfileData } from "../schemas";

export interface ServiceError {
  type: string;
  expected?: string;
  received?: string;
}

export interface Service {
  statusCode: number;
  success?: boolean;
  data?: JSONObject | JSONObject[] | szProfileData | SiweMessage | szContractTx;
  error?: ServiceError;
}
