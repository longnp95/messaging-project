// Call extensions
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

// Call database and models
const sequelize = require('./config/db');

const Account = require('./models/account');
const Group = require('./models/group');
const Account_Group = require('./models/account_group');
const Role_Account = require('./models/role_account');
const Role_Account_Group = require('./models/role_account_group');

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
Account.belongsTo(Role_Account, { constraints: true, onDelete: 'CASCADE' });
Role_Account.hasMany(Account);
Account_Group.belongsTo(Role_Account_Group, { constraints: true, onDelete: 'CASCADE' });
Role_Account_Group.hasMany(Account_Group);
Account.belongsToMany(Group, { through: Account_Group });
Group.belongsToMany(Account, { through: Account_Group });

// Run database and run server
sequelize
  .sync({ force: true })
  // .sync()
  .then(() => {
    // init data of role in account table
    Role_Account.findAll()
      .then((roleAccounts) => {
        if (roleAccounts) {
          createRoleAccount('Admin');

          createRoleAccount('User');
        }
      })
      .catch(err => {
        console.log(err);
      });

    // init data of role in account_group table
    Role_Account_Group.findAll()
      .then((roleAccountGroup) => {
        if (roleAccountGroup) {
          createRoleAccountGroup('Leader');

          createRoleAccountGroup('Member');
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

function createRoleAccount(name) {
  return Role_Account.create({
    name: name
  })
    .then(roleAccount => {
      if (roleAccount) {
        console.log('Create Role Account with name: ' + name + ' successfully!');
      } else {
        console.log('Create Role Account: \'' + name + '\' fail!');
      }
    })
    .catch(err => console.log(err));
}

function createRoleAccountGroup(name) {
  return Role_Account_Group.create({
    name: name
  })
    .then(roleInGroup => {
      if (roleInGroup) {
        console.log('Create Role Account with name: ' + name + ' successfully!');
      } else {
        console.log('Create Role Account In Group: \'' + name + '\' fail!');
      }
    })
    .catch(err => console.log(err));
}