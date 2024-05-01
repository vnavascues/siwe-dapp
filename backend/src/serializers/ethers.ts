import type { ContractTransaction } from "ethers";

import type { ContractTx } from "../schemas";

export function serializeContractTransaction(contractTx: ContractTransaction): ContractTx {
  return {
    hash: contractTx.hash,
  };
}
