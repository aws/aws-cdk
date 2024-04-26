import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as constructs from 'constructs';
import * as redshift from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-redshift-cluster-database');

cdk.Aspects.of(stack).add({
  visit(node: constructs.IConstruct) {
    if (cdk.CfnResource.isCfnResource(node)) {
      node.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
    }
  },
});

const vpc = new ec2.Vpc(stack, 'Vpc', {
  restrictDefaultSecurityGroup: false,
  enableDnsHostnames: true,
  enableDnsSupport: true,
  maxAzs: 2,
});

new redshift.Cluster(stack, 'Cluster', {
  vpc: vpc,
  masterUser: {
    masterUsername: 'admin',
  },
  nodeType: redshift.NodeType.RA3_16XLARGE,
  multiAz: true,
  numberOfNodes: 1,
});

new integ.IntegTest(app, 'aws-cdk-redshift-multi-az', {
  testCases: [stack],
});
