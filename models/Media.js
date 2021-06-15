const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  mediaId: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Media", schema);
