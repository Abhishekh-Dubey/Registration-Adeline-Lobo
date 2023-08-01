const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
router.get("/", (req, res) => {
  res.send("hello ,Wellcome to router home page");
});

require("../db/MongoConnet");
const User = require("../moduls/userSchema");
//--------------------------register-------async await------------//
router.post("/register", async (req, res) => {
  const { name, phone, city, state } = req.body;

  if (!name || !phone || !city || !state) {
    return res
      .status(422)
      .json({ error: "pls fill the field properly", status: 422 });
  } else {
    try {
      const user = new User({
        name,
        phone,
        city,
        state,
      });

      const userRegister = await user.save();
      if (userRegister) {
        res
          .status(201)
          .json({ message: "User Registered Successfuly", status: 201 });
      }
    } catch (err) {
      console.log(err);
    }
  }
});

router.get("/getdata", async (req, res) => {
  try {
    const alldata = await User.find({});
    res.json({ status: 201, data: alldata });
  } catch (error) {
    console.log(error);
  }
});

router.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Convert the id to ObjectId format
    const objectIdId = new ObjectId(id);
    console.log(objectIdId);
    // Find the document by ID and remove it
    const deletedData = await User.findOneAndDelete({ _id: objectIdId });

    if (!deletedData) {
      // If the data with the specified ID is not found
      return res.status(404).json({ error: "Data not found" });
    }

    res.json({ message: "Data deleted successfully" });
  } catch (error) {
    console.error("Error deleting data:", error);
    res.status(500).json({ error: "Failed to delete data" });
  }
});

// Your other routes and server configurations

module.exports = router;
