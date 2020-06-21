// const User = require('../models/users')
// exports.get_all_users=(req, res, next) => {
//     User.find()
//         .select('first_name last_name email password _id')
//         .exec()
//         .then(docs => {
//             const response = {
//                 count: docs.length,
//                 users: docs.map(doc => {
//                     return {
//                         first_name: doc.first_name,
//                         last_name: doc.last_name,
//                         email: doc.email,
//                         password: doc.password,
//                         _id: doc._id,
//                         request: {
//                             type: 'GET',
//                             url: 'http://localhost:3000/users/' + doc._id
//                         }
//                     }
//                 })
//             }
//             // console.log('From database' + docs);
//             res.status(200).json(response);

//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({
//                 error: err
//             });
//         });
// }