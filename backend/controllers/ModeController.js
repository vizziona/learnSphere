const Mode = require("../models/Mode");

class ModeController {
  static async getAllModes(req, res) {
    try {
      const { experimentType } = req.query;
      const filter = experimentType ? { experimentType } : {};
      const modes = await Mode.find(filter);
      res.json(modes);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async createMode(req, res) {
    try {
      const mode = new Mode(req.body);
      await mode.save();
      res.status(201).json(mode);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  static async updateMode(req, res) {
    try {
      const mode = await Mode.findOneAndUpdate(
        { id: req.params.id },
        req.body,
        { new: true }
      );
      if (!mode) return res.status(404).json({ message: "Mode not found" });
      res.json(mode);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  static async deleteMode(req, res) {
    try {
      const mode = await Mode.findOneAndDelete({ id: req.params.id });
      if (!mode) return res.status(404).json({ message: "Mode not found" });
      res.json({ message: "Mode deleted" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = ModeController;
