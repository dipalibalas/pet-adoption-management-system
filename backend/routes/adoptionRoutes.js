const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const ctrl = require("../controllers/adoptionController");

router.post("/:petId", auth, ctrl.applyAdoption);
router.get("/my", auth, ctrl.getMyApplications);
router.get("/", auth, role("admin"), ctrl.getAllApplications);
router.put("/:id", auth, role("admin"), ctrl.updateStatus);

module.exports = router;
