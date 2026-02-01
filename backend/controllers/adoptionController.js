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

    const adoption = await Adoption.create({ 
      user: userId, 
      pet: pet._id, 
      status: "pending" 
    });

    // Update pet status to pending to prevent multiple applications
    await Pet.findByIdAndUpdate(pet._id, { status: "pending" });

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
    const { page = 1, limit = 8, search, status } = req.query;
    const skip = (page - 1) * limit;

    // Build query
    const query = { user: userId };
    if (status) query.status = status;

    // Build search filter for pet name or breed
    let searchFilter = {};
    if (search) {
      searchFilter = {
        $or: [
          { 'pet.name': { $regex: search, $options: 'i' } },
          { 'pet.breed': { $regex: search, $options: 'i' } }
        ]
      };
    }

    const apps = await Adoption.find({ ...query, ...searchFilter })
      .populate("pet")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Adoption.countDocuments({ ...query, ...searchFilter });

    res.json({
      msg: "Your adoption applications fetched successfully",
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: apps.map(app => {
        const { _id: id, status, createdAt: appliedAt, pet } = app;
        const { _id: petId, name, species, breed, age, color, description, image, status: petStatus } = pet;

        return {
          _id: petId, // Use pet ID as the main ID for frontend
          name,
          species,
          breed,
          age,
          color,
          description,
          photo: image, // Map image to photo for frontend consistency
          status, // Use adoption status (pending/approved/rejected)
          petStatus, // Keep pet status for reference
          appliedAt,
          adoptionId: id // Keep adoption application ID
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
    const { page = 1, limit = 8, search, status } = req.query;
    const skip = (page - 1) * limit;

    // Build query
    const query = {};
    if (status) query.status = status;

    const apps = await Adoption.find(query)
      .populate("pet user")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Filter applications after populating (for search)
    let filteredApps = apps;
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filteredApps = apps.filter(app => 
        (app.pet && app.pet.name && app.pet.name.match(searchRegex)) ||
        (app.user && app.user.email && app.user.email.match(searchRegex))
      );
    }

    const total = await Adoption.countDocuments(query);

    res.json({
      msg: "All adoption applications fetched successfully",
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: filteredApps.map(app => {
        const { _id: id, status, createdAt: appliedAt, pet, user } = app;
        const { _id: petId, name: petName, species, breed, status: petStatus } = pet || {};
        const { _id: userId, name: userName, email } = user || {};

        return {
          _id: id,
          user: { id: userId, name: userName, email },
          pet: { id: petId, name: petName, species, breed, status: petStatus },
          status,
          appliedAt
        };
      })
    });
  } catch (err) {
    console.error("Error in getAllApplications:", err);
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
    } else if (status === "rejected") {
      await Pet.findByIdAndUpdate(adoption.pet, { status: "available" });
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
