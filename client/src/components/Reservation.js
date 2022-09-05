import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { formatDate } from "../utils/formatDate";
import "./Reservation.css";

const Reservation = () => {
  const { id } = useParams();

  const [reservation, setReservation] = useState({ date: Date.now() });
  const { user, loginWithRedirect, isAuthenticated } = useAuth0();
  const [cannotfindReservation, setCannotfindReservation] = useState(false);
  const [currentLoggedInUser, setCurrentLoggedInUser] = useState();

  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchData = async () => {
      setCannotfindReservation(true);
      const accessToken = await getAccessTokenSilently();

      const response = await fetch(`${process.env.REACT_APP_API_URL}/reservations/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      // get username from auth0
      const userInfo = user.sub;

      // filter user data in auth0 login to compare with isCreatedBy
      const isCreatedBy = data.filter((author) => author.userId === userInfo);

      // filtered single reservation by that id
      const filteredReservation = isCreatedBy.filter((el) => el.id === id);

      // set the reservation state to the filtered list
      // will go inside the array and is alway the first object with index 0
      const filteredWithoutArrayIndex = filteredReservation[0];

      if (filteredWithoutArrayIndex === undefined) {
        return;
      } else {
        setReservation(filteredWithoutArrayIndex);
        setCurrentLoggedInUser(filteredWithoutArrayIndex.id);
        setCannotfindReservation(false);
      }
    };
    fetchData();
  }, [id, getAccessTokenSilently, currentLoggedInUser, user?.sub]);

  if (cannotfindReservation) {
    return (
      <>
        <p style={{ color: "red" }}>Sorry! We can't find that reservation</p>
        <div className="reservation-btn-back">
          <Link to={`/reservations`}>&larr; Back to reservations</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <h1>Reservation</h1>

      {isAuthenticated ? (
        id ? (
          <ul className="reservation-list">
            <li key={reservation.id}>
              <h2>{reservation.restaurantName}</h2>
              <p>{formatDate(reservation.date)}</p>
              <p>
                <span className="reservation-quest-size">Party size:</span> {reservation.partySize}
              </p>
            </li>
            <hr />
            <div className="reservation-btn-back">
              <Link to={`/reservations`}>&larr; Back to reservations</Link>
            </div>
          </ul>
        ) : (
          <></>
        )
      ) : (
        loginWithRedirect()
      )}
    </>
  );
};

export default Reservation;
