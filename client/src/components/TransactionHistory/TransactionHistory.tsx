import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Stock {
  symbol: string;
  type: string;
  shares: number;
  price: number;
  action: string;
  timestamp: string;
}


function TransactionHistory({className}) {

  const [transactions, setTransactions] = useState<Stock[]>([]);
  
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/trade_history');
        setTransactions(response.data);
      } catch (error) {
        console.error('failed to fetch tracked stocks', error);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className={` bg-white p-4 shadow-md rounded-lg ${className}`}>
      <h3 className="text-sm font-semibold">Transaction History</h3>
      {transactions.map((txn, index) => (
        <div key={index} className="mt-2">
          <div>
            {txn.action === 'sell' ? 'sold' : 'bought'} {txn.shares} shares of {txn.symbol} at ${txn.price.toFixed(2)} for {(txn.shares * txn.price).toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
}

export default TransactionHistory;
