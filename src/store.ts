import { create } from 'zustand'


type AccountState = {
  client: any,
  isConnected: boolean,
  account: string | undefined,
  amount: bigint,
  setAmount: (amount: bigint) => void,
  setIsConnected: (isConnected: boolean) => void,
  setAccount: (account: string) => void
  setClient: (client: any) => void
}

export const useAccountStore = create<AccountState>((set) => ({
  isConnected: false,
  setIsConnected: (isConnected) => set(() => ({ isConnected})),
  account: '',
  setAccount: (account) => set(() => ({ account })),
  amount: 0n,
  setAmount: (amount) => set(() => ({ amount })),
  client: null,
  setClient: (client) => set(() => ({ client }))
}))