import React, { useState } from 'react';
import axios from 'axios';

interface StockData {
  shortName: string;
  currentPrice: number;
  symbol: string;
}

interface SearchBarProps {
  setSelectedStock: (stock: StockData) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ setSelectedStock }) => {
  const [formData, setFormData] = useState<{ symbol: string }>({
    symbol: '',
  });

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post<StockData>('http://localhost:5000/stock_information', formData);
      const stockData = response.data;
      setSelectedStock(stockData); // Update selected stock with API response
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="flex space-x-2">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="p-2 border border-gray-300 rounded flex-grow"
          placeholder="Search Stock"
          name="symbol"
          value={formData.symbol}
          onChange={handleChange}
        />
        <button className="p-2 bg-blue-500 text-white rounded" type="submit">
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
