const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const teamMemberSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    university: { type: String, required: true },
    role: { type: String, required: true },
    email: { type: String, required: true },
    linkedin: { type: String },
    github: { type: String },
    bio: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TeamMember", teamMemberSchema);
