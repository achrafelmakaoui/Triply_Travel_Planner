const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const tripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    request: {
      type: String,
      required: true,
    },
    result: {
      destinationInfo: String,
      budgetBreakdown: String,
      itinerary: String,
      bookingSummary: String,
      bookingApproved: Boolean,
    },
    threadId: String, // LangGraph thread ID
    status: {
      type: String,
      enum: ["draft", "completed"],
      default: "completed",
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    shareId: {
      type: String,
      default: () => uuidv4(),
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trip", tripSchema);