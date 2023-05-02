const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const petSchema = new Schema({
  name: String,
  img: String,
  patCount: Number,
});

module.exports = mongoose.model("Pet", petSchema);
