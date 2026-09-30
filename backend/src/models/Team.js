const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        sport: {
            type: String,
            required: true
        },

        captain: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Player"
        },

        players: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Player"
            }
        ]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Team", teamSchema);