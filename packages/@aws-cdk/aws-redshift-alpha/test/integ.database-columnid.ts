#!/usr/bin/env node
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as cdk from 'aws-cdk-lib';
// eslint-disable-next-line import/no-extraneous-dependencies
import { REDSHIFT_COLUMN_ID } from 'aws-cdk-lib/cx-api';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as constructs from 'constructs';
import * as redshift from '../lib';

const useColumnIds = { [REDSHIFT_COLUMN_ID]: true };

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': true,
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
  context: {
    ...useColumnIds,
    'availability-zones:account=123456789012:region=us-east-1': ['us-east-1a', 'us-east-1b', 'us-east-1c'],
  },
});

const stack = new cdk.Stack(app, 'aws-cdk-redshift-cluster-database', {
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

const key = new kms.Key(stack, 'custom-kms-key');
const vpc = new ec2.Vpc(stack, 'Vpc', { restrictDefaultSecurityGroup: false });
const databaseName = 'my_db';
const cluster = new redshift.Cluster(stack, 'Cluster', {
  vpc: vpc,
  vpcSubnets: {
    subnetType: ec2.SubnetType.PUBLIC,
  },
  masterUser: {
    masterUsername: 'admin',
  },
  defaultDatabaseName: databaseName,
  publiclyAccessible: true,
  encryptionKey: key,
});

const databaseOptions = {
  cluster: cluster,
  databaseName: databaseName,
};
new redshift.Table(stack, 'Table', {
  ...databaseOptions,
  tableColumns: [
    { id: 'col1', name: 'col1', dataType: 'varchar(4)' },
    { id: 'col2', name: 'col2', dataType: 'float' },
    { name: 'col3', dataType: 'float' },
  ],
  timeout: cdk.Duration.minutes(5),
});

new integ.IntegTest(app, 'redshift-cluster-database-integ', {
  testCases: [stack],
});

app.synth();
