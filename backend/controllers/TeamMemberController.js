const TeamMember = require("../models/TeamMember");

class TeamMemberController {
  static async getAllTeamMembers(req, res) {
    try {
      const teamMembers = await TeamMember.find();
      res.json(teamMembers);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async createTeamMember(req, res) {
    try {
      const teamMember = new TeamMember(req.body);
      await teamMember.save();
      res.status(201).json(teamMember);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  static async updateTeamMember(req, res) {
    try {
      const teamMember = await TeamMember.findOneAndUpdate(
        { id: req.params.id },
        req.body,
        { new: true }
      );
      if (!teamMember)
        return res.status(404).json({ message: "Team member not found" });
      res.json(teamMember);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  static async deleteTeamMember(req, res) {
    try {
      const teamMember = await TeamMember.findOneAndDelete({
        id: req.params.id,
      });
      if (!teamMember)
        return res.status(404).json({ message: "Team member not found" });
      res.json({ message: "Team member deleted" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = TeamMemberController;
