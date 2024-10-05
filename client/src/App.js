import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar.tsx';
import StockPreview from './components/StockPreview/StockPreview.tsx';
import SearchBar from './components/Search/SearchBar.tsx';
import PortfolioSummary from './components/PortfolioSummary/PortfolioSummary.tsx';
import TransactionHistory from './components/TransactionHistory/TransactionHistory.tsx';

function App() {
  const [selectedStock, setSelectedStock] = React.useState(null);
  const [portfolioValue, setPortfolioValue] = useState(0)

  return (
    <div className="h-screen flex flex-row bg-gray-100">
      {/* Left Sidebar */}
      <div className="w-1/3 bg-white p-5 pb-8 overflow-y-auto rounded-br-lg rounded-tr-lg scrollbar">
        <Sidebar setPortfolioValue={setPortfolioValue} setSelectedStock={setSelectedStock} />
      </div>

      {/* Right Section */}
      <div className="w-2/3 flex flex-col">
        {/* Search Bar */}
        <div className="p-5 bg-gray-50 shadow-md">
          <SearchBar setSelectedStock={setSelectedStock} />
        </div>

        {/* Stock Preview */}
        <div className="p-5 flex-grow">
          {selectedStock ? (
            <StockPreview stock={selectedStock} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              Search for a stock to preview details
            </div>
          )}
        </div>

        {/* Portfolio Summary */}
        <div className="p-5">
        <PortfolioSummary className="w-1/3" portfolioValue={portfolioValue }/>
        </div>

        {/*Transaction History */}
        <div className="p-5 bg-gray-100 flex overflow-y-auto scrollbar">
          <TransactionHistory className="w-2/3 overflow-y-auto scrollbar"/>
          <div className="bg-white p-4 shadow-md rounded-lg w-1/3" >
          <h1 className="text-5xl font-semibold">Wellcome to sellscalehood</h1>
           </div>
        </div>
      </div>
    </div>
  );
}

export default App;
