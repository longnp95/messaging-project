const backupdb = require('./backupdb');
const Job = require('../models/backup/job');

const init = (async () => {
  Job;
  await backupdb
    // .sync({ force: true })
    .sync({ alter: true })
    .catch(err => console.log(err));
});


module.exports = {
  init: init
}