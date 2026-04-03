import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import type * as constructs from 'constructs';
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

const elasticIp = new ec2.CfnEIP(stack, 'ElasticIPAddress');
const vpc = new ec2.Vpc(stack, 'Vpc', {
  restrictDefaultSecurityGroup: false,
  enableDnsHostnames: true,
  enableDnsSupport: true,
  maxAzs: 3,
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
  elasticIp: elasticIp.ref,
});

new integ.IntegTest(app, 'aws-cdk-redshift-elastic-ip-test', {
  testCases: [stack],
});
