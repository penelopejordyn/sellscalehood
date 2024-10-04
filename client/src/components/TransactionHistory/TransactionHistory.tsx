import React from 'react';

function TransactionHistory() {
  // Mock transaction data
  const transactions = [
    { type: 'Buy', symbol: 'MSFT', amount: 10, price: 415.92 },
    { type: 'Sell', symbol: 'AAPL', amount: 5, price: 173.78 }
  ];

  return (
    <div className="w-1/2 bg-white p-4 shadow-md rounded-lg">
      <h3 className="text-lg font-semibold">Transaction History</h3>
      {transactions.map((txn, index) => (
        <div key={index} className="mt-2">
          <div>
            {txn.type} {txn.amount} shares of {txn.symbol} at ${txn.price.toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
}

export default TransactionHistory;
