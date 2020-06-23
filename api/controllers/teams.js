const Team = require('../models/teams')
const mongoose = require('mongoose');


exports.teams_get_all = (req, res, next) => {
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)

    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    Team.find()
        .select('name manager _id')
        .exec()
        .then(docs => {
            const pagination = {};
            if (endIndex < docs.length) {
                pagination.next = {
                    page: page + 1,
                    limit: limit
                }
            }
            if (startIndex > 0) {
                pagination.previous = {
                    page: page - 1,
                    limit: limit
                }
            }
            teams = docs.slice(startIndex, endIndex)
            const response = {
                pagination: pagination,
                count: docs.length,
                teams: teams.map(doc => {
                    return {
                        name: doc.name,
                        manager: doc.manager,
                        _id: doc._id,
                    }
                })
            }
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.teams_create = (req, res, next) => {
    Team.find({
            name: req.body.name
        })
        .exec()
        .then(team => {
            if (team.length >= 1) {
                return res.status(409).json({
                    message: 'This Team name already exist'
                })
            } else {
                const team = new Team({
                    _id: mongoose.Types.ObjectId(),
                    name: req.body.name,
                    manager: req.body.manager
                });
                team.save().then(result => {
                        console.log(result)
                        res.status(201).json({
                            message: 'Team created successfully',
                            createdTeam: {
                                name: result.name,
                                manager: result.manager,
                                _id: result._id,
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
        })
}

exports.get_team = (req, res, next) => {
    const id = req.params.teamId;
    Team.findById(id)
        .exec()
        .then(doc => {
            console.log('From database' + doc);
            if (doc) {
                res.status(200).json(doc);

            } else {
                res.status(404).json({
                    messsage: 'n ovalid entry found for id'
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

exports.delete_team = (req, res, next) => {
    const id = req.params.teamId;
    Team.remove({
            _id: id
        })
        .exec()
        .then(result => {
            console.log('From database' + result);
            res.status(200).json({
                message: "Team deleted Successfully",

            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}
exports.update_team = (req, res, next) => {
    const id = req.params.teamId;
    // const updateOps = {};
    // for (const ops of req.body) {
    //     updateOps[ops.propName] = ops.value;
    // }

    Team.update({
            _id: id
        }, {
            $set: {
                // name: req.body.newName,
                name: req.body.name,
                manager: req.body.manager
            }
        })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Team Updated Successfully",
                createdTeam: {
                    result
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