const Topic = require("../models/Topic");

class TopicController {
  static async getAllTopics(req, res) {
    try {
      const topics = await Topic.find();
      res.json(topics);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async createTopic(req, res) {
    try {
      const topic = new Topic(req.body);
      await topic.save();
      res.status(201).json(topic);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  static async updateTopic(req, res) {
    try {
      const topic = await Topic.findOneAndUpdate(
        { id: req.params.id },
        req.body,
        { new: true }
      );
      if (!topic) return res.status(404).json({ message: "Topic not found" });
      res.json(topic);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  static async deleteTopic(req, res) {
    try {
      const topic = await Topic.findOneAndDelete({ id: req.params.id });
      if (!topic) return res.status(404).json({ message: "Topic not found" });
      res.json({ message: "Topic deleted" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = TopicController;
