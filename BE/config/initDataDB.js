const sequelize = require('./db');
const bcrypt = require('bcryptjs');

const Admin = require('../models/admin');
const Permission = require('../models/permission');
const Admin_Permission = require('../models/admin_permission');
const Chat = require('../models/chat');
const Conversation = require('../models/conversation');
const Group_Member = require('../models/group_member');
const Role = require('../models/role');
const Type = require('../models/type');
const User = require('../models/user');

// Run database and run server
exports.init = (() => {
  Admin.belongsToMany(Permission, { through: Admin_Permission });
  Permission.belongsToMany(Admin, { through: Admin_Permission });
  Role.hasMany(Group_Member);
  Group_Member.belongsTo(Role, { constraints: true, onDelete: 'CASCADE' });
  Type.hasMany(Conversation);
  Conversation.belongsTo(Type, { constraints: true, onDelete: 'CASCADE' });
  User.belongsToMany(Conversation, { through: Group_Member });
  Conversation.belongsToMany(User, { through: Group_Member });
  User.belongsToMany(Conversation, { through: Chat });
  Conversation.belongsToMany(User, { through: Chat });

  sequelize
    // .sync({ force: true })
    .sync()
    .then(() => {
      const permissions = [
        {
          name: 'View infomation of user'
        },
        {
          name: 'Edit infomation of user'
        },
        {
          name: 'Activate user'
        },
        {
          name: 'Inactivate user'
        },
        {
          name: 'View conversation'
        },
        {
          name: 'Create conversation'
        },
        {
          name: 'Edit conversation'
        },
        {
          name: 'Delete conversation'
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

      const types = [
        {
          name: 'individual'
        },
        {
          name: 'group'
        },
        {
          name: 'channel'
        }
      ];

      const hashPassword = bcrypt.hashSync('admin001', 12);

      const users = [
        {
          username: 'admin001@gmail.com',
          password: hashPassword,
          firstName: "Admin",
          lastName: "001",
          gender: 1,
          status: 1
        }
      ];

      const admins = [
        {
          username: 'admin001@gmail.com',
          password: hashPassword,
          status: 1
        }
      ];

      const admin_permissions = [
        {
          adminId: 1,
          permissionId: 1
        }
      ];

      // init data for option table and option datas
      initDataForTable(Permission, permissions);
      initDataForTable(Role, roles);
      initDataForTable(Type, types);
      initDataForTable(User, users);
      initDataForTable(Admin, admins);
      initDataForTable(Admin_Permission, admin_permissions);

    })
    .catch(err => console.log(err));
});

function initDataForTable(table, arrayObject) {
  return table.findAll()
    .then(data => {
      if (data.length < 1) {
        for (let object of arrayObject) {
          table.create(object)
            .then(newData => {
              if (newData) {
                console.log('Init Data: ' + JSON.stringify(object) + ' for table: ' + table.name + ' successfully!');
              }
            })
            .catch(err => console.log(err));
        }
      }
    })
    .catch(err => console.log(err));
}