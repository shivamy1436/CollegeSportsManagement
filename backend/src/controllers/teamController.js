const Team = require("../models/Team");
const Player = require("../models/Player");
const Match = require("../models/Match");

// GET ALL TEAMS
const getTeams = async (req, res) => {
    try {
        const teams = await Team.find()
            .populate("captain")
            .populate("players");

        res.status(200).json({
            count: teams.length,
            teams
        });

    } catch (error) {
        console.error("GET TEAMS ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch teams",
            error: error.message
        });
    }
};


// GET SINGLE TEAM
const getTeamById = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id)
            .populate("captain")
            .populate("players");

        if (!team) {
            return res.status(404).json({
                message: "Team not found"
            });
        }

        res.status(200).json(team);

    } catch (error) {
        console.error("GET TEAM ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch team",
            error: error.message
        });
    }
};


// CREATE TEAM
const createTeam = async (req, res) => {
    try {
        const {
            name,
            sport,
            captain
        } = req.body;

        if (!name || !sport) {
            return res.status(400).json({
                message: "Name and sport are required"
            });
        }

        if (captain) {
            const player = await Player.findById(captain);

            if (!player) {
                return res.status(404).json({
                    message: "Captain player not found"
                });
            }
        }

        const team = await Team.create({
            name,
            sport,
            captain: captain || null,
            players: captain ? [captain] : []
        });

        const populatedTeam = await Team.findById(team._id)
            .populate("captain")
            .populate("players");

        res.status(201).json({
            message: "Team created successfully",
            team: populatedTeam
        });

    } catch (error) {
        console.error("CREATE TEAM ERROR:", error);

        res.status(500).json({
            message: "Failed to create team",
            error: error.message
        });
    }
};


// UPDATE TEAM
const updateTeam = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);

        if (!team) {
            return res.status(404).json({
                message: "Team not found"
            });
        }

        const {
            name,
            sport,
            captain
        } = req.body;

        if (name) {
            team.name = name;
        }

        if (sport) {
            team.sport = sport;
        }

        if (captain) {
            const player = await Player.findById(captain);

            if (!player) {
                return res.status(404).json({
                    message: "Captain player not found"
                });
            }

            team.captain = captain;

            if (!team.players.some(
                (playerId) =>
                    playerId.toString() === captain.toString()
            )) {
                team.players.push(captain);
            }
        }

        await team.save();

        const updatedTeam = await Team.findById(team._id)
            .populate("captain")
            .populate("players");

        res.status(200).json({
            message: "Team updated successfully",
            team: updatedTeam
        });

    } catch (error) {
        console.error("UPDATE TEAM ERROR:", error);

        res.status(500).json({
            message: "Failed to update team",
            error: error.message
        });
    }
};


// DELETE TEAM
const deleteTeam = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);

        if (!team) {
            return res.status(404).json({
                message: "Team not found"
            });
        }

        await Team.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Team deleted successfully"
        });

    } catch (error) {
        console.error("DELETE TEAM ERROR:", error);

        res.status(500).json({
            message: "Failed to delete team",
            error: error.message
        });
    }
};


// ADD PLAYER TO TEAM
// POST /api/teams/:id/players
const addPlayerToTeam = async (req, res) => {
    try {
        const { id } = req.params;
        const { playerId } = req.body;

        if (!playerId) {
            return res.status(400).json({
                message: "playerId is required"
            });
        }

        const team = await Team.findById(id);

        if (!team) {
            return res.status(404).json({
                message: "Team not found"
            });
        }

        const player = await Player.findById(playerId);

        if (!player) {
            return res.status(404).json({
                message: "Player not found"
            });
        }

        // Check if player is already in this team
        if (
            team.players.some(
                (player) => player.toString() === playerId
            )
        ) {
            return res.status(400).json({
                message: "Player is already in this team"
            });
        }

        // Check if player is already in another team
        // of the same sport
        const existingTeam = await Team.findOne({
            sport: team.sport,
            players: playerId,
            _id: { $ne: id }
        });

        if (existingTeam) {
            return res.status(400).json({
                message: `Player is already part of another ${team.sport} team`,
                team: existingTeam.name
            });
        }

        team.players.push(playerId);

        await team.save();

        await team.populate("players");

        res.status(200).json({
            message: "Player added to team successfully",
            team
        });

    } catch (error) {
        console.error("ADD PLAYER ERROR:", error);

        res.status(500).json({
            message: "Failed to add player to team",
            error: error.message
        });
    }
};


// GET TEAM MATCHES
// GET /api/teams/:id/matches
const getTeamMatches = async (req, res) => {
    try {
        const { id } = req.params;

        const team = await Team.findById(id);

        if (!team) {
            return res.status(404).json({
                message: "Team not found"
            });
        }

        const matches = await Match.find({
            $or: [
                { team1: id },
                { team2: id }
            ]
        })
            .populate("team1")
            .populate("team2")
            .populate("winner")
            .sort({ date: 1 });

        res.status(200).json({
            team: team.name,
            count: matches.length,
            matches
        });

    } catch (error) {
        console.error("GET TEAM MATCHES ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch team matches",
            error: error.message
        });
    }
};


module.exports = {
    getTeams,
    getTeamById,
    createTeam,
    updateTeam,
    deleteTeam,
    addPlayerToTeam,
    getTeamMatches
};