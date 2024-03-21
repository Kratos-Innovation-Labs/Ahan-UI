import {
    AccountAddress,
    AccountTransactionType,
    CIS2,
    CIS2Contract,
    ConcordiumGRPCClient,
    ContractAddress,
    CredentialRegistrationId,
    Energy,
    getPastDate,
    isUpdateContractSummary,
    MIN_DATE,
    TransactionHash,
    Web3StatementBuilder,
  } from '@concordium/web-sdk';

export const CONTRACT_ADDRESS = ContractAddress.create(7260);