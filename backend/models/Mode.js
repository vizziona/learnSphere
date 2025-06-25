const mongoose = require("mongoose");

const modeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  label: { type: String, required: true },
  icon: { type: String, required: true },
  description: { type: String, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  route: { type: String, required: true },
  experimentType: { type: String, required: true },
});

module.exports = mongoose.model("Mode", modeSchema);
