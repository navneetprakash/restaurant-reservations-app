const mongoose = require("mongoose");
const express = require("express");
const { auth } = require("express-oauth2-jwt-bearer");
const cors = require("cors");
const app = express();

const { celebrate, Joi, errors, Segments } = require("celebrate");
const RestaurantModel = require("./models/RestaurantModel");
const ReservationModel = require("./models/ReservationModel");
const formatRestaurant = require("./formatRestaurants");
const formatReservation = require("./formatReservation");

app.use(cors());
app.use(express.json());

// Authorization middleware.
const checkJwt = auth({
  audience: "https://restuarantreservationz/api",
  issuerBaseURL: `https://dev-navneet.au.auth0.com/`,
});

// GET all restaurants route
app.get("/restaurants", async (req, res) => {
  const restaurants = await RestaurantModel.find({});
  return res.status(200).send(restaurants.map(formatRestaurant));
});

// GET a single restaurant
app.get("/restaurants/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ error: "invalid id provided" });
  }
  // get restaurant using id
  const restaurant = await RestaurantModel.findById(id);

  if (restaurant === null) {
    return res.status(404).send({ error: "restaurant not found" });
  }

  return res.status(200).send(formatRestaurant(restaurant));
});

// GET all reservations
app.get("/reservations", checkJwt, async (req, res) => {
  const userId = req.query.userId;
  const { auth } = req;

  const sub = auth.payload.sub;

  let reservations = {};

  if (userId != null) {
    reservations = await ReservationModel.find({ userId: userId });
  } else {
    reservations = await ReservationModel.find({ userId: sub });
  }

  const formattedReservations = reservations.map((reservation) => {
    return formatReservation(reservation);
  });

  return res.status(200).send(formattedReservations);
});

// GET a single Reservation
app.get("/reservations/:id", checkJwt, async (req, res) => {
  const { id } = req.params;
  const { auth } = req;

  const sub = auth.payload.sub;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ error: "invalid id provided" });
  }
  // get reservations using id
  const reservation = await ReservationModel.findById(id);

  if (reservation === null) {
    return res.status(404).send({ error: "not found" });
  }

  if (reservation.userId !== sub) {
    return res.status(403).send({ error: "user does not have permission to access this reservation" });
  }

  return res.status(200).send(formatReservation(reservation));
});

// POST a reservation
app.post(
  "/reservations",
  checkJwt,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      partySize: Joi.number().required(),
      date: Joi.date().required(),
      restaurantName: Joi.string().required(),
    }),
  }),

  async (req, res, next) => {
    try {
      const { body, auth } = req;

      const document = {
        userId: auth.payload.sub,
        ...body,
      };

      const reservation = new ReservationModel(document);

      await reservation.save();

      return res.status(201).send(formatReservation(reservation));
    } catch (error) {
      error.status = 400;
      next(error);
    }
  }
);

// Get all reservations for signed in user
app.get("/user/reservations", checkJwt, async (req, res) => {
  const { auth } = req;

  const userId = auth.payload.sub;

  const reservations = await ReservationModel.find({ userId: userId });
  const formattedReservation = reservations.map((reservation) => {
    return formatReservation(reservation);
  });
  return res.status(200).send(formattedReservation);
});

// Get a user reservation by id
app.get("/user/reservations/:id", checkJwt, async (req, res) => {
  const { id } = req.params;
  const { auth } = req;

  const isIdValid = mongoose.Types.ObjectId.isValid(id);
  if (!isIdValid) {
    return res.status(400).send({ message: "Invalid id" });
  }
  const reservation = await ReservationModel.findById(id);
  if (reservation === null) {
    return res.status(404).send({ message: "Not found" });
  }
  if (reservation.userId !== auth.payload.sub) {
    return res.status(403).send({ error: "user does not have permission to access this reservation" });
  }

  return res.status(200).send(formatReservation(reservation));
});

app.use(errors());
module.exports = app;
