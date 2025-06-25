const express = require("express");
const router = express.Router();
const ContactMessageController = require("../controllers/ContactMessageController");
const authenticateJWT = require("../middleware/authenticateJWT");

router.get("/", authenticateJWT, ContactMessageController.getAllMessages);
router.post("/", ContactMessageController.createMessage);

module.exports = router;
