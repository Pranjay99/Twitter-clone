import React from 'react';

function CategorySlider({ categories, selectedCategory, onCategoryChange }) {
  return (
    <div className="category-slider">
      {categories.map((category) => (
        <button
          key={category}
          className={`category-button ${selectedCategory === category ? 'active' : ''}`}
          onClick={() => onCategoryChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default CategorySlider;
