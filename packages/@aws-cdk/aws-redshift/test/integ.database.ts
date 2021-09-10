#!/usr/bin/env node
/// !cdk-integ pragma:ignore-assets
import * as ec2 from '@aws-cdk/aws-ec2';
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
});

const databaseOptions = {
  cluster: cluster,
  databaseName: databaseName,
};
const user = new redshift.User(stack, 'User', databaseOptions);
const table = new redshift.Table(stack, 'Table', {
  ...databaseOptions,
  tableColumns: [{ name: 'col1', dataType: 'varchar(4)' }, { name: 'col2', dataType: 'float' }],
});
table.grant(user, redshift.TableAction.INSERT, redshift.TableAction.DELETE);

app.synth();
