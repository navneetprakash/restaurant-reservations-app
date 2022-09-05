import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { useAuth0 } from "@auth0/auth0-react";
import "react-datepicker/dist/react-datepicker.css";
import "./CreateReservation.css";
import { addDays } from "date-fns";

const CreateReservation = ({ restaurantName }) => {
  const [partySize, setPartySize] = useState("");
  const [date, setDate] = useState(new Date());

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorStatus, setErrorStatus] = useState(false);

  // get access token
  const { getAccessTokenSilently } = useAuth0();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    const reservation = {
      partySize,
      date,
      restaurantName,
    };

    // await the access token so it gets back with a token
    const accessToken = await getAccessTokenSilently();

    const response = await fetch(`${process.env.REACT_APP_API_URL}/reservations/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",

        // add in authorization
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(reservation),
    });

    if (!response.ok) {
      setIsError(true);
      setErrorStatus(response.status);
    } else {
      setIsLoading(false);
      navigate("/reservations");
    }

    if (isError) {
      return (
        <>
          <p>Error creating a reservation (error status {errorStatus})</p>
        </>
      );
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="" className="control-label">
            Number of guests
          </label>
        </div>
        <input
          type="number"
          min="1"
          max="1000"
          required
          id="partySize"
          className="form-input"
          value={partySize}
          onChange={(event) => {
            setPartySize(event.target.value);
          }}
        />
        <p>Date</p>
        <DatePicker
          selected={date}
          dateFormat="Pp"
          value={date}
          showTimeSelect
          minDate={addDays(new Date(), 0)}
          className="form-input-date"
          onChange={(date) => setDate(date)}
        />
        <button className="btn-submit" disabled={isLoading}>
          Submit
        </button>
      </form>
    </>
  );
};

export default CreateReservation;
