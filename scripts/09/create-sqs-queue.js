// Imports
const { CreateQueueCommand } = require("@aws-sdk/client-sqs");
const { sendSQSCommand: sendCommand } = require("./helpers");

// Declare local variables
const queueName = "hamster-race-results";

async function execute() {
  try {
    const response = await createQueue(queueName);
    console.log(response);
  } catch (err) {
    console.error("Error creating SQS queue:", err);
  }
}

function createQueue(queueName) {
  const params = {
    QueueName: queueName,
    Attributes: {
      DelaySeconds: 0,
      MessageRetentionPeriod: 345600,
      VisibilityTimeout: 30,
      ReceiveMessageWaitTimeSeconds: 0,
    },
  };

  const command = new CreateQueueCommand(params);
  return sendCommand(command);
}

execute();
