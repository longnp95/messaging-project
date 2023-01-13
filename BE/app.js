// Call extensions
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

// Call database and models
const sequelize = require('./config/db');

const User_Account = require('./models/user_account');
const Group = require('./models/group');
const Group_Member = require('./models/group_member');
const Role = require('./models/role');
const Chat = require('./models/chat');
const Admin_Account = require('./models/admin_account');
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
Group_Member.belongsTo(Role, { constraints: true, onDelete: 'CASCADE' });
Role.hasMany(Group_Member);
User_Account.belongsToMany(Group, { through: Group_Member });
Group.belongsToMany(User_Account, { through: Group_Member });
User_Account.belongsToMany(Group, { through: Chat });
Group.belongsToMany(User_Account, { through: Chat });
Admin_Account.belongsTo(Permission, { constraints: true, onDelete: 'CASCADE' });
Permission.hasMany(Admin_Account);

// Run database and run server
sequelize
  .sync({ force: true })
  // .sync()
  .then(() => {
    // init data for permission table
    Permission.findAll()
      .then((roleAccounts) => {
        if (roleAccounts) {
          createPermission('Owner');
        }
      })
      .catch(err => {
        console.log(err);
      });

    // init data of role in group_members table
    Role.findAll()
      .then((role) => {
        if (role) {
          createRole('Leader');

          createRole('Member');
        }
      })
      .catch(err => {
        console.log(err);
      });

    return app.listen(8080);
  })
  .catch(err => {
    console.log(err);
  });

function createRole(name) {
  return Role.create({
    name: name
  })
    .then(role => {
      if (role) {
        console.log('Create Role with name: ' + name + ' successfully!');
      } else {
        console.log('Create Role with name: \'' + name + '\' fail!');
      }
    })
    .catch(err => console.log(err));
}

function createPermission(name) {
  return Permission.create({
    name: name
  })
    .then(permission => {
      if (permission) {
        console.log('Create Permission with name: ' + name + ' successfully!');
      } else {
        console.log('Create Permission with name: \'' + name + '\' fail!');
      }
    })
    .catch(err => console.log(err));
}