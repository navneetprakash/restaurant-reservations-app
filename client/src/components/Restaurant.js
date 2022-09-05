import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CreateReservation from "./CreateReservation";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import "./Restaurant.css";

import { useAuth0 } from "@auth0/auth0-react";

const Restaurant = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState({});
  const [isNotFound, setIsNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { isAuthenticated } = useAuth0();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/restaurants/${id}`);

      if (response.ok === false) {
        setIsNotFound(true);
        return;
      }

      const data = await response.json();
      setRestaurant(data);
      setIsLoading(false);
    };

    fetchData();
  }, [id]);

  if (isNotFound) {
    return (
      <>
        <p>Sorry, we can't find that</p>
      </>
    );
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h1>Restaurants</h1>
      <div className="restaurant-card-single">
        <div className="restaurant-img-single">
          <LazyLoadImage src={restaurant.image} alt={restaurant.name} effect="blur" />
        </div>
        <div className="restaurant-contents-single">
          <h2>{restaurant.name}</h2>
          <p>{restaurant.description}</p>
        </div>
      </div>
      {isAuthenticated ? <CreateReservation restaurantName={restaurant.name} /> : <></>}
    </>
  );
};

export default Restaurant;
