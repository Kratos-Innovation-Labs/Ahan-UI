import { WalletApi } from '@concordium/browser-wallet-api-helpers'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'


type AccountState = {
  isConnected: boolean,
  account: string | undefined,
  amount: string,
  setAmount: (amount: string) => void,
  setIsConnected: (isConnected: boolean) => void,
  setAccount: (account: string) => void,
  reset: ()=> void
}


type ClientState = {
  provider: WalletApi | null,
  setProvider: (client: any) => void
}


export const useAccountStore = create(
  persist<AccountState>(
    (set) => ({
      isConnected: false,
      setIsConnected: (isConnected) => set(() => ({ isConnected })),
      account: '',
      setAccount: (account) => set(() => ({ account })),
      amount: '',
      setAmount: (amount) => set(() => ({ amount })),
      reset: () => {
        set({ isConnected: false, account: '', amount: '' })
      },
    }),
    {
      name: 'ahan-storage',
      storage: createJSONStorage(() => sessionStorage)
    },
  ),
)

export const useClientStore = create<ClientState>((
  (set) => ({
    provider: null,
    setProvider: (provider) => set(() => ({ provider }))
  })))