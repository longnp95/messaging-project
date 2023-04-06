const cron = require('cron');
const db = require('../../config/db');
const backupdb = require('../../config/backupdb');
const backupController = require('../backup');
const dataDbBackup = require('../../config/dataDbBackup');

const backup = new cron.CronJob({
  /* 
   * Seconds: 0-59
   * Minutes: 0-59
   * Hours: 0-23
   * Day of Month: 1-31
   * Months: 0-11 (Jan-Dec)
   * Day of Week: 0-6 (Sun-Sat)
   */
  cronTime: '*/10 * * * * *',
  onTick: (async function() {const d_t = new Date();
 
    let year = d_t.getFullYear();
    let month = ("0" + (d_t.getMonth() + 1)).slice(-2);
    let day = ("0" + d_t.getDate()).slice(-2);
    let hour = d_t.getHours();
    let minute = d_t.getMinutes();
    let seconds = d_t.getSeconds();

    console.log(hour + ":" + minute + ":" + seconds + " " + day + "-" + month + "-" + year);
    console.log("Cron Backup is running...");

    try {
      await dataDbBackup.init();
      await backupController.backupFromDb(db, backupdb);
    } catch (err) {
      console.log("Backup err: " + err);
    }

    console.log("Cron Backup is close...");
  }),
  start: true, 
  timeZone: 'Asia/Ho_Chi_Minh'
});

backup.start();