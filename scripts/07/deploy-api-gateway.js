// Imports
const { CreateDeploymentCommand } = require("@aws-sdk/client-api-gateway");
const { sendAPIGatewayCommand: sendCommand } = require("./helpers");

// Declare local variables
const stage = "prod";
const apiId = "qhxzqetlq6";

async function execute() {
  try {
    const response = await createDeployment(apiId, stage);
    console.log(response);
  } catch (err) {
    console.error("Error deploying api:", err);
  }
}

function createDeployment(apiId, stageName) {
  // TODO: Create deployment
  const params = {
    restApiId: apiId,
    stageName: stageName,
  };
  const command = new CreateDeploymentCommand(params);
  return sendCommand(command);
}

execute();
