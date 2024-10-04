import React, { useState } from 'react';
import Portfolio from './Portfolio.tsx';
import Tracking from './Tracking.tsx';

function Sidebar({ setPortfolioValue ,setSelectedStock }) {
  const [activeTab, setActiveTab] = useState('Portfolio');

  return (
    <div>
      <div className="flex space-x-4">
        <button
          className={`p-2 ${activeTab === 'Portfolio' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('Portfolio')}
        >
          Portfolio
        </button>
        <button
          className={`p-2 ${activeTab === 'Tracking' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('Tracking')}
        >
          Tracking
        </button>
      </div>

      <div className="mt-5">
        {activeTab === 'Portfolio' ? (
          <Portfolio setPortfolioValue={setPortfolioValue} setSelectedStock={setSelectedStock} />
        ) : (
          <Tracking setSelectedStock={setSelectedStock} />
        )}
      </div>
    </div>
  );
}

export default Sidebar;
