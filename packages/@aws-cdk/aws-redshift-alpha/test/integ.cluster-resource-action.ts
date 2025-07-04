import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as constructs from 'constructs';
import * as redshift from '../lib';

const app = new cdk.App({
  context: {
    'availability-zones:account=123456789012:region=us-east-1': ['us-east-1a', 'us-east-1b', 'us-east-1c'],
  },
});
const stack = new cdk.Stack(app, 'ResourceActionStack', {
  env: {
    account: '123456789012',
    region: 'us-east-1',
  },
});

cdk.Aspects.of(stack).add({
  visit(node: constructs.IConstruct) {
    if (cdk.CfnResource.isCfnResource(node)) {
      node.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
    }
  },
});

const vpc = new ec2.Vpc(stack, 'Vpc', {
  restrictDefaultSecurityGroup: false,
  natGateways: 0,
});
new redshift.Cluster(stack, 'Cluster', {
  vpc: vpc,
  vpcSubnets: {
    subnetType: ec2.SubnetType.PUBLIC,
  },
  masterUser: {
    masterUsername: 'admin',
  },
  publiclyAccessible: true,
  resourceAction: redshift.ResourceAction.PAUSE_CLUSTER,
});

new integ.IntegTest(app, 'ResourceActionInteg', {
  testCases: [stack],
});
