const express = require("express");

const {
    createMatch,
    getMatches,
    getMatchById,
    updateMatch,
    recordMatchResult,
    deleteMatch
} = require("../controllers/matchController");

const { protect } = require("../middleware/authMiddleware");
const { coordinatorOnly } = require("../middleware/coordinatorMiddleware");

const router = express.Router();

// Coordinator only - Create Match
router.post("/", protect, coordinatorOnly, createMatch);

// Logged-in users - View Matches
router.get("/", protect, getMatches);

// Logged-in users - View Single Match
router.get("/:id", protect, getMatchById);

// Coordinator only - Record Result
router.patch("/:id/result", protect, coordinatorOnly, recordMatchResult);

// Coordinator only - Update Match
router.put("/:id", protect, coordinatorOnly, updateMatch);

// Coordinator only - Delete Match
router.delete("/:id", protect, coordinatorOnly, deleteMatch);

module.exports = router;