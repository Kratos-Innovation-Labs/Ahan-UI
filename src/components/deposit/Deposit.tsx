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
  Parameter,
  ModuleReference,
} from '@concordium/web-sdk';
import { AHAN_CONTRACT, MAX_CONTRACT_EXECUTION_ENERGY, SCHEMA } from '../../config';
import { SchemaType } from '@concordium/browser-wallet-api-helpers';

export default function Deposit() {

  const { account, isConnected, amount } = useAccountStore();
  const { provider } = useClientStore()
  const [depositAmount, setDepositAmount] = React.useState('');
  const [loading,setLoading] = React.useState(false)

  const handleDeposit = async () => {
    try{
      if (provider && account) {

        if( parseFloat(depositAmount) < 0 ){
          alert("Please enter amount greater than 0")
          return;
        }

        setLoading(true)
        const client = new ConcordiumGRPCClient(provider.grpcTransport);
        const info = await client?.getInstanceInfo(AHAN_CONTRACT);
        if (!info) {
          throw new Error(`contract not found`);
        }
        const { version, name, owner, amount, methods } = info;
  
        const prefix = 'init_';
        if (!InitName.toString(name).startsWith(prefix)) {
          throw new Error(`name "${name}" doesn't start with "init_"`);
        }
  
        const txn = await provider.sendTransaction(AccountAddress.fromBase58(account), AccountTransactionType.Update, {
            amount: CcdAmount.fromMicroCcd(0),
            address: AHAN_CONTRACT,
            receiveName: ReceiveName.create(ContractName.fromInitName(info?.name), EntrypointName.fromString('deposit')),
            maxContractExecutionEnergy: Energy.create(MAX_CONTRACT_EXECUTION_ENERGY),
          },
          Number(depositAmount),
          {
            type: SchemaType.Module,
            value: SCHEMA,
          }
        )
  
        console.log(txn)
        setLoading(false)
      }
    }catch(error){
      console.log(error)
      setLoading(false)
    }


  };


  return (
    <div className='w-full max-w-lg bg-white dark:bg-gray-700 rounded-xl shadow-sm flex flex-col space-y-8 items-center p-8'>
      <h1 className='text-2xl font-bold dark:text-white'>Deposit Tokens</h1>
      <div className="relative w-full">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 574 574" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M0.652924 0.806641L0.652924 254.519H573.29V161.19H92.1935V94.1362H573.29V0.806641L0.652924 0.806641ZM0.652924 319.731L0.652924 573.444H573.29V480.114H92.1935V413.06H573.29V319.731H0.652924Z" fill="black"></path>
          </svg>
        </div>
        <input type="text" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50  focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="Enter Amount" required />
        <button onClick={() => setDepositAmount(renderBalance(amount))} className="text-white absolute end-2.5 bottom-2.5 bg-green-600 hover:bg-green-500 focus:outline-none font-medium rounded-lg text-sm px-4 py-2 dark:bg-green-600 dark:hover:bg-green-500 ">MAX</button>
      </div>
      <p className='text-right w-full text-sm dark:text-white'>Available Balance {amount}</p>

      <button className={ `w-full p-4 text-white ${isConnected ? 'bg-green-600' : 'bg-gray-300' }  rounded-xl`} disabled={!isConnected} onClick={handleDeposit}>
        { loading ? 
          <div className="flex justify-center">
            <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-green-900" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
          :
          <span>Deposit</span>
        }
      </button>

      <div className='space-y-2 w-full'>
        <div className="flex justify-between text-sm dark:text-white">
          <span>You will receive</span>
          <span>{depositAmount} liEUROe</span>
        </div>
        <div className="flex justify-between text-sm  dark:text-white">
          <span>Exchange rate</span>
          <span>1 EUROe = 1 liEUROe</span>
        </div>
      </div>

    </div>
  )
}

