const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const User = require('../models/users')

router.get('/', (req, res, next) => {
    User.find()
        .select('first_name last_name email password _id')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                users: docs.map(doc => {
                    return {
                        first_name: doc.first_name,
                        last_name: doc.last_name,
                        email: doc.email,
                        password: doc.password,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/users/' + doc._id
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
});

router.post('/signup', (req, res, next) => {
    User.find({
            email: req.body.email
        })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: 'This email already exist'
                })
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: mongoose.Types.ObjectId(),
                            first_name: req.body.first_name,
                            last_name: req.body.last_name,
                            email: req.body.email,
                            password: hash
                        });
                        user.save().then(result => {
                                console.log(result)
                                res.status(201).json({
                                    message: ' Admin User created successfully',
                                    createdUser: {
                                        first_name: result.first_name,
                                        last_name: result.last_name,
                                        _id: result._id,
                                        email: result.email,
                                        password: result.password
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
                });

            }
        })


});

router.post('/login', (req, res, next) => {
    User.find({
            email: req.body.email
        })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: "Mail not found,user doesn\'t Exist"
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: "Auth Failed"
                    });
                }
                if (result) {
                    const token = jwt.sign({
                            email: user[0].email,
                            userId: user[0]._id
                        },
                        process.env.JWT_KEY,

                        {
                            expiresIn: "1hr"

                        },
                    )
                    return res.status(200).json({
                        message: "Auth Successful, Logged in Admin user",
                        token:token,
                        first_name: user[0].first_name,
                        last_name:user[0].last_name
                    });
                }
                res.status(401).json({
                    message: 'Auth Failed'
                })
            })

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

})
router.get('/:userId', (req, res, next) => {
    const id = req.params.userId;
    User.findById(id)
        .exec()
        .then(doc => {
            console.log('From database' + doc);
            if (doc) {
                res.status(200).json(doc);

            } else {
                res.status(404).json({
                    messsage: 'an invalid entry found for id'
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
})



router.delete('/:userId', (req, res, next) => {
    const id = req.params.userId;
    User.remove({
            _id: id
        })
        .exec()
        .then(result => {
            console.log('From database' + result);
            res.status(200).json({
                message: "User deleted Successfully",
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
})

// router.patch('/:teamId', (req, res, next) => {
//     const id = req.params.teamId;
//     const updateOps = {};
//     for (const ops of req.body) {
//         updateOps[ops.propName] = ops.value;
//     }
//     Team.update({
//             _id: id
//         }, {
//             $set:
//                 // name: req.body.newName,
//                 // name: req.body.newManager
//                 updateOps
//         })
//         .exec()
//         .then(result => {
//             // console.log('From database' + result);
//             res.status(200).json({
//                 message: "Team Updated Successfully",
//                 createdTeam: {
//                     updateOps
//                 }
//             });

//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({
//                 error: err
//             });
//         });

// });

module.exports = router;