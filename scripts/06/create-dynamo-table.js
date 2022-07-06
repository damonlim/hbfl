// Imports
const { CreateTableCommand } = require("@aws-sdk/client-dynamodb");
const { sendDynamoDBCommand } = require("./helpers");

async function execute() {
  try {
    await createTable("hamsters");
    const data = await createTable("races");
    console.log(data);
  } catch (err) {
    console.error("Could not create tables:", err);
  }
}

async function createTable(tableName) {
  const params = {
    TableName: tableName,
    AttributeDefinitions: [
      {
        AttributeName: "id",
        AttributeType: "N",
      },
    ],
    KeySchema: [
      {
        AttributeName: "id",
        KeyType: "HASH",
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  };
  const command = new CreateTableCommand(params);
  return sendDynamoDBCommand(command);
}

execute();
