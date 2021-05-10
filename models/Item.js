const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    defaulr: "Indonesia",
  },
  popular: {
    type: Boolean,
  },
  description: {
    type: String,
    required: true,
  },
  image: [
    {
      type: ObjectId,
      ref: "Image",
    },
  ],
  features: [
    {
      type: ObjectId,
      ref: "Feature",
    },
  ],
  activities: [
    {
      type: ObjectId,
      ref: "Activity",
    },
  ],
});

module.exports = mongoose.model("Item", schema);
