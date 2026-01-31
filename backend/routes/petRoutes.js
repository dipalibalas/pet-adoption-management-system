const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const ctrl = require("../controllers/petController");

router.post("/", auth, role("admin"), ctrl.createPet);
router.get("/", ctrl.getPets);
router.get("/:id", ctrl.getPetById);
router.put("/:id", auth, role("admin"), ctrl.updatePet);
router.delete("/:id", auth, role("admin"), ctrl.deletePet);

module.exports = router;
