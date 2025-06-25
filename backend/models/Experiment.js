const mongoose = require("mongoose");

const experimentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  label: { type: String, required: true },
  icon: { type: String, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  category: { type: String, required: true, enum: ["physics", "ict", "fun"] },
});

module.exports = mongoose.model("Experiment", experimentSchema);
