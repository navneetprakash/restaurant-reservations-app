const mongoose = require("mongoose");
const { Schema } = mongoose;

const restaurantModel = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
});

const Restaurant = mongoose.model("Restaurant", restaurantModel);
module.exports = Restaurant;
