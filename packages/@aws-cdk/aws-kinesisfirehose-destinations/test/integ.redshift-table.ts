#!/usr/bin/env node
/// !cdk-integ pragma:ignore-assets
import * as path from 'path';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as firehose from '@aws-cdk/aws-kinesisfirehose';
import * as lambdanodejs from '@aws-cdk/aws-lambda-nodejs';
import * as redshift from '@aws-cdk/aws-redshift';
import * as cdk from '@aws-cdk/core';
import * as constructs from 'constructs';
import * as firehosedestinations from '../lib';

/**
 * Stack verification steps:
 * data=`echo '{"ticker_symbol":"AMZN","sector":"TECHNOLOGY","change":1.32,"price":736.83}' | base64`
 * aws firehose put-record --delivery-stream-name <delivery-stream-name> --record "{\"Data\":\"$data\"}"
 */

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-firehose-redshift-cluster');
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
const table = new redshift.Table(stack, 'Table', {
  cluster: cluster,
  databaseName: databaseName,
  tableColumns: [
    { name: 'TICKER_SYMBOL', dataType: 'varchar(4)' },
    { name: 'SECTOR', dataType: 'varchar(16)' },
    { name: 'CHANGE', dataType: 'float' },
    { name: 'PRICE', dataType: 'float' },
  ],
});

const dataProcessorFunction = new lambdanodejs.NodejsFunction(stack, 'DataProcessorFunction', {
  entry: path.join(__dirname, 'lambda-data-processor.js'),
  timeout: cdk.Duration.minutes(1),
});

const redshiftDestination = new firehosedestinations.RedshiftTable(table, {
  copyOptions: 'json \'auto\'',
  bufferingInterval: cdk.Duration.minutes(1),
  bufferingSize: cdk.Size.mebibytes(1),
  compression: firehosedestinations.Compression.GZIP,
  logging: true,
  processor: new firehose.LambdaFunctionProcessor(dataProcessorFunction),
  s3Backup: {
    mode: firehosedestinations.BackupMode.ALL,
  },
});
new firehose.DeliveryStream(stack, 'Firehose', {
  destinations: [redshiftDestination],
});

app.synth();
