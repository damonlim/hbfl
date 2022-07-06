// Imports
const { CreateDBInstanceCommand } = require("@aws-sdk/client-rds");
const { createSecurityGroup, sendRDSCommand } = require("./helpers");

const dbName = "user";

async function execute() {
  try {
    const groupName = `${dbName}-db-sg`;
    const sgId = await createSecurityGroup(groupName, 3306);
    const response = await createDatabase(dbName, sgId);
    console.log(response);
  } catch (err) {
    console.error("Could not create database:", err);
  }
}

async function createDatabase(dbName, sgId) {
  const params = {
    AllocatedStorage: 5,
    DBInstanceClass: "db.t2.micro",
    DBInstanceIdentifier: dbName,
    Engine: "mysql",
    DBName: dbName,
    VpcSecurityGroupIds: [sgId],
    MasterUsername: "admin",
    MasterUserPassword: "mypassword",
  };
  const command = new CreateDBInstanceCommand(params);
  return sendRDSCommand(command);
}

execute();
