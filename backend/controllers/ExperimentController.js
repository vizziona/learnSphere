const Experiment = require('../models/Experiment');

class ExperimentController {
  static async getAllExperiments(req, res) {
    try {
      const { category } = req.query;
      const filter = category ? { category } : {};
      const experiments = await Experiment.find(filter);
      res.json(experiments);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async createExperiment(req, res) {
    try {
      const experiment = new Experiment(req.body);
      await experiment.save();
      res.status(201).json(experiment);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  static async updateExperiment(req, res) {
    try {
      const experiment = await Experiment.findOneAndUpdate(
        { id: req.params.id },
        req.body,
        { new: true }
      );
      if (!experiment) return res.status(404).json({ message: 'Experiment not found' });
      res.json(experiment);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  static async deleteExperiment(req, res) {
    try {
      const experiment = await Experiment.findOneAndDelete({ id: req.params.id });
      if (!experiment) return res.status(404).json({ message: 'Experiment not found' });
      res.json({ message: 'Experiment deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = ExperimentController;