require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const Trip = require("./models/Trip");

const app = express();

connectDB();

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
}));
app.use(express.json()); 

app.get("/api/trips/share/:shareId", async (req, res) => {
  try {
    const trip = await Trip.findOne({
      shareId: req.params.shareId,
      isPublic: true,
    });
    if (!trip) {
      return res.status(404).json({ message: "Trip not found or not public" });
    }
    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.use("/api/auth",    require("./routes/auth"));
app.use("/api/trips",   require("./routes/trips"));
app.use("/api/plan",    require("./routes/plan"));
app.use("/api/profile", require("./routes/profile"));

app.get("/", (req, res) => {
  res.json({ status: "ok", service: "Travel Planner Backend" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});