const Match = require("../models/Match");
const Team = require("../models/Team");

// CREATE MATCH
const createMatch = async (req, res) => {
    try {
        const {
            sport,
            team1,
            team2,
            date,
            venue,
            status
        } = req.body;

        // Required fields check
        if (!sport || !team1 || !team2 || !date || !venue) {
            return res.status(400).json({
                message: "sport, team1, team2, date and venue are required"
            });
        }

        // Same team check
        if (team1 === team2) {
            return res.status(400).json({
                message: "Team 1 and Team 2 must be different"
            });
        }

        // Find Team 1
        const firstTeam = await Team.findById(team1);

        if (!firstTeam) {
            return res.status(404).json({
                message: "Team 1 not found"
            });
        }

        // Find Team 2
        const secondTeam = await Team.findById(team2);

        if (!secondTeam) {
            return res.status(404).json({
                message: "Team 2 not found"
            });
        }

        // Both teams must have same sport
        if (
            firstTeam.sport.toLowerCase() !==
            secondTeam.sport.toLowerCase()
        ) {
            return res.status(400).json({
                message: "Both teams must belong to the same sport"
            });
        }

        // Match sport must match team sport
        if (
            sport.toLowerCase() !==
            firstTeam.sport.toLowerCase()
        ) {
            return res.status(400).json({
                message: "Match sport must match the teams' sport"
            });
        }

        // Create match
        const match = await Match.create({
            sport,
            team1,
            team2,
            date,
            venue,
            status: status || "scheduled"
        });

        // Populate teams
        const populatedMatch = await Match.findById(match._id)
            .populate("team1")
            .populate("team2")
            .populate("winner");

        res.status(201).json({
            message: "Match created successfully",
            match: populatedMatch
        });

    } catch (error) {
        console.error("CREATE MATCH ERROR:", error);

        res.status(500).json({
            message: "Failed to create match",
            error: error.message
        });
    }
};

// GET ALL MATCHES
const getMatches = async (req, res) => {
    try {
        const matches = await Match.find()
            .populate("team1")
            .populate("team2")
            .populate("winner")
            .sort({ date: 1 });

        res.status(200).json({
            count: matches.length,
            matches
        });

    } catch (error) {
        console.error("GET MATCHES ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch matches",
            error: error.message
        });
    }
};

// GET SINGLE MATCH
const getMatchById = async (req, res) => {
    try {
        const match = await Match.findById(req.params.id)
            .populate("team1")
            .populate("team2")
            .populate("winner");

        if (!match) {
            return res.status(404).json({
                message: "Match not found"
            });
        }

        res.status(200).json(match);

    } catch (error) {
        console.error("GET MATCH ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch match",
            error: error.message
        });
    }
};

// UPDATE MATCH
const updateMatch = async (req, res) => {
    try {
        const match = await Match.findById(req.params.id);

        if (!match) {
            return res.status(404).json({
                message: "Match not found"
            });
        }

        const {
            sport,
            team1,
            team2,
            date,
            venue,
            status
        } = req.body;

        const newTeam1 = team1 || match.team1;
        const newTeam2 = team2 || match.team2;

        // Same team check
        if (
            newTeam1.toString() ===
            newTeam2.toString()
        ) {
            return res.status(400).json({
                message: "Team 1 and Team 2 must be different"
            });
        }

        // Find teams
        const firstTeam = await Team.findById(newTeam1);
        const secondTeam = await Team.findById(newTeam2);

        if (!firstTeam || !secondTeam) {
            return res.status(404).json({
                message: "One or both teams not found"
            });
        }

        // Same sport check
        if (
            firstTeam.sport.toLowerCase() !==
            secondTeam.sport.toLowerCase()
        ) {
            return res.status(400).json({
                message: "Both teams must belong to the same sport"
            });
        }

        // Sport validation
        if (sport) {
            if (
                sport.toLowerCase() !==
                firstTeam.sport.toLowerCase()
            ) {
                return res.status(400).json({
                    message: "Match sport must match the teams' sport"
                });
            }

            match.sport = sport;
        }

        if (team1) {
            match.team1 = team1;
        }

        if (team2) {
            match.team2 = team2;
        }

        if (date) {
            match.date = date;
        }

        if (venue) {
            match.venue = venue;
        }

        if (status) {
            match.status = status;
        }

        await match.save();

        const updatedMatch = await Match.findById(match._id)
            .populate("team1")
            .populate("team2")
            .populate("winner");

        res.status(200).json({
            message: "Match updated successfully",
            match: updatedMatch
        });

    } catch (error) {
        console.error("UPDATE MATCH ERROR:", error);

        res.status(500).json({
            message: "Failed to update match",
            error: error.message
        });
    }
};

// RECORD MATCH RESULT
const recordMatchResult = async (req, res) => {
    try {
        const { winner } = req.body;

        // Winner required
        if (!winner) {
            return res.status(400).json({
                message: "Winner team ID is required"
            });
        }

        // Find match
        const match = await Match.findById(req.params.id);

        if (!match) {
            return res.status(404).json({
                message: "Match not found"
            });
        }

        // Winner must be one of the playing teams
        if (
            winner !== match.team1.toString() &&
            winner !== match.team2.toString()
        ) {
            return res.status(400).json({
                message:
                    "Winner must be one of the teams playing this match"
            });
        }

        // Save result
        match.winner = winner;
        match.status = "completed";

        await match.save();

        // Populate response
        const updatedMatch = await Match.findById(match._id)
            .populate("team1")
            .populate("team2")
            .populate("winner");

        res.status(200).json({
            message: "Match result recorded successfully",
            match: updatedMatch
        });

    } catch (error) {
        console.error("RESULT ERROR:", error);

        res.status(500).json({
            message: "Failed to record match result",
            error: error.message
        });
    }
};

// DELETE MATCH
const deleteMatch = async (req, res) => {
    try {
        const match = await Match.findById(req.params.id);

        if (!match) {
            return res.status(404).json({
                message: "Match not found"
            });
        }

        await Match.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Match deleted successfully"
        });

    } catch (error) {
        console.error("DELETE MATCH ERROR:", error);

        res.status(500).json({
            message: "Failed to delete match",
            error: error.message
        });
    }
};

module.exports = {
    createMatch,
    getMatches,
    getMatchById,
    updateMatch,
    recordMatchResult,
    deleteMatch
};