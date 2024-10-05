import React, { useEffect, useState } from 'react';

function PortfolioSummary({portfolioValue}: {portfolioValue: number},) {
  

  function money_round(num) {
    return Math.ceil(num * 100) / 100;
}

  return (
    <div className={` bg-white p-4 shadow-md rounded-lg`}>
      <h3 className="text-lg text-center font-semibold">Portfolio Value</h3>
      <p className="text-5xl text-center">${money_round(portfolioValue)}</p>
    </div>
  );
}

export default PortfolioSummary;
