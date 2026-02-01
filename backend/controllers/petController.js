const Pet = require("../models/Pet");
const multer = require("multer");
const path = require("path");

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

exports.createPet = async (req, res) => {
  try {
    const petData = { ...req.body };
    
    // Add image path if file was uploaded
    if (req.file) {
      petData.image = `/uploads/${req.file.filename}`;
    }
    
    const pet = await Pet.create(petData);
    res.status(201).json({ msg: "Pet added successfully", data: pet });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPets = async (req, res) => {
  try {
    const { species, breed, search, page = 1, limit = 6, status = "available", age } = req.query;
    const filter = {};
    if (species) filter.species = species;
    if (breed) filter.breed = breed;
    if (search) filter.name = { $regex: search, $options: "i" };
    if (status) filter.status = status;
    if (age) filter.age = age;

    // Total items count
    const total = await Pet.countDocuments(filter);

    // Paginated data
    const pets = await Pet.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      msg: "Pets fetched successfully",
      data: pets,
      page: Number(page),
      limit: Number(limit),
      total, // total items matching the filter
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
    const petData = { ...req.body };
    
    // Add image path if file was uploaded
    if (req.file) {
      petData.image = `/uploads/${req.file.filename}`;
    }
    
    const pet = await Pet.findByIdAndUpdate(req.params.id, petData, {
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

// Export the upload middleware for use in routes
exports.upload = upload;
