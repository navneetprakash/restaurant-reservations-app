import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "./ReservationList.css";
import { formatDate } from "../utils/formatDate";

const ReservationList = () => {
  const [reservationList, setReservationList] = useState([]);
  const { user, loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = await getAccessTokenSilently();

      const response = await fetch(`${process.env.REACT_APP_API_URL}/reservations/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      // get username from auth0
      const userInfo = { username: user.sub };

      // filter user data in auth0 login to compare with isCreatedBy
      const isCreatedBy = data.filter((author) => author.userId === userInfo.username);

      // set the reservation state to the filtered list
      setReservationList(isCreatedBy);
    };
    fetchData();
  }, [getAccessTokenSilently, user]);

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    <>
      <h1>Upcoming reservations</h1>
      <div>
        {isAuthenticated ? (
          reservationList.length <= 0 ? (
            <>
              <p>You don't have any reservations.</p>
              <div>
                <Link to={`/`} className="restaurant-not-found-link">
                  View all restaurants
                </Link>
              </div>
            </>
          ) : (
            <ul className="reservation-list">
              {reservationList.map((reservation) => {
                return (
                  <li key={reservation.id}>
                    <div className="reservation-item">
                      <h2>{reservation.restaurantName}</h2>
                      <p>{formatDate(reservation.date)}</p>
                      <span className="reservation-details">
                        <Link to={`/reservations/${reservation.id}`}>View details &rarr;</Link>
                      </span>
                    </div>
                    <hr />
                  </li>
                );
              })}
            </ul>
          )
        ) : (
          loginWithRedirect()
        )}
      </div>
    </>
  );
};

export default ReservationList;
