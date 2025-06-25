const express = require("express");
const router = express.Router();
const ExperimentController = require("../controllers/ExperimentController");
const authenticateJWT = require("../middleware/authenticateJWT");

router.get("/", ExperimentController.getAllExperiments);
router.post("/", authenticateJWT, ExperimentController.createExperiment);
router.put("/:id", authenticateJWT, ExperimentController.updateExperiment);
router.delete("/:id", authenticateJWT, ExperimentController.deleteExperiment);

module.exports = router;
