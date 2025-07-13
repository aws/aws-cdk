import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Stack, App, StackProps } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as redshift from '../lib';

class RedshiftRA3LargeTestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC', {
      restrictDefaultSecurityGroup: false,
    });

    new redshift.Cluster(this, 'RA3LargeCluster', {
      vpc: vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      masterUser: {
        masterUsername: 'admin',
      },
      nodeType: redshift.NodeType.RA3_LARGE,
      numberOfNodes: 2,
    });
  }
}

const app = new App({
  context: {
    'availability-zones:account=123456789012:region=us-east-1': ['us-east-1a', 'us-east-1b', 'us-east-1c'],
  },
});
const stack = new Stack(app, 'MultiAzRedshift', {
  env: {
    account: '123456789012',
    region: 'us-east-1',
  },
});

new RedshiftRA3LargeTestStack(stack, 'redshift-ra3-large-integ');

new integ.IntegTest(app, 'RA3LargeNodeIntegTest', {
  testCases: [stack],
});
