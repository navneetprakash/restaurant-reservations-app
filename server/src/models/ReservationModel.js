const mongoose = require("mongoose");
const { Schema } = mongoose;

const reservationModel = new Schema({
  restaurantName: { type: String, required: true },
  partySize: { type: Number, required: true },
  userId: { type: String, required: true },
  date: { type: Date, required: true },
});

const Reservation = mongoose.model("Reservation", reservationModel);
module.exports = Reservation;
