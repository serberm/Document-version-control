const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/client/views');
app.use(express.static(__dirname + "/client/static"));

const server = app.listen(1337);
const io = require('socket.io')(server); 

require('./server/config/mongoose.js')();
require('./server/models/models.js')();
require('./server/config/routes.js')(app, io);

console.log('started server...');



