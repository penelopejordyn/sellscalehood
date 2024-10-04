import React, { useEffect, useState } from 'react';

function PortfolioSummary({portfolioValue}: {portfolioValue: number}) {
  

  function money_round(num) {
    return Math.ceil(num * 100) / 100;
}

  return (
    <div className="w-1/2 bg-white p-4 shadow-md rounded-lg">
      <h3 className="text-lg font-semibold">Portfolio Value</h3>
      <p>${money_round(portfolioValue)}</p>
    </div>
  );
}

export default PortfolioSummary;
