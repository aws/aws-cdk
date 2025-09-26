import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as sfnTasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { Construct } from 'constructs';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as fs from 'fs';
import * as path from 'path';

class BugReproductionStack extends cdk.Stack {
  public readonly vpc: ec2.IVpc;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const privateSubnetIds = new cdk.CfnParameter(this, 'PrivateSubnetIds', {
      type: 'String',
      default: '',
    });

    const availabilityZones = new cdk.CfnParameter(this, 'AvailabilityZones', {
      type: 'String',
      default: '',
    });

    const vpcId = new cdk.CfnParameter(this, 'VpcId', {
      type: 'String',
      default: '',
    });

    this.vpc = ec2.Vpc.fromVpcAttributes(this, 'Vpc', {
      vpcId: vpcId.valueAsString,
      privateSubnetIds: cdk.Fn.split(',', privateSubnetIds.valueAsString),
      availabilityZones: cdk.Fn.split(',', availabilityZones.valueAsString),
    });

    new ChildStack(this, 'ChildStack');
  }
}

class ChildStack extends cdk.NestedStack {
  constructor(scope: Construct, id: string, props?: cdk.NestedStackProps) {
    super(scope, id, props);

    const parent = this.nestedStackParent as BugReproductionStack;

    const cluster = new ecs.Cluster(this, 'Cluster', {
      vpc: parent.vpc,
    });

    const taskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDefinition');

    taskDefinition.addContainer('Container', {
      image: ecs.ContainerImage.fromRegistry('hello-world'),
    });

    new sfn.StateMachine(this, 'StateMachine', {
      definitionBody: sfn.DefinitionBody.fromChainable(
        new sfnTasks.EcsRunTask(this, 'RunTask', {
          integrationPattern: sfn.IntegrationPattern.RUN_JOB,
          cluster,
          taskDefinition,
          launchTarget: new sfnTasks.EcsFargateLaunchTarget({
            platformVersion: ecs.FargatePlatformVersion.LATEST,
          }),
        }),
      ),
    });
  }
}

// Synthesis-level test to validate bug fix
const bugTestApp = new cdk.App();
const bugStack = new BugReproductionStack(bugTestApp, 'BugReproductionStack');
const assembly = bugTestApp.synth();

// Check the nested stack template for invalid references
const childStack = bugStack.node.findChild('ChildStack') as cdk.NestedStack;
// Get the path of the cfn template
const nestedTemplateFile = path.join(assembly.directory, `${childStack.artifactId}.nested.template.json`);

if (fs.existsSync(nestedTemplateFile)) {
  const nestedTemplate = JSON.parse(fs.readFileSync(nestedTemplateFile, 'utf8'));
  const resources = nestedTemplate.Resources || {};
  // Find CfnJsonStringify resources
  const cfnJsonStringifyResources = Object.entries(resources).filter(
    ([_, resource]: [string, any]) => resource.Type === 'Custom::AWSCDKCfnJsonStringify');

  // Validate no invalid references exist
  for (const [logicalId, resource] of cfnJsonStringifyResources) {
    const properties = (resource as any).Properties;
    const value = properties?.Value;

    if (value && typeof value === 'object') {
      const valueStr = JSON.stringify(value);
      const invalidRefs = ['PrivateSubnetIds', 'AvailabilityZones', 'VpcId'];

      for (const invalidRef of invalidRefs) {
        if (valueStr.includes(`"Ref":"${invalidRef}"`)) {
          throw new Error(`Bug detected: Invalid reference to parent stack parameter "${invalidRef}" in CfnJsonStringify resource "${logicalId}"`);
        }
      }
    }
  }
}

// Deployment test
const app = new cdk.App();
const stack = new BugReproductionStack(app, 'BugReproductionStack');

const testCase = new IntegTest(app, 'NestedStackParameterBugFixIntegTest', {
  testCases: [stack],
});

// Verify parent stack deployed successfully
const describeParentStack = testCase.assertions.awsApiCall('CloudFormation', 'describeStacks', {
  StackName: stack.stackName,
});

describeParentStack.assertAtPath('Stacks.0.StackStatus', integ.ExpectedResult.stringLikeRegexp('.*COMPLETE.*'));

