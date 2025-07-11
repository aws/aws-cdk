#!/usr/bin/env node
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Stack, App, StackProps, RemovalPolicy } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as redshift from '../lib';

class RedshiftEnv extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC', { restrictDefaultSecurityGroup: false });

    const subnetGroup = new redshift.ClusterSubnetGroup(this, 'SubnetGroup', {
      description: 'test-subnet-group',
      vpc,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const cluster = new redshift.Cluster(this, 'Cluster', {
      vpc: vpc,
      masterUser: {
        masterUsername: 'admin',
        excludeCharacters: '"@/\\\ \'`',
      },
      defaultDatabaseName: 'database',
      subnetGroup,
      nodeType: redshift.NodeType.RA3_LARGE,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    new redshift.User(this, 'User', {
      cluster,
      databaseName: 'database',
      excludeCharacters: '"@/\\\ \'`',
    });
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': true,
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
  context: {
    'availability-zones:account=123456789012:region=us-east-1': ['us-east-1a', 'us-east-1b', 'us-east-1c'],
  },
});

const stack = new Stack(app, 'aws-cdk-redshift-cluster-database', {
  env: {
    account: '123456789012',
    region: 'us-east-1',
  },
});

new RedshiftEnv(stack, 'redshift-exclude-characters-integ');

new integ.IntegTest(app, 'ExcludeCharactersInteg', {
  testCases: [stack],
});
