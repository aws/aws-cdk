import { App, Stack, StackProps, CfnOutput } from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import * as ec2 from '../lib';

const app = new App();

class TestStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'Vpc');

    // Test can filter by Subnet Ids via selectSubnets
    const subnets = vpc.selectSubnets({
      subnetFilters: [ec2.SubnetFilter.byIds([vpc.privateSubnets[0].subnetId])],
    });

    new CfnOutput(this, 'PrivateSubnet01', {
      value: subnets.subnetIds[0],
    });
  }
}

new IntegTest(app, 'VPCFilterSubnets', {
  testCases: [new TestStack(app, 'VPCFilterSubnetsTestStack')],
});

app.synth();
