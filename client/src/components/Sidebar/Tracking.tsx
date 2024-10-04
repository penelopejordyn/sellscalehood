import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Stock {
  symbol: string;
  shortName: string;
  currentPrice: number; // Use currentPrice as per backend response
}

function Tracking({ setSelectedStock }: { setSelectedStock: (stock: Stock) => void }) {
  const [trackedStocks, setTrackedStocks] = useState<Stock[]>([]);

  useEffect(() => {
    const fetchTrackedStocks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/tracked');
        setTrackedStocks(response.data);
      } catch (error) {
        console.error('failed to fetch tracked stocks', error);
      }
    };

    fetchTrackedStocks();
  }, []);

  return (
    <div>
      <h3 className="text-lg font-semibold">Tracking</h3>
      {trackedStocks.map((stock) => (
        <div
          key={stock.symbol}
          onClick={() => setSelectedStock(stock)}
          className="mt-2 p-4 bg-gray-50 shadow-sm rounded-lg cursor-pointer"
        >
          <div className="font-bold">{stock.shortName} ({stock.symbol})</div>
          <div>
            Price: ${stock.currentPrice.toFixed(2)} {/* Use currentPrice as returned by backend */}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Tracking;
