// Call extensions
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

// Call database and models
const sequelize = require('./config/db');
const initDataDB = require('./config/initDataDB');
const Conversation = require('./models/conversation');

const app = express();

// Call Controller
const errorController = require('./controllers/error');

// Call routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');

// Config and use extensions
// app.use(bodyParser.urlencoded({ extended: false })); //x-www-form-urlencoded api
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); //public file in web app
app.use((req, res, next) => {
  const allPort = "*";
  const FEPort = "http://localhost:3000";
  res.setHeader('Access-Control-Allow-Origin', allPort);
  // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT'); // [OPTIONAL SETTING]
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, token');
  next();
});//cors

// Use routes
app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);
app.use(userRoutes);
app.use(errorController.get404);

// add relationship and init data for database
initDataDB.init();

// Test connection
const socketFile = require('./socket');
const server = app.listen(8080);
const io = socketFile.init(server);

io.on('connection', socket => {
  const token = socket.handshake.auth.token;
  if (socketFile.checkToken(token)) {
    socketFile.joinRoomByToken(socket, token);
    
    socket.connect();
    console.log('Client connected');
  } else {
    socket.disconnect();
    console.log('Token wrong');
  }
});