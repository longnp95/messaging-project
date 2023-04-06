const cron = require('cron');
const db = require('../../config/db');
const backupdb = require('../../config/backupdb');
const backupController = require('../backup');


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
  onTick: async function() {
    console.log("Cron Backup is running...");
    await backupController.backupFromDb(db, backupdb);
    console.log("Cron Backup is close...");
  },
  start: true, 
  timeZone: 'Asia/Ho_Chi_Minh'
});

backup.start();