const express = require("express");
const axios = require("axios");
const { protect } = require("../middleware/protect");

const router = express.Router();
const AI_API_URL = process.env.AI_API_URL || "http://localhost:8000";

router.post("/stream", protect, async (req, res) => {
    const { user_request, thread_id } = req.body;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();

    try {
        const aiResponse = await axios({
            method: "post",
            url: `${AI_API_URL}/api/plan/stream`,
            data: { user_request, thread_id },
            responseType: "stream",
            timeout: 120000,
        });

        aiResponse.data.on("data", (chunk) => {
            res.write(chunk);
        });
        aiResponse.data.on("end", () => {
            res.end();
        });
        aiResponse.data.on("error", (err) => {
            res.write(`data: ${JSON.stringify({ type: "error", message: err.message })}\n\n`);
            res.end();
        });

    } 
    catch (error) {
        res.write(`data: ${JSON.stringify({ type: "error", message: error.message })}\n\n`);
        res.end();
    }
});

router.post("/resume", protect, async (req, res) => {
    try {
        const { thread_id, decision } = req.body;

        const response = await axios.post(`${AI_API_URL}/api/plan/resume`, {
            thread_id,
            decision,
        });

        res.json(response.data);
    } 
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;