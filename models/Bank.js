const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  bankLogo: {
    type: ObjectId,
    ref: "Media",
  },
  accountNumber: {
    type: String,
    required: true,
  },
  accountOwner: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Bank", schema);
