import {
  ContractAddress,
} from '@concordium/web-sdk';


export const DEFAULT_CONTRACT_INDEX = BigInt(81);
export const MAX_CONTRACT_EXECUTION_ENERGY = BigInt(30000);
export const PING_INTERVAL_MS = 5000;
export const TOKEN_CONTRACT = ContractAddress.create(parseInt(process.env.REACT_APP_TOKEN_CONTRACT_INDEX));
export const AHAN_CONTRACT = ContractAddress.create(parseInt(process.env.REACT_APP_AHAN_CONTRACT_INDEX));
export const SCHEMA = process.env.REACT_APP_SCHEMA
