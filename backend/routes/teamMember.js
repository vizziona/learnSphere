const express = require("express");
const router = express.Router();
const TeamMemberController = require("../controllers/TeamMemberController");
const authenticateJWT = require("../middleware/authenticateJWT");

router.get("/", TeamMemberController.getAllTeamMembers);
router.post("/", authenticateJWT, TeamMemberController.createTeamMember);
router.put("/:id", authenticateJWT, TeamMemberController.updateTeamMember);
router.delete("/:id", authenticateJWT, TeamMemberController.deleteTeamMember);

module.exports = router;
