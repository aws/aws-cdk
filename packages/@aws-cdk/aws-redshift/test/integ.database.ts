#!/usr/bin/env node
import * as ec2 from '@aws-cdk/aws-ec2';
import * as kms from '@aws-cdk/aws-kms';
import * as cdk from '@aws-cdk/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { REDSHIFT_COLUMN_ID } from '@aws-cdk/cx-api';
import * as integ from '@aws-cdk/integ-tests';
import * as constructs from 'constructs';
import * as redshift from '../lib';

const useColumnIds = { [REDSHIFT_COLUMN_ID]: false };
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

cluster.addToParameterGroup('enable_user_activity_logging', 'true');

const databaseOptions = {
  cluster: cluster,
  databaseName: databaseName,
};
const user = new redshift.User(stack, 'User', databaseOptions);
const table = new redshift.Table(stack, 'Table', {
  ...databaseOptions,
  tableColumns: [
    { name: 'col1', dataType: 'varchar(4)', distKey: true, comment: 'A test column', encoding: redshift.ColumnEncoding.LZO },
    { name: 'col2', dataType: 'float', sortKey: true, comment: 'A test column' },
    { name: 'col3', dataType: 'float', comment: 'A test column', encoding: redshift.ColumnEncoding.RAW },
  ],
  distStyle: redshift.TableDistStyle.KEY,
  sortStyle: redshift.TableSortStyle.INTERLEAVED,
  tableComment: 'A test table',
});
table.grant(user, redshift.TableAction.INSERT, redshift.TableAction.DELETE);

new integ.IntegTest(app, 'redshift-cluster-database-integ', {
  testCases: [stack],
});

app.synth();
