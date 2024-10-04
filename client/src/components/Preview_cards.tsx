import React, { useState } from 'react';
import axios from 'axios';

function StockInfo({ stock }) {
  return (
    <div>
      <h1>{stock.shortName}</h1>
      <p>Price: {stock.currentPrice}</p>
      <p>Market Cap: {stock.marketCap}</p>
        {/* add if owned log */}
    </div>
  );
}

export default StockInfo;