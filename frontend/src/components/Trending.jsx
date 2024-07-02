import React, { useEffect, useState } from 'react';
import axios from 'axios';

function CategorySlider({ categories, selectedCategory, onCategoryChange }) {
  return (
    <div className="flex overflow-x-auto mb-4">
      {categories.map((category) => (
        <button
          key={category}
          className={`px-4 py-2 mr-2 rounded ${selectedCategory === category ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'} transition-colors duration-300 ease-in-out`}
          onClick={() => onCategoryChange(category)}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </button>
      ))}
    </div>
  );
}

function Trending() {
  const [news, setNews] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('general');
  const categories = ['general', 'business', 'entertainment', 'sports', 'technology'];

  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await axios.get(`https://twitter-clone-backend-vx80.onrender.com/api/news?category=${selectedCategory}`);
        const filteredNews = response.data.articles.filter(article => article.urlToImage);
        setNews(filteredNews);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    }
    fetchNews();
  }, [selectedCategory]);

  return (
    <div className='md:w-[50%] w-[85%] p-4'>
      <CategorySlider
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      <h2 className='font-bold md:text-3xl text-lg py-2'>Trending News</h2>
      <ul className="list-none p-0">
        {news.map((article, index) => (
          <li key={index} className="mb-5 pb-2 border-b border-gray-300">
            <a href={article.url} target="_blank" rel="noopener noreferrer" className="no-underline text-black">
              <div className="flex items-center">
                <img src={article.urlToImage} alt={article.title} className="w-24 h-auto mr-4" />
                <div>
                  <h3 className="font-semibold md:text-lg text-sm">{article.title}</h3>
                  <p className="text-gray-600">{new Date(article.publishedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Trending;
