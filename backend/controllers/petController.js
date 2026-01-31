const Pet = require("../models/Pet");

exports.createPet = async (req, res) => {
  try {
    const pet = await Pet.create(req.body);
    res.status(201).json({ msg: "Pet added successfully", data: pet });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPets = async (req, res) => {
  try {
    const { species, breed, search, page = 1, limit = 6 } = req.query;
    const filter = {};
    if (species) filter.species = species;
    if (breed) filter.breed = breed;
    if (search) filter.name = { $regex: search, $options: "i" };
    const pets = await Pet.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({
      msg: "Pets fetched successfully",
      data: pets,
      page: Number(page),
      limit: Number(limit),
      count: pets.length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getPetById = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ msg: "Pet not found" });
    res.json({ msg: "Pet fetched successfully", data: pet });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePet = async (req, res) => {
  try {
    const pet = await Pet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!pet) return res.status(404).json({ msg: "Pet not found" });
    res.json({ msg: "Pet updated successfully", data: pet });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.deletePet = async (req, res) => {
  try {
    const pet = await Pet.findByIdAndDelete(req.params.id);
    if (!pet) return res.status(404).json({ msg: "Pet not found" });
    res.json({ msg: "Pet deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
