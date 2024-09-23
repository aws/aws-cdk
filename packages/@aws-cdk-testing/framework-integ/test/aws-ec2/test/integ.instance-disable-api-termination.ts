/// !cdk-integ InstanceDisableApiTerminationTestStack
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Instance } from 'aws-cdk-lib/aws-ec2';

const app = new cdk.App();

class TestStack extends cdk.Stack {
  public readonly instance: Instance

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'Vpc');

    this.instance = new ec2.Instance(this, 'Instance', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      machineImage: ec2.MachineImage.latestAmazonLinux2023(),
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      disableApiTermination: true,
    });
  }
}

const testCase = new TestStack(app, 'InstanceDisableApiTerminationTestStack');

const integ = new IntegTest(app, 'IntegTest', {
  testCases: [testCase],
});

// to destroy this stack, disable termination protection
integ.assertions.awsApiCall('EC2', 'modifyInstanceAttribute', {
  InstanceId: testCase.instance.instanceId,
  DisableApiTermination: { Value: false },
});
