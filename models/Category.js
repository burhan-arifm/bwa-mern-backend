const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  items: [
    {
      type: ObjectId,
      ref: "Item",
    },
  ],
});

module.exports = mongoose.model("Category", schema);
