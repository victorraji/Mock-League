




// module.exports= (req, res, next) {

// const page = parseInt(req.query.page)
//     const limit = parseInt(req.query.limit)

//     const startIndex = (page - 1) * limit
//     const endIndex = page * limit

//     const pagination = {};
//     if (endIndex < docs.length) {
//         pagination.next = {
//             page: page + 1,
//             limit: limit
//         }
//     }
//     if (startIndex > 0) {
//         pagination.previous = {
//             page: page - 1,
//             limit: limit
//         }
//     }
//     teams = docs.slice(startIndex, endIndex)

// }