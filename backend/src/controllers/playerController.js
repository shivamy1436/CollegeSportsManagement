const Player = require("../models/Player");

// ===============================
// GET ALL PLAYERS
// ===============================
const getPlayers = async (req, res) => {
    try {
        const players = await Player.find();

        res.status(200).json({
            count: players.length,
            players
        });

    } catch (error) {
        console.error("GET PLAYERS ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch players",
            error: error.message
        });
    }
};


// ===============================
// GET SINGLE PLAYER
// ===============================
const getPlayerById = async (req, res) => {
    try {
        const player = await Player.findById(req.params.id);

        if (!player) {
            return res.status(404).json({
                message: "Player not found"
            });
        }

        res.status(200).json({
            player
        });

    } catch (error) {
        console.error("GET PLAYER ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch player",
            error: error.message
        });
    }
};


// ===============================
// CREATE PLAYER
// ===============================
const createPlayer = async (req, res) => {
    try {
        const {
            name,
            studentId,
            email,
            department,
            year
        } = req.body;

        const player = await Player.create({
            name,
            studentId,
            email,
            department,
            year
        });

        res.status(201).json({
            message: "Player created successfully",
            player
        });

    } catch (error) {
        console.error("CREATE PLAYER ERROR:", error);

        res.status(500).json({
            message: "Failed to create player",
            error: error.message
        });
    }
};


// ===============================
// UPDATE PLAYER
// ===============================
const updatePlayer = async (req, res) => {
    try {
        const player = await Player.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!player) {
            return res.status(404).json({
                message: "Player not found"
            });
        }

        res.status(200).json({
            message: "Player updated successfully",
            player
        });

    } catch (error) {
        console.error("UPDATE PLAYER ERROR:", error);

        res.status(500).json({
            message: "Failed to update player",
            error: error.message
        });
    }
};


// ===============================
// DELETE PLAYER
// ===============================
const deletePlayer = async (req, res) => {
    try {
        const player = await Player.findByIdAndDelete(req.params.id);

        if (!player) {
            return res.status(404).json({
                message: "Player not found"
            });
        }

        res.status(200).json({
            message: "Player deleted successfully",
            player
        });

    } catch (error) {
        console.error("DELETE PLAYER ERROR:", error);

        res.status(500).json({
            message: "Failed to delete player",
            error: error.message
        });
    }
};


// ===============================
// EXPORT ALL CONTROLLERS
// ===============================
module.exports = {
    getPlayers,
    getPlayerById,
    createPlayer,
    updatePlayer,
    deletePlayer
};