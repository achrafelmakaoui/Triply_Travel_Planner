require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

connectDB();

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
}));
app.use(express.json()); 

app.get("/", (req, res) => {
  res.json({ status: "ok", service: "Travel Planner Backend" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});