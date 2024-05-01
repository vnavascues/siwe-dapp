import type { Format } from "ajv";
import { ethers } from "ethers";

export const evmAddressFormat: Format = {
  async: false,
  type: "string",
  validate: (address: string) => ethers.utils.isAddress(address),
};

export const noEmptyStringFormat: Format = {
  async: false,
  type: "string",
  validate: (str: string) => /^(?!^\s+$).+$/g.test(str),
};
