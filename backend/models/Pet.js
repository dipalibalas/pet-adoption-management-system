const mongoose = require("mongoose");

const petSchema = new mongoose.Schema({
 name: { type: String, required: true },
  species: { type: String, required: true },
  breed: { type: String },
  age: { type: Number },
  color: { type: String },
  description: { type: String },
  image: { type: String },
  status: { type: String, enum: ["available", "adopted"], default: "available" }
}, { timestamps: true });

module.exports = mongoose.model("Pet", petSchema);
