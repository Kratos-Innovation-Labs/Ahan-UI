import React from 'react'
import { useAccountStore, useClientStore } from '../../store';
import { renderBalance } from '../../util';
import { AHAN_CONTRACT, MAX_CONTRACT_EXECUTION_ENERGY } from '../../config';
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

export default function Withdraw() {


  const {account, isConnected, amount} = useAccountStore();
  const { provider } = useClientStore()

  const [withdrawAmount, setWwithdrawAmount] = React.useState(0);
  
  const handleWwithdraw = async () => {
    if(provider && account ){

      const client = new ConcordiumGRPCClient(provider.grpcTransport);
      const info = await client?.getInstanceInfo(AHAN_CONTRACT);
      if (!info) {
        throw new Error(`contract not found`);
      }
      const { version, name, owner, amount, methods } = info;

      console.log(methods)

      const prefix = 'init_';
      if (!InitName.toString(name).startsWith(prefix)) {
          throw new Error(`name "${name}" doesn't start with "init_"`);
      }

      const txn = await provider.sendTransaction( AccountAddress.fromBase58(account),AccountTransactionType.Update,{
        amount: CcdAmount.fromMicroCcd(withdrawAmount),
        address: AHAN_CONTRACT,
        receiveName: ReceiveName.create(ContractName.fromInitName(info?.name), EntrypointName.fromString('withdraw')),
        maxContractExecutionEnergy: Energy.create(MAX_CONTRACT_EXECUTION_ENERGY),
      })

      console.log(txn)
    }
    
  };



  return (
    <div className='w-full max-w-lg bg-white dark:bg-gray-700 rounded-xl shadow-sm flex flex-col space-y-8 items-center p-8'>
      <h1 className='text-2xl font-bold dark:text-white'>Withdraw Tokens</h1>
      <input type="text" placeholder='Enter Amount' className="w-full p-4 text-gray-900 border border-gray-300 rounded-xl bg-gray-50 text-base" />
      <p className='text-right w-full text-sm dark:text-white'>Available Balance { renderBalance(amount)}</p>
      <button className={ `w-full p-4 text-white ${isConnected ? 'bg-green-600' : 'bg-gray-300' }  rounded-xl`} disabled={!isConnected} onClick={handleWwithdraw}>Withdraw</button>
      <div className='space-y-2 w-full'>
        <div className="flex justify-between text-sm dark:text-white">
          <span>You will receive</span>
          <span>0.0 stETH</span>
        </div>
        <div className="flex justify-between text-sm dark:text-white">
          <span>Exchange rate</span>
          <span>1 ETH = 1 stETH</span>
        </div>
      </div>

    </div>
  )
}
