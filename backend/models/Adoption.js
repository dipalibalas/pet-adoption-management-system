const mongoose = require("mongoose");

const adoptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  pet: { type: mongoose.Schema.Types.ObjectId, ref: "Pet" },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }
}, { timestamps: true });

module.exports = mongoose.model("Adoption", adoptionSchema);
