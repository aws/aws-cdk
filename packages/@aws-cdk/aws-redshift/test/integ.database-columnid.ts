#!/usr/bin/env node
import * as ec2 from '@aws-cdk/aws-ec2';
import * as kms from '@aws-cdk/aws-kms';
import * as cdk from '@aws-cdk/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { REDSHIFT_COLUMN_ID } from '@aws-cdk/cx-api';
import * as integ from '@aws-cdk/integ-tests';
import * as constructs from 'constructs';
import * as redshift from '../lib';

const useColumnIds = { [REDSHIFT_COLUMN_ID]: true };

const app = new cdk.App({
  context: useColumnIds,
});

const stack = new cdk.Stack(app, 'aws-cdk-redshift-cluster-database');
cdk.Aspects.of(stack).add({
  visit(node: constructs.IConstruct) {
    if (cdk.CfnResource.isCfnResource(node)) {
      node.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
    }
  },
});

const key = new kms.Key(stack, 'custom-kms-key');
const vpc = new ec2.Vpc(stack, 'Vpc');
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
    { id: 'col3', name: 'col3', dataType: 'float' },
  ],
});

new integ.IntegTest(app, 'redshift-cluster-database-integ', {
  testCases: [stack],
});

app.synth();
