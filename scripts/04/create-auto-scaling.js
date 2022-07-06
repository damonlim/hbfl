// Imports
const {
  CreateAutoScalingGroupCommand,
  PutScalingPolicyCommand,
} = require("@aws-sdk/client-auto-scaling");

const { sendAutoScalingCommand } = require("./helpers");

// Declare local variables
const asgName = "hamsterASG";
const ltName = "hamsterLT";
const policyName = "hamsterPolicy";
const tgArn =
  "arn:aws:elasticloadbalancing:us-east-1:422636054823:targetgroup/hamsterTG/7259cb6ce715ac90";

async function execute() {
  try {
    const response = await createAutoScalingGroup(asgName, ltName);
    await createASGPolicy(asgName, policyName);
    console.log("Created auto scaling group with:", response);
  } catch (err) {
    console.error("Failed to create auto scaling group with:", err);
  }
}

function createAutoScalingGroup(asgName, ltName) {
  const params = {
    AutoScalingGroupName: asgName,
    AvailabilityZones: ["us-east-1a", "us-east-1b"],
    LaunchTemplate: {
      LaunchTemplateName: ltName,
    },
    MaxSize: 2,
    MinSize: 1,
    TargetGroupARNs: [tgArn],
  };
  const command = new CreateAutoScalingGroupCommand(params);
  return sendAutoScalingCommand(command);
}

function createASGPolicy(asgName, policyName) {
  const params = {
    AdjustmentType: "ChangeInCapacity",
    AutoScalingGroupName: asgName,
    PolicyName: policyName,
    PolicyType: "TargetTrackingScaling",
    TargetTrackingConfiguration: {
      TargetValue: 5,
      PredefinedMetricSpecification: {
        PredefinedMetricType: "ASGAverageCPUUtilization",
      },
    },
  };
  const command = new PutScalingPolicyCommand(params);
  return sendAutoScalingCommand(command);
}

execute();
