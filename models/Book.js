const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const schema = new mongoose.Schema({
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  item: [
    {
      _id: {
        type: ObjectId,
        ref: "Image",
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  customer: [
    {
      type: ObjectId,
      ref: "Customer",
    },
  ],
  bankTarget: [
    {
      type: ObjectId,
      ref: "Bank",
    },
  ],
  proofPayment: {
    type: String,
    required: true,
  },
  bankSource: {
    type: String,
    required: true,
  },
  sourceAccountHolder: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Book", schema);
