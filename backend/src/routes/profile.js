const express = require("express");
const User = require("../models/User");
const { protect } = require("../middleware/protect");

const router = express.Router();
router.use(protect);

router.get("/", async (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    createdAt: req.user.createdAt,
  });
});

router.patch("/", async (req, res) => {
  try {
    const { name } = req.body;
    const updates = {};
    if (name) updates.name = name;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;