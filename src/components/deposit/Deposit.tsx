import React from 'react'
import { useAccountStore, useClientStore } from '../../store';
import { renderBalance } from '../../util';
import {
  AccountAddress,
  AccountTransactionType,
  EntrypointName,
  Energy,
  ReceiveName,
  ContractName,
  InitName,
  CcdAmount,
  ConcordiumGRPCClient,
} from '@concordium/web-sdk';
import { AHAN_CONTRACT_ADDRESS, MAX_CONTRACT_EXECUTION_ENERGY } from '../../config';

export default function Deposit() {

  const { account, isConnected, amount } = useAccountStore();
  const { provider } = useClientStore()
  const [depositAmount, setDepositAmount] = React.useState('');

  const handleDeposit = async () => {
    if (provider && account) {

      const client = new ConcordiumGRPCClient(provider.grpcTransport);
      const info = await client?.getInstanceInfo(AHAN_CONTRACT_ADDRESS);
      if (!info) {
        throw new Error(`contract not found`);
      }
      const { version, name, owner, amount, methods } = info;

      const prefix = 'init_';
      if (!InitName.toString(name).startsWith(prefix)) {
        throw new Error(`name "${name}" doesn't start with "init_"`);
      }

      const txn = await provider.sendTransaction(AccountAddress.fromBase58(account), AccountTransactionType.Update, {
        amount: CcdAmount.fromMicroCcd(10),
        address: AHAN_CONTRACT_ADDRESS,
        receiveName: ReceiveName.create(ContractName.fromInitName(info?.name), EntrypointName.fromString('deposit')),
        maxContractExecutionEnergy: Energy.create(MAX_CONTRACT_EXECUTION_ENERGY),
      })

      console.log(txn)
    }

  };


  return (
    <div className='w-full max-w-lg bg-white rounded-xl shadow-sm flex flex-col space-y-8 items-center p-8'>
      <h1 className='text-2xl font-bold'>Deposit Tokens</h1>
      <div className="relative w-full">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 574 574" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M0.652924 0.806641L0.652924 254.519H573.29V161.19H92.1935V94.1362H573.29V0.806641L0.652924 0.806641ZM0.652924 319.731L0.652924 573.444H573.29V480.114H92.1935V413.06H573.29V319.731H0.652924Z" fill="black"></path>
          </svg>
        </div>
        <input type="text" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50  focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="Enter Amount" required />
        <button onClick={() => setDepositAmount(renderBalance(amount))} className="text-white absolute end-2.5 bottom-2.5 bg-green-600 hover:bg-green-500 focus:outline-none font-medium rounded-lg text-sm px-4 py-2 dark:bg-green-600 dark:hover:bg-green-500 ">MAX</button>
      </div>
      <p className='text-right w-full text-sm'>Available Balance {renderBalance(amount)}</p>

      <button className={ `w-full p-4 text-white ${isConnected ? 'bg-green-600' : 'bg-gray-300' }  rounded-xl`} disabled={!isConnected} onClick={handleDeposit}>Deposit</button>

      <div className='space-y-2 w-full'>
        <div className="flex justify-between text-sm">
          <span>You will receive</span>
          <span>{depositAmount} liEUROe</span>
        </div>
        <div className="flex justify-between text-sm ">
          <span>Exchange rate</span>
          <span>1 EUROe = 1 liEUROe</span>
        </div>
      </div>

    </div>
  )
}

