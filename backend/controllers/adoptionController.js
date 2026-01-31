const Adoption = require("../models/Adoption");
const Pet = require("../models/Pet");

// Apply for adoption
exports.applyAdoption = async (req, res) => {
  try {
    const { petId } = req.params;
    const { userId } = req.user;

    const pet = await Pet.findById(petId);
    if (!pet) return res.status(404).json({ msg: "Pet not found" });
    if (pet.status !== "available")
      return res.status(400).json({ msg: "Pet not available" });

    const exists = await Adoption.findOne({ user: userId, pet: pet._id });
    if (exists) return res.status(400).json({ msg: "Already applied" });

    const adoption = await Adoption.create({ user: userId, pet: pet._id });

    res.status(201).json({
      msg: "Adoption application submitted successfully",
      data: adoption
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get my adoption applications
exports.getMyApplications = async (req, res) => {
  try {
    const { userId } = req.user;

    const apps = await Adoption.find({ user: userId }).populate("pet");

    res.json({
      msg: "Your adoption applications fetched successfully",
      count: apps.length,
      data: apps.map(app => {
        const { _id: id, status, createdAt: appliedAt, pet } = app;
        const { _id: petId, name, species, breed, status: petStatus } = pet;

        return {
          id,
          pet: { id: petId, name, species, breed, status: petStatus },
          status,
          appliedAt
        };
      })
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all adoption applications (Admin)
exports.getAllApplications = async (req, res) => {
  try {
    const apps = await Adoption.find().populate("pet user");

    res.json({
      msg: "All adoption applications fetched successfully",
      count: apps.length,
      data: apps.map(app => {
        const { _id: id, status, createdAt: appliedAt, pet, user } = app;
        const { _id: petId, name: petName, species, breed, status: petStatus } = pet;
        const { _id: userId, name: userName, email } = user;

        return {
          id,
          user: { id: userId, name: userName, email },
          pet: { id: petId, name: petName, species, breed, status: petStatus },
          status,
          appliedAt
        };
      })
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update adoption status (Admin)
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const adoption = await Adoption.findById(id);
    if (!adoption) return res.status(404).json({ msg: "Application not found" });

    adoption.status = status;
    await adoption.save();

    if (status === "approved") {
      await Pet.findByIdAndUpdate(adoption.pet, { status: "adopted" });
    }

    const updatedAdoption = await Adoption.findById(id).populate("pet user");
    const { _id: adoptionId, pet, user, createdAt: appliedAt } = updatedAdoption;
    const { _id: petId, name: petName, species, breed, status: petStatus } = pet;
    const { _id: userId, name: userName, email } = user;

    res.json({
      msg: "Adoption status updated successfully",
      data: {
        id: adoptionId,
        user: { id: userId, name: userName, email },
        pet: { id: petId, name: petName, species, breed, status: petStatus },
        status,
        appliedAt
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
