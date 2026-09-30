const express = require("express");

const {
    createTeam,
    getTeams,
    getTeamById,
    updateTeam,
    deleteTeam,
    addPlayerToTeam,
    getTeamMatches
} = require("../controllers/teamController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();


// Create team
router.post("/", protect, createTeam);


// Get all teams
router.get("/", protect, getTeams);


// Get single team
router.get("/:id", protect, getTeamById);


// Get team's fixtures and results
router.get("/:id/matches", protect, getTeamMatches);


// Add player to team
router.post("/:id/players", protect, addPlayerToTeam);


// Update team
router.put("/:id", protect, updateTeam);


// Delete team
router.delete("/:id", protect, deleteTeam);


module.exports = router;