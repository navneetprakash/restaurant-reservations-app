import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import "./RestaurantList.css";

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/restaurants`);
      const data = await response.json();
      setRestaurants(data);
    };
    fetchData();
  }, []);

  return (
    <>
      <h1>Restaurants</h1>
      <ul className="restaurant-card">
        {restaurants.map((restaurant) => {
          return (
            <li key={restaurant.id} className="restaurant-list-item">
              <div className="restaurant-img">
                <LazyLoadImage src={restaurant.image} alt={restaurant.name} effect="blur" />
              </div>
              <div className="restaurant-content">
                <div className="restaurant-info">
                  <h2>{restaurant.name}</h2>
                  <p>{restaurant.description}</p>
                  <Link to={`/restaurants/${restaurant.id}`} className="btn-reserve">
                    Reserve now &rarr;
                  </Link>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default RestaurantList;
