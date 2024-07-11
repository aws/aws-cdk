import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class NatInstanceStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const natInstanceProvider = ec2.NatProvider.instance({
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.LARGE),
      machineImage: new ec2.AmazonLinuxImage(),
      creditSpecification: ec2.CpuCredits.STANDARD,
    });

    new ec2.Vpc(this, 'MyVpc', {
      natGatewayProvider: natInstanceProvider,
      natGateways: 1,
    });
  }
}

const app = new cdk.App();
const testCase = new NatInstanceStack(app, 'aws-cdk-vpc-nat-instance-credit', {});

new IntegTest(app, 'integ-test', {
  testCases: [testCase],
});
