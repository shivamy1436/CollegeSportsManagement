const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
    {
        sport: {
            type: String,
            required: true
        },

        team1: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team",
            required: true
        },

        team2: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team",
            required: true
        },

        date: {
            type: Date,
            required: true
        },

        venue: {
            type: String,
            required: true
        },

        status: {
            type: String,
            enum: ["scheduled", "ongoing", "completed", "cancelled"],
            default: "scheduled"
        },

        winner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team",
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Match", matchSchema);