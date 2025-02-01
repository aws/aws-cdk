import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as msk from '../lib';

const app = new cdk.App();

class ServelessStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const vpc = new ec2.Vpc(this, 'VPC', { maxAzs: 2, restrictDefaultSecurityGroup: false });
    const anotherVpc = new ec2.Vpc(this, 'AnotherVPC', { maxAzs: 2, restrictDefaultSecurityGroup: false });
    const securityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', {
      vpc: anotherVpc,
      allowAllOutbound: false,
    });

    new msk.ServerlessCluster(this, 'ServerlessCluster', {
      clusterName: 'my-serverless-cluster',
      vpcConfigs: [
        { vpc },
        {
          vpc: anotherVpc,
          vpcSubnets: anotherVpc.selectSubnets({ subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS }),
          securityGroups: [securityGroup],
        },
      ],
    });
  }
}

const stack = new ServelessStack(app, 'msk-serverless-stack');

new IntegTest(app, 'msk-serverless-integ', {
  testCases: [stack],
});
