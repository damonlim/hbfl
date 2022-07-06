const {
  SQSClient,
  GetQueueUrlCommand,
  SendMessageCommand,
} = require("@aws-sdk/client-sqs");

const client = new SQSClient({ region: process.env.AWS_REGION });

async function push(queueName, msg) {
  const queueParams = {
    QueueName: queueName,
  };
  const queueCommand = new GetQueueUrlCommand(queueParams);
  const queueResponse = await client.send(queueCommand);

  const sendParams = {
    MessageBody: JSON.stringify(msg),
    QueueUrl: queueResponse.QueueUrl,
  };
  const sendCommand = new SendMessageCommand(sendParams);
  return client.send(sendCommand);
}

module.exports = { push };
