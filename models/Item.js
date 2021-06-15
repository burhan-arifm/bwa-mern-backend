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
    default: "Indonesia",
  },
  isPopular: {
    type: Boolean,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: ObjectId,
    ref: "Category",
  },
  media: [
    {
      type: ObjectId,
      ref: "Media",
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
