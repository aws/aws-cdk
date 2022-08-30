#!/usr/bin/env node
import * as ec2 from '@aws-cdk/aws-ec2';
import * as kms from '@aws-cdk/aws-kms';
import * as cdk from '@aws-cdk/core';
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
  encryptionKey: new kms.Key(stack, 'custom-kms-key'),
});

const databaseOptions = {
  cluster: cluster,
  databaseName: databaseName,
};
const user = new redshift.User(stack, 'User', databaseOptions);
const table = new redshift.Table(stack, 'Table', {
  ...databaseOptions,
  tableColumns: [
    { name: 'col1', dataType: 'varchar(4)', distKey: true },
    { name: 'col2', dataType: 'float', sortKey: true },
    { name: 'col3', dataType: 'float', sortKey: true },
  ],
  distStyle: redshift.TableDistStyle.KEY,
  sortStyle: redshift.TableSortStyle.INTERLEAVED,
});
table.grant(user, redshift.TableAction.INSERT, redshift.TableAction.DELETE);

app.synth();
