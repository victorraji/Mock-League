
const Match = require('../models/matches')  
const Team = require('../models/teams')
const mongoose = require('mongoose');


exports.get_all_matches= (req, res, next) => {
    Match.find()
        .select('home_team away_team home_score away_score schedule _id')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                match: docs.map(doc => {
                    return {
                        home_team: doc.home_team,
                        away_team: doc.away_team,
                        home_score: doc.home_score,
                        away_score: doc.away_score,
                        schedule: doc.schedule,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            message:'click to see available matches',
                            url: 'http://localhost:3000/matches/' + doc._id
                        }
                    }
                })
            }
            // console.log('From database' + docs);
            res.status(200).json(response);

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}
exports.create_match = (req, res, next) => {

    Team.findById(req.body.home_team)

    const match = new Match({
        _id: mongoose.Types.ObjectId(),
        home_team: req.body.home_team,
        away_team: req.body.away_team,
        schedule: req.body.schedule
    });
    match.save().then(result => {
            console.log(result)
            res.status(201).json({
                message: `match sucessfully created : ${result.home_team} vs ${result.away_team}  by ${result.schedule}`,
                createdMatch: {
                    home_team: result.home_team,
                    home_score: result.home_score,
                    _id: result._id,
                    away_team: result.away_team,
                    away_score: result.away_score,
                    schedule: result.schedule
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}
exports.get_match = (req, res, next) => {
    const id = req.params.matchId;
    Match.findById(id)
        .exec()
        .then(doc => {
            console.log('From database' + doc);
            if (doc) {
                res.status(200).json(doc);

            } else {
                res.status(404).json({
                    messsage: 'invalid entry found for match ID'
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}
exports.delete_match =(req, res, next) => {
    const id = req.params.matchId;
    Match.remove({
            _id: id
        })
        .exec()
        .then(result => {
            console.log('From database' + result);
            res.status(200).json({
                message: "Match deleted Successfully",
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/matches/'
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}
exports.update_match= (req, res, next) => {
    const id = req.params.matchId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Match.update({
            _id: id
        }, {
            $set:
                updateOps
        })
        .exec()
        .then(result => {
            console.log('From database' + result);
            res.status(200).json({
                message: "Match results were Updated Successfully",
                updatedMatchResults: {
                    updateOps
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/matches/'
                }
            });

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

}