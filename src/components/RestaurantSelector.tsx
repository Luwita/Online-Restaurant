import React from 'react';

const RestaurantSelector: React.FC = () => {
  return (
    <div className="text-gray-300">
      <label className="sr-only" htmlFor="restaurant-select">Restaurant</label>
      <select
        id="restaurant-select"
        className="bg-transparent border border-white/20 text-sm text-gray-300 rounded px-3 py-2"
        defaultValue="main"
        onChange={() => { /* noop - implement selection logic if available */ }}
      >
        <option value="main">Main Branch</option>
        <option value="downtown">Downtown</option>
        <option value="airport">Airport</option>
      </select>
    </div>
  );
};

export default RestaurantSelector;
