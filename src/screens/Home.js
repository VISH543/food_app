import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import Carousel from '../components/Carousel'; // Import the Carousel component
import { BASE_URL } from '../helper';

export default function Home() {
  const [foodCat, setFoodCat] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true); // State to track loading state

  const loadFoodItems = async () => {
    try {
      let response = await fetch(`${BASE_URL}/api/auth/foodData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      let jsonResponse = await response.json();
      console.log('API Response:', jsonResponse);
      
      if (jsonResponse.length > 1) {
        setFoodItems(jsonResponse[0]);
        setFoodCat(jsonResponse[1]);
      } else {
        console.error('Unexpected API response structure:', jsonResponse);
      }
    } catch (error) {
      console.error('Error fetching food data:', error);
      
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    loadFoodItems();
  }, []);



  return (
    <div>
      <Navbar />
      <Carousel setSearch={setSearch} /> 
      <div className='container'>
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : foodCat.length > 0 ? (
          foodCat.map((data) => (
            <div key={data.id} className='row mb-3'>
              <div className='fs-3 m-3'>
                {data.CategoryName}
              </div>
              <hr id="hr-success" style={{ height: "4px", backgroundImage: "-webkit-linear-gradient(left,rgb(0, 255, 137),rgb(0, 0, 0))" }} />
              {foodItems.length > 0 ? (
                foodItems.filter(
                  (items) => (items.CategoryName === data.CategoryName) && (items.name.toLowerCase().includes(search.toLowerCase()))
                ).map(filterItems => (
                  <div key={filterItems.id} className='col-12 col-md-6 col-lg-3'>
                    <Card foodName={filterItems.name} item={filterItems} options={filterItems.options[0]} ImgSrc={filterItems.img} />
                  </div>
                ))
              ) : (
                <div>No Such Data</div>
              )}
            </div>
          ))
        ) : (
          <div>No Food Categories Available</div>
        )}
      </div>
      <Footer />
    </div>
  );
}
