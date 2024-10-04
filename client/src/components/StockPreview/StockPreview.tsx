import axios from 'axios';
import React, { useEffect, useState } from 'react';

interface Stock {
  symbol: string;
  shortName: string;
  currentPrice: number;
  shares?: number; // Optional, used when displaying shares owned
}

function StockPreview({ stock, refreshPortfolio }: { stock: Stock, refreshPortfolio: () => void }) {
  const { symbol, shortName, currentPrice, shares } = stock;


  const isOwned = shares !== undefined && shares > 0;

  const [isTracked, setIsTracked] = useState(false); // Track whether the stock is tracked
  const [buyAmount, setBuyAmount] = useState<number | null>(null); // Amount in dollars to buy
  const [sellAmount, setSellAmount] = useState<number | null>(null); // Number of shares to sell; // Total value of the portfolio

  // Check if the stock is already tracked in the database
  useEffect(() => {
    const checkIfTracked = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/is_tracked/${symbol}`);
        setIsTracked(response.data.tracked);
      } catch (error) {
        console.error('Error checking tracking status', error);
      }
    };

    checkIfTracked();
  }, [symbol]);
  // Handle tracking
  const handleTrack = async () => {
    try {
      const response = await axios.post('http://localhost:5000/track', {
        symbol,
        shortName,
        currentPrice,
      });
      alert(response.data.message);
      setIsTracked(true); // Set as tracked after successful tracking
    } catch (error) {
      console.error('Failed to track stock', error);
    }
  };

  const handleUntrack = async () => {
    try {
      const response = await axios.post('http://localhost:5000/untrack', {
        symbol,
      });
      alert(response.data.message);
      setIsTracked(false); // Set as untracked after successful untracking
    } catch (error) {
      console.error('Failed to untrack stock', error);
    }
  };

  // Handle buy functionality
  const handleBuy = async () => {
    const dollarAmount = buyAmount;
    if (dollarAmount && dollarAmount > 0) {
        const sharesToBuy = dollarAmount / currentPrice; // Calculate shares based on dollar amount
        try {
            const response = await axios.post('http://localhost:5000/buy', {
                symbol,
                shortName: shortName, // Use 'shortName' instead of 'shortName'
                amount: dollarAmount,  // Use 'amount' instead of 'shares'
                currentPrice: currentPrice, // Use 'currentPrice' instead of 'currentPrice'
            });
            alert(response.data.message);
            setBuyAmount(null); // Reset buy amounts
        } catch (error) {
            console.error('Failed to buy stock', error);
        }
    }
};



  // Handle sell functionality
  const handleSell = async () => {
    const sharesToSell = sellAmount;
    if (sharesToSell && sharesToSell > 0 && shares && sharesToSell <= shares) {
      try {
        const response = await axios.post('http://localhost:5000/sell', {
          symbol,
          shares: sharesToSell,
        });
        alert(response.data.message);
        setSellAmount(null); // Reset sell amount
        refreshPortfolio(); // Refresh portfolio after selling
      } catch (error) {
        console.error('Failed to sell stock', error);
      }
    } else {
      alert('not enough shares to sell')
    }
  };

  if (!stock || !stock.currentPrice) {
    alert("The stock doesn't exist or its data is not available.");
    return null; // Return early if stock doesn't exist
  }

  return (
    <div className="bg-white shadow-lg rounded-xl p-5 backdrop-blur-md">
      <h2 className="text-2xl font-bold">{shortName} ({symbol})</h2>
      <p>Price: ${currentPrice.toFixed(2)}</p>
      {isOwned && <p>Shares Owned: {shares.toFixed(4)}</p>}

      <div className="mt-4 flex space-x-4">
        {/* Track/Untrack Section */}
        {isTracked ? (
          <button onClick={handleUntrack} className="bg-red-500 text-white p-2 rounded">
            Untrack
          </button>
        ) : (
          <button onClick={handleTrack} className="bg-blue-500 text-white p-2 rounded">
            Track
          </button>
        )}

        {/* Buy Section */}
        <div>
          <button onClick={() => setBuyAmount(buyAmount === null ? 0 : null)} className="bg-blue-500 text-white p-2 rounded">
            {buyAmount !== null ? "Cancel Buy" : "Buy"}
          </button>
          {buyAmount !== null && (
            <div>
              <input
                type="number"
                value={buyAmount}
                onChange={(e) => setBuyAmount(parseFloat(e.target.value))}
                placeholder="Enter amount in $"
                className="mt-2 p-2 border"
              />
              <button onClick={handleBuy} className="bg-green-500 text-white p-2 rounded mt-2">Confirm Buy</button>
            </div>
          )}
        </div>

        {/* Sell Section */}
        {isOwned && (
          <div>
            <button onClick={() => setSellAmount(sellAmount === null ? 0 : null)} className="bg-red-500 text-white p-2 rounded">
              {sellAmount !== null ? "Cancel Sell" : "Sell"}
            </button>
            {sellAmount !== null && (
              <div>
                <input
                  type="number"
                  value={sellAmount}
                  onChange={(e) => setSellAmount(parseFloat(e.target.value))}
                  placeholder="Enter shares to sell"
                  className="mt-2 p-2 border"
                />
                <button onClick={handleSell} className="bg-red-600 text-white p-2 rounded mt-2">Confirm Sell</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default StockPreview;
