const Job = require('../models/backup/job');
const { QueryTypes } = require('sequelize');

const getJobs = (async () => {
  const jobs = await Job.findAll();

  return jobs;
});

const getJob = (async (operator) => {
  const job = await Job.findOne({where: operator});

  return job;
});

const createJob = (async (tableName) => {
  const jobExists = await getJob({tableName: tableName});

  if (jobExists) {
    return jobExists;
  }

  const job = await Job.create({
    lastedId: 0,
    tableName: tableName
  });

  return job;
});

const getStringFieldsFromTableCols = ((tableCols) => {
  var str = "";
  var i = 0;

  for (var tableCol of tableCols) {
    var colField = tableCol.Field;
    
    if (i == (tableCols.length - 1)) {
      str += colField;
    } else {
      str += colField + ", ";
    }

    i++;
  }

  return str;
});

const selectQuery = (async (db , sql) => {
  return await db.query (sql, { type:QueryTypes.SELECT });
});

const backupTableDbFromTableName = (async (db, backupdb, tableName) => {
  const existsTableName = await selectQuery (backupdb, "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_NAME = '" + tableName + "' AND TABLE_SCHEMA = '" + backupdb.config.database + "'");
  
  if (existsTableName.length == 0) {
    backupdb.define(tableName, {});
    await backupdb
      .sync({ alter: true })
      .catch(err => console.log("Func: backupFromDb, Err:" + err));
  }
  const newJob = await createJob (tableName);
});

const backupColDbFromTableName = (async (db, backupdb, tableName) => {
  const dbTableCols = await selectQuery (db, "SHOW FULL COLUMNS FROM `" + tableName + "`");

  for (var dbTableCol of dbTableCols) {
    var dbColField = dbTableCol.Field;
    var dbColType = dbTableCol.Type;
    var dbColNull = dbTableCol.Null == 'YES' ? 'null' : 'not null';
    var dbColDeffault = dbTableCol.Default;
    var dbColExtra = dbTableCol.Extra;
    var dbColPrivileges = dbTableCol.Privileges;
    var dbColComment = dbTableCol.Comment;
    var hasCol = false;
    
    const existsBackupdbCol = await selectQuery (backupdb, "SELECT * FROM information_schema.columns WHERE table_schema = '" + backupdb.config.database + "' AND table_name = '" + tableName + "' AND column_name = '" + dbColField + "'");
    
    if (existsBackupdbCol.length == 0 && tableName != "jobs") {
      await backupdb.query ("ALTER TABLE `" + tableName + "` ADD `" + dbColField + "` " + dbColType + " " + dbColNull + " " + dbColExtra).catch(err => console.log("Func: backupColDb, Err: " + err));
    }
  }
});

const backupDataDbFromTablename = (async (db, backupdb, tableName) => {
  const job = await getJob({tableName: tableName});

  var sql = "INSERT INTO ";
  sql += backupdb.config.database + "." + tableName + " ";
  sql += "(";

  const dbTableCols = await selectQuery (db, "SHOW FULL COLUMNS FROM `" + tableName + "`");
  sql += getStringFieldsFromTableCols (dbTableCols);

  sql += ") ";
  sql += "select * from " + db.config.database + "." + tableName + " ";
  sql += "where id > " + job.lastedId;

  await db.query(sql);

  const lastedIdObj = await selectQuery(backupdb, "SELECT MAX(id) as lastedId FROM " + tableName);
  const lastedId = lastedIdObj[0] && lastedIdObj[0].lastedId && lastedIdObj[0].lastedId != null ? lastedIdObj[0].lastedId : 0;

  await job.update({
    lastedId: lastedId
  });
  await job.save();
});

const backupDbFronFunc = (async (db, backupdb, func) => {
  const dbTables = await selectQuery (db, "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_SCHEMA = '" + db.config.database + "'");

  for (var tableNameObj of dbTables) {
    var tableName = tableNameObj.TABLE_NAME;
    await func (db, backupdb, tableName);
  }
});

const backupFromDb = (async (db, backupdb) => {
  await backupDbFronFunc (db, backupdb, backupTableDbFromTableName);
  await backupDbFronFunc (db, backupdb, backupColDbFromTableName);
  await backupDbFronFunc (db, backupdb, backupDataDbFromTablename);
});

module.exports = {
  backupFromDb: backupFromDb
}