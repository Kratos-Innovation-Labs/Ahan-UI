import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { detectConcordiumProvider } from '@concordium/browser-wallet-api-helpers';
import { useAccountStore } from '../../store';
import { CIS2, CIS2Contract, ConcordiumGRPCClient, Address, AccountAddress } from '@concordium/web-sdk';
import { CONTRACT_ADDRESS } from '../../consts';



export default function Navbar() {
  return (
    <nav className="bg-gray-200 border-gray-200 dark:bg-gray-700 dark:border-gray-700">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="self-center text-bold text-xl tracking-wide whitespace-nowrap dark:text-white">AHAN</span>
        </a>
        <button data-collapse-toggle="navbar-dropdown" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-dropdown" aria-expanded="false">
          <span className="sr-only">Open main menu</span>
          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15" />
          </svg>
        </button>
        <div className="hidden w-full md:block md:w-auto" id="navbar-dropdown">
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
            <li>
              <a href="/" className="block py-2 px-3 text-gray-900 rounded ">Deposit</a>
            </li>
            <li>
              <a href="/withdraw" className="block py-2 px-3 text-gray-900 rounded ">Withdraw</a>
            </li>
          </ul>
        </div>
        <WalletButton />
      </div>
    </nav>
  )
}



function WalletButton() {
  const {account, isConnected, setAmount, setAccount, setIsConnected} = useAccountStore();

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

  useEffect(() => {
    detectConcordiumProvider()
      .then( async(provider) => {
        // Listen for relevant events from the wallet.
        provider.on('accountChanged', setAccount);
        provider.on('accountDisconnected', () =>
          provider.getMostRecentlySelectedAccount().then(handleGetAccount)
        );
        provider.on('chainChanged', (chain) => console.log(chain));
        // Check if you are already connected
        provider.getMostRecentlySelectedAccount().then(handleGetAccount);

        const client = new ConcordiumGRPCClient(provider.grpcTransport);
        const contractClient = await CIS2Contract.create(client, CONTRACT_ADDRESS);
        const query: CIS2.BalanceOfQuery = {
          tokenId: '',
          address: AccountAddress.fromBase58('3N2PvtceNkTXkTbd7f25jVv6vasfDVetrmnHQJSqz9abFGbgwC') ,
        };

        const balance = await contractClient.balanceOf(query);
        setAmount(balance)
        

      })
      .catch(() => setIsConnected(false));
  }, []);

  console.log(account)



  return (

    <div className="mt-3 mb-3">
      <div>
        {!isConnected && (
          <button type="button" className='w-100 bg-green-600 py-2 px-4 rounded-xl text-white' onClick={handleOnClick}>
            Connect Wallet
          </button>
        )}
        {account && (
          <button type="button" className='w-100 bg-green-600 py-2 px-4 rounded-xl text-white'>
            {account.slice(0, 4)}...{account.slice(-4)}
          </button>
        )}
      </div>
    </div>
  );
}