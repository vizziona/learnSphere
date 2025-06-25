const express = require("express");
const router = express.Router();
const TopicController = require("../controllers/TopicController");
const authenticateJWT = require("../middleware/authenticateJWT");

router.get("/", TopicController.getAllTopics);
router.post("/", authenticateJWT, TopicController.createTopic);
router.put("/:id", authenticateJWT, TopicController.updateTopic);
router.delete("/:id", authenticateJWT, TopicController.deleteTopic);

module.exports = router;
