#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import * as s3 from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-s3');

const inventoryBucket = new s3.Bucket(stack, 'InventoryBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const myBucket = new s3.Bucket(stack, 'MyBucket', {
  inventories: [
    {
      destination: {
        bucket: inventoryBucket,
        prefix: 'reports',
      },
      frequency: s3.InventoryFrequency.DAILY,
      format: s3.InventoryFormat.PARQUET,
    },
  ],
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const secondInventoryBucket = new s3.Bucket(stack, 'SecondBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

myBucket.addInventory({
  destination: {
    bucket: secondInventoryBucket,
  },
});

new IntegTest(app, 'cdk-integ-bucket-inventory', {
  testCases: [stack],
});