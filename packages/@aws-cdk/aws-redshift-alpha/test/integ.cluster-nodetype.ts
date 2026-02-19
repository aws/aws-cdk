import * as integ from '@aws-cdk/integ-tests-alpha';
import type { StackProps } from 'aws-cdk-lib';
import { Stack, App } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import type { Construct } from 'constructs';
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

const app = new App();
const stack = new Stack(app, 'MultiAzRedshift');

new RedshiftRA3LargeTestStack(stack, 'redshift-ra3-large-integ');

new integ.IntegTest(app, 'RA3LargeNodeIntegTest', {
  testCases: [stack],
});
