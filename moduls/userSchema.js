const mongoose = require("mongoose");

//----------------- DataBase mongoose Schema------------//
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  phone: {
    type: Number,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
