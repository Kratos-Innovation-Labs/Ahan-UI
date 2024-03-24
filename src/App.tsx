import  { useEffect, useCallback, useState } from 'react';
import { detectConcordiumProvider } from '@concordium/browser-wallet-api-helpers';
import { useAccountStore, useClientStore } from './store';
import { CIS2, CIS2Contract, ConcordiumGRPCClient, AccountAddress } from '@concordium/web-sdk';
import { TOKEN_CONTRACT } from './config';

import Navbar from './components/shared/Navbar';
import {
  Routes, Route,
} from "react-router-dom";
import Withdraw from "./components/withdraw/Withdraw";
import Deposit from "./components/deposit/Deposit";



export default function App() {

  const {account, isConnected, setAmount, setAccount, setIsConnected} = useAccountStore();
  const { provider, setProvider } = useClientStore()
  const [theme, setTheme ] = useState(localStorage.getItem('theme') !== "" ? 'dark' : localStorage.getItem('theme') )
 
  useEffect(() => {
    // Update localStorage when dark mode changes
    if(theme){
      localStorage.setItem('theme', theme);
    }
  }, [theme]);
  

  const handleGetAccount = useCallback((accountAddress: string | undefined) => {
    let account = accountAddress ?  accountAddress : ''
    setAccount(account);
    setIsConnected(Boolean(accountAddress));
  }, []);

  const handleOnClick = useCallback(
    () =>
      detectConcordiumProvider()
        .then((provider) => provider.connect())
        .then(handleGetAccount),
    []
  );

  const getBalance = async() =>{
    if(provider && isConnected  ){
      const client = new ConcordiumGRPCClient(provider.grpcTransport);
      const contractClient = await CIS2Contract.create(client, TOKEN_CONTRACT);

      if(account){
        const query: CIS2.BalanceOfQuery = {
          tokenId: '01',
          address: AccountAddress.fromBase58(account) ,
        };

        const balance = await contractClient.balanceOf(query);

        console.log(balance)
        setAmount(balance.toString())
      }
    }
    
  }

  useEffect(() => {
    detectConcordiumProvider()
      .then( async(provider) => {
        setProvider(provider)
        // Listen for relevant events from the wallet.
        provider.on('accountChanged', setAccount);
        provider.on('accountDisconnected', () =>
          provider.getMostRecentlySelectedAccount().then(handleGetAccount)
        );
        provider.on('chainChanged', (chain) => console.log(chain));
        // Check if you are already connected
        provider.getMostRecentlySelectedAccount().then(handleGetAccount);

        const client = new ConcordiumGRPCClient(provider.grpcTransport);
        const contractClient = await CIS2Contract.create(client, TOKEN_CONTRACT);

        console.log(contractClient)
        if(account){
          const query: CIS2.BalanceOfQuery = {
            tokenId: '',
            address: AccountAddress.fromBase58(account) ,
          };
  
          const balance = await contractClient.balanceOf(query);
          setAmount(balance.toString())
        }
      })
      .catch(() => setIsConnected(false));
  }, []);

  useEffect(() => {
    getBalance()
  }, [account]);


  return (
    <div className={`bg-gray-200 min-h-screen dark:bg-gray-800 ${localStorage.getItem('theme')}`}>
      <Navbar handleOnClick={handleOnClick} theme={theme} setTheme={setTheme} />
      <div className='max-w-screen p-4 flex justify-center'>
        <Routes>
          <Route path="/" Component={Deposit} /> 
          <Route path="/withdraw" Component={Withdraw} /> 
        </Routes>
      </div>
    </div>
  );
}
