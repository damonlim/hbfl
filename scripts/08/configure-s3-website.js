// Imports
const { PutBucketWebsiteCommand } = require("@aws-sdk/client-s3");
const { sendS3Command: sendCommand } = require("./helpers");

const bucketName = "hamster-bucket-damon-2022";

async function execute() {
  try {
    const response = await configureS3Site(bucketName);
    console.log(response);
  } catch (err) {
    console.error("Error configuring S3 static site:", err);
  }
}

async function configureS3Site(bucketName) {
  const params = {
    Bucket: bucketName,
    WebsiteConfiguration: {
      IndexDocument: {
        Suffix: "index.html",
      },
    },
  };
  const command = new PutBucketWebsiteCommand(params);
  return sendCommand(command);
}

execute();
