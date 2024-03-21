import React from 'react'
import { useAccountStore } from '../../store';
import { renderBalance } from '../../util';
import {
  AccountAddress,
  AccountTransactionType,
  CIS2,
  CIS2Contract,
  ConcordiumGRPCClient,
  ConcordiumGRPCWebClient,
  ContractAddress,
  CredentialRegistrationId,
  Energy,
  getPastDate,
  isUpdateContractSummary,
  MIN_DATE,
  TransactionHash,
  Web3StatementBuilder,
} from '@concordium/web-sdk';

export default function Liquid() {

  const {account, isConnected, amount, setAmount, setAccount, setIsConnected} = useAccountStore();
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [showFailure, setShowFailure] = React.useState(false);
  const [depositAmount, setDepositAmount] = React.useState(0);
  const CONTRACT_ADDRESS = ContractAddress.create(8382);

  const handleButtonClick = async () => {
  };


  return (
    <div className='w-full max-w-lg bg-white rounded-xl shadow-sm flex flex-col space-y-8 items-center p-8'>
      <h1 className='text-2xl font-bold'>Deposit Tokens</h1>
      <input type="number" value={depositAmount} onChange={(e)=> setDepositAmount(parseFloat(e.target.value)) }  placeholder='Enter Amount' className="w-full p-4 text-gray-900 border border-gray-300 rounded-xl bg-gray-50 text-base" />
      <p className='text-right w-full text-sm'>Available Balance { renderBalance(amount)}</p>
      <button className="w-full p-4 text-white bg-green-600 rounded-xl" disabled={!isConnected}>Deposit</button>
      <div className='space-y-2 w-full'>
        <div className="flex justify-between text-sm">
          <span>You will receive</span>
          <span>{depositAmount} stETH</span>
        </div>
        <div className="flex justify-between text-sm ">
          <span>Exchange rate</span>
          <span>1 ETH = 1 stETH</span>
        </div>
      </div>

    </div>
  )
}
