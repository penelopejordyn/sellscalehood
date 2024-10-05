import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Stock {
  symbol: string;
  shortName: string;
  shares: number;
  currentPrice: number | null;
}

function Portfolio({ setPortfolioValue, setSelectedStock }) {
  const [ownedStocks, setOwnedStocks] = useState<Stock[]>([]);

  // The refreshPortfolio function to refresh the state of owned stocks
  const refreshPortfolio = async () => {
    try {
      const response = await axios.get('http://localhost:5000/portfolio');
      setOwnedStocks(response.data); // Update the state with the latest portfolio data
    } catch (error) {
      console.error('Failed to refresh portfolio:', error);
    }
  };



  useEffect(() => {
    // Fetch initial portfolio data when the component mounts
    refreshPortfolio();
  }, []);

  useEffect(() => {
    const totalValue = ownedStocks.reduce((acc, stock) => {
      if (stock.currentPrice !== null) {
        return acc + stock.shares * stock.currentPrice;
      }
      return acc;
    }, 0);
    setPortfolioValue(totalValue);
  }, [ownedStocks, setPortfolioValue]);

  const handleBuy = async (stockSymbol: string, amount: number) => {
    const stock = ownedStocks.find(s => s.symbol === stockSymbol);

    if (!stock || !stock.currentPrice || !amount) {
      console.error('Invalid stock data or amount.');
      return;
    }



    try {
      // Make a POST request to buy the stock
      await axios.post('http://localhost:5000/buy', {
        symbol: stock.symbol,
        shortName: stock.shortName,
        amount, // dollar value to buy shares
        currentPrice: stock.currentPrice
      });

      // Refresh the portfolio after a successful buy
      refreshPortfolio(); // This will ensure the portfolio updates without reloading the page
    } catch (error) {
      console.error('Error buying stock:', error);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold">Portfolio</h3>
      {ownedStocks.length === 0 ? (
        <p>No stocks in portfolio.</p>
      ) : (
        ownedStocks.map(stock => (
          <div
            key={stock.symbol}
            onClick={() => setSelectedStock(stock)}
            className="mt-2 p-4 bg-gray-50 shadow-sm rounded-lg cursor-pointer hover:bg-gray-100"
          >
            <div className="font-bold">{stock.shortName} ({stock.symbol})</div>
            <div>
              Shares: {stock.shares !== undefined && stock.shares !== null 
                ? stock.shares.toFixed(2) 
                : '0.00'}
            </div>
            <div>
              Price: ${stock.currentPrice !== null && stock.currentPrice !== undefined 
                ? stock.currentPrice.toFixed(2) 
                : 'N/A'} per share
            </div>
            <div>
              Market Value: ${stock.currentPrice !== null && stock.currentPrice !== undefined 
                ?(stock.shares * stock.currentPrice).toFixed(2) 
                : 'N/A'}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Portfolio;
