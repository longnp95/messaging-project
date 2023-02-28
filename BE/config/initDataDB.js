const sequelize = require('./db');
const bcrypt = require('bcryptjs');
const reactions = require('./reaction');

const Admin = require('../models/admin');
const Permission = require('../models/permission');
const Admin_Permission = require('../models/admin_permission');
const Chat = require('../models/chat');
const Conversation = require('../models/conversation');
const Group_Member = require('../models/group_member');
const Role = require('../models/role');
const Type = require('../models/type');
const User = require('../models/user');
const Media = require('../models/media');
const Chat_Media = require('../models/chat_media');
const Reaction = require('../models/reaction');
const Chat_Reaction = require('../models/chat_reaction');


// Run database and run server
exports.init = (() => {
  Admin.belongsToMany(Permission, { through: Admin_Permission, onDelete: 'CASCADE' });
  Permission.belongsToMany(Admin, { through: Admin_Permission, onDelete: 'CASCADE' });
  Role.hasMany(Group_Member);
  Group_Member.belongsTo(Role, { constraints: true, onDelete: 'CASCADE' });
  Type.hasMany(Conversation);
  Conversation.belongsTo(Type, { constraints: true, onDelete: 'CASCADE' });
  User.belongsToMany(Conversation, { through: Group_Member });
  Conversation.belongsToMany(User, { through: Group_Member });
  Conversation.belongsTo(User, { as: 'creator' });
  Conversation.belongsTo(User, { as: 'partner' });
  Chat.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
  User.hasMany(Chat);
  Conversation.hasMany(Chat);
  Chat.belongsTo(Conversation, { constraints: true, onDelete: 'CASCADE' });
  User.hasMany(Media);
  Media.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
  Chat.hasMany(Group_Member, { foreignKey: 'lastSeenId' });
  Group_Member.belongsTo(Chat, { as: 'lastSeen' });
  Group_Member.belongsTo(User);
  Chat.belongsToMany(Media, { through: Chat_Media });
  Media.belongsToMany(Chat, { through: Chat_Media });
  Chat.hasMany(Chat_Reaction);
  Chat_Reaction.belongsTo(User);
  Chat_Reaction.belongsTo(Reaction);

  sequelize
    // .sync({ force: true })
    .sync({ alter: true })
    .then(async () => {
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
      await initDataForTable(Permission, permissions);
      await initDataForTable(Role, roles);
      await initDataForTable(Type, types);
      await initDataForTable(User, users);
      await initDataForTable(Admin, admins);
      await initDataForTable(Admin_Permission, admin_permissions);
      await initDataForTable(Reaction, reactions);

      User.addScope('userBasicInfo', {
        model: User,
        attributes: ['id', 'username', 'avatar', 'firstName', 'lastName', 'gender', 'status'],
      });
    })
    .catch(err => console.log(err));
});

const initDataForTable = (async (table, arrayObject) => {
  const data = await table.findAll();

  if (data.length < 1) {
    for (let object of arrayObject) {
      const newData = await table.create(object);

      if (newData) {
        console.log('Init Data: ' + JSON.stringify(object) + ' for table: ' + table.name + ' successfully!');
      }
    }
  }
});