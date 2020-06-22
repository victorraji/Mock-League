const http = require('http');
const app = require('./app');


if(process.env.NODE_ENV === 'production'){
    app.use(express.static(__dirname+'/public/'))
    app.get(/.*/, (req,res) => res.sendFile(__dirname+ '/public/index.html'));
}

const port = process.env.PORT || 3000;
const server = http.createServer(app);
server.listen(port);

// app.use(bodyParser.urlencoded({
//     extended: true
// }))