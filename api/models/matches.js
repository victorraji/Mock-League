const mongoose = require('mongoose');

const matchSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    home_team: {
        type: String,
        // ref: 'Team',
        required: true
    },
    away_team: {
        type: String,
        // ref: 'Team',
        required: true
    },
    home_score: {
        type: Number,
        // required: true,
        default:0
    },
    away_score: {
        type: Number,
        // required: true,
        default:0
    },
    schedule: {
        type: String,
        required: true
    },
    status:{
        type:String,
        default:'fixture'
    }
});
module.exports = mongoose.model('Match', matchSchema)