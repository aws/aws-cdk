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
  },
});

new integ.IntegTest(app, 'ExcludeCharactersInteg', {
  testCases: [new RedshiftEnv(app, 'redshift-exclude-characters-integ')],
});
