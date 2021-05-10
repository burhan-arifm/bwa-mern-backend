const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  popular: {
    type: Boolean,
  },
  image: [
    {
      type: ObjectId,
      ref: "Image",
    },
  ],
});

module.exports = mongoose.model("Activity", schema);
