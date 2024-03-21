import { createContext } from "react";

export function setErrorString(setError: (err: string) => void) {
  return (err: any) => setError(errorString(err));
}

export function errorString(err: any): string {
  return (err as Error).message || (err as string);
}


export function microCcdToCcdString(amount: bigint) {
  const int = amount / BigInt(1e6);
  const frac = amount % BigInt(1e6);
  return `${int}.${frac.toString().padStart(6, '0')}`;
}

export function renderBalance(balance: bigint): string {
  if (balance === 0n) {
      return '0.0';
  }
  const after = balance % 1000000n;
  const before = balance / 1000000n;
  if (after === 0n) {
      return before.toString() + '.0';
  }
  return before.toString() + '.' + removeTrailingZeros(after.toString().padStart(6, '0'));
}

function removeTrailingZeros(s: string): string {
  let end = s.length;
  while (end > 0) {
    if (s[end - 1] === '0') {
      end -= 1;
    } else {
      break;
    }
  }
  return s.substring(0, end);
}