import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
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

const elasticIp = new ec2.CfnEIP(stack, 'ElasticIPAddress');
const vpc = new ec2.Vpc(stack, 'Vpc', {
  enableDnsHostnames: true,
  enableDnsSupport: true,
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

app.synth();
