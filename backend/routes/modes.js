const express = require("express");
const router = express.Router();
const ModeController = require("../controllers/ModeController");
const authenticateJWT = require("../middleware/authenticateJWT");

router.get("/", ModeController.getAllModes);
router.post("/", authenticateJWT, ModeController.createMode);
router.put("/:id", authenticateJWT, ModeController.updateMode);
router.delete("/:id", authenticateJWT, ModeController.deleteMode);

module.exports = router;
