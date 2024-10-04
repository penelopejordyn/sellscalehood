import React, { useState } from 'react';
import axios from 'axios'

function SearchForm() {
  const [formData, setFormData] = useState({
    symbol: '',
  });
  const [stock, setStock] = useState<{ shortName: string; currentPrice: number; marketCap: number } | null>(null);
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/stock_information', formData);
      setStock(response.data); // Handle success response
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        stock symbol:
        <input type="text" name="symbol" value={formData.symbol} onChange={handleChange} />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}

export default SearchForm;
