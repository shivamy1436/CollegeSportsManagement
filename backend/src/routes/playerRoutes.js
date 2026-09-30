const express = require("express");

const {
    createPlayer,
    getPlayers,
    getPlayerById,
    updatePlayer,
    deletePlayer
} = require("../controllers/playerController");

const {
    protect
} = require("../middleware/authMiddleware");

const router = express.Router();

// CREATE
router.post("/", protect, createPlayer);

// READ ALL
router.get("/", protect, getPlayers);

// READ ONE
router.get("/:id", protect, getPlayerById);

// UPDATE
router.put("/:id", protect, updatePlayer);

// DELETE
router.delete("/:id", protect, deletePlayer);

module.exports = router;