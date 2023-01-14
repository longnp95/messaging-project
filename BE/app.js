// Call extensions
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

// Call database and models
const sequelize = require('./config/db');

const User = require('./models/user');
const Group = require('./models/group');
const Group_Member = require('./models/group_member');
const Role = require('./models/role');
const Chat = require('./models/chat');
const Admin = require('./models/admin');
const Permission = require('./models/permission');

const app = express();

// Call Controller
const errorController = require('./controllers/error');

// Call routes


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
app.use(errorController.get404);

// Relationship mysql
Permission.hasMany(Admin);
Admin.belongsTo(Permission, { constraints: true, onDelete: 'CASCADE' });
Role.hasMany(Group_Member);
Group_Member.belongsTo(Role, { constraints: true, onDelete: 'CASCADE' });
User.belongsToMany(Group, { through: Group_Member });
Group.belongsToMany(User, { through: Group_Member });
User.belongsToMany(Group, { through: Chat });
Group.belongsToMany(User, { through: Chat });

// Run database and run server
sequelize
  .sync({ force: true })
  // .sync()
  .then(() => {
    const permissions = [
      {
        name: 'Owner'
      }
    ];

    const roles = [
      {
        name: 'Leader'
      },
      {
        name: 'Member'
      }
    ];

    const admins = [
      {
        username: 'admin001@gmail.com',
        password: 'admin001',
        status: 1
      }
    ];

    // init data for option table and option datas
    initDataForTable(Permission, permissions);
    initDataForTable(Role, roles);
    initDataForTable(Admin, admins);

    // Test connection
    const server = app.listen(8080);
    const io = require('./socket').init(server);
    io.on('connection', socket => {
      console.log('Client connected');
    });
  })
  .catch(err => {
    console.log(err);
  });

function initDataForTable(table, arrayObject) {
  return table.findAll()
    .then(data => {
      if (data.length < 1) {
        for (let object of arrayObject) {
          table.create(object)
            .then(newData => {
              if (newData) {
                console.log('Init Data: ' + JSON.stringify(object) + ' for table: ' + table.name + ' Successfully!');
              }
            })
            .catch(err => console.log(err));
        }
      }
    })
    .catch(err => console.log(err));
}