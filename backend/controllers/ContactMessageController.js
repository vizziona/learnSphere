const ContactMessage = require("../models/ContactMessage");

class ContactMessageController {
  static async getAllMessages(req, res) {
    try {
      const messages = await ContactMessage.find();
      res.json(messages);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async createMessage(req, res) {
    try {
      const contactMessage = new ContactMessage(req.body);
      await contactMessage.save();
      res.status(201).json(contactMessage);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
}

module.exports = ContactMessageController;
