import { App, Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { EC2_RESTRICT_DEFAULT_SECURITY_GROUP } from 'aws-cdk-lib/cx-api';

const app = new App();

class TestStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    this.node.setContext(EC2_RESTRICT_DEFAULT_SECURITY_GROUP, false);
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
