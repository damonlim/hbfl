// Imports
const {
  EC2Client,
  AuthorizeSecurityGroupIngressCommand,
  CreateKeyPairCommand,
  CreateSecurityGroupCommand,
  RunInstancesCommand,
} = require("@aws-sdk/client-ec2");
const helpers = require("./helpers");

function sendCommand(command) {
  const client = new EC2Client({ region: process.env.AWS_REGION });
  return client.send(command);
}

// Declare local variables
const sgName = "hamster_sg2";
const keyName = "hamster_key2";

// Do all the things together
async function execute() {
  try {
    await createSecurityGroup(sgName);
    const keyPair = await createKeyPair(keyName);
    await helpers.persistKeyPair(keyPair);
    const data = await createInstance(sgName, keyName);
    console.log("Created instance with:", data);
  } catch (err) {
    console.error("Failed to create instance with:", err);
  }
}

// Create functions
async function createSecurityGroup(sgName) {
  const sgParams = {
    Description: sgName,
    GroupName: sgName,
  };
  const createCommand = new CreateSecurityGroupCommand(sgParams);
  const data = await sendCommand(createCommand);

  const rulesParams = {
    GroupId: data.GroupId,
    IpPermissions: [
      {
        IpProtocol: "tcp",
        FromPort: 22,
        ToPort: 22,
        IpRanges: [{ CidrIp: "0.0.0.0/0" }],
      },
      {
        IpProtocol: "tcp",
        FromPort: 3000,
        ToPort: 3000,
        IpRanges: [{ CidrIp: "0.0.0.0/0" }],
      },
    ],
  };
  const authCommand = new AuthorizeSecurityGroupIngressCommand(rulesParams);
  return sendCommand(authCommand);
}

async function createKeyPair(keyName) {
  const params = {
    KeyName: keyName,
  };
  const command = new CreateKeyPairCommand(params);
  return sendCommand(command);
}

async function createInstance(sgName, keyName) {
  const params = {
    ImageId: "ami-0cff7528ff583bf9a",
    InstanceType: "t2.micro",
    KeyName: keyName,
    MaxCount: 1,
    MinCount: 1,
    SecurityGroups: [sgName],
    UserData:
      "IyEvYmluL2Jhc2gKY3VybCAtLXNpbGVudCAtLWxvY2F0aW9uIGh0dHBzOi8vcnBtLm5vZGVzb3VyY2UuY29tL3NldHVwXzE2LnggfCBzdWRvIGJhc2ggLQpzdWRvIHl1bSBpbnN0YWxsIC15IG5vZGVqcwpzdWRvIHl1bSBpbnN0YWxsIC15IGdpdApjZCBob21lL2VjMi11c2VyCmdpdCBjbG9uZSBodHRwczovL2dpdGh1Yi5jb20vZGFtb25saW0vaGJmbC5naXQKY2QgaGJmbApucG0gaQpucG0gcnVuIHN0YXJ0",
    // UserData: 'IyEvYmluL2Jhc2gKc3VkbyBhcHQtZ2V0IHVwZGF0ZQpzdWRvIGFwdC1nZXQgLXkgaW5zdGFsbCBnaXQKZ2l0IGNsb25lIGh0dHBzOi8vZ2l0aHViLmNvbS9yeWFubXVyYWthbWkvaGJmbC5naXQgL2hvbWUvYml0bmFtaS9oYmZsCmNob3duIC1SIGJpdG5hbWk6IC9ob21lL2JpdG5hbWkvaGJmbApjZCAvaG9tZS9iaXRuYW1pL2hiZmwKc3VkbyBucG0gaQpzdWRvIG5wbSBydW4gc3RhcnQ='
  };
  const command = new RunInstancesCommand(params);
  return sendCommand(command);
}

execute();
