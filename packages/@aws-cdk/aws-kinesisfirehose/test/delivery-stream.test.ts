import '@aws-cdk/assert-internal/jest';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as redshift from '@aws-cdk/aws-redshift';
import * as cdk from '@aws-cdk/core';
import * as kinesisfirehose from '../lib';

describe('delivery stream', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    stack = new cdk.Stack();
  });

  test('default function', () => {
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const database = 'my_db';
    const cluster = new redshift.Cluster(stack, 'Cluster', {
      vpc: vpc,
      masterUser: {
        masterUsername: 'master',
      },
      defaultDatabaseName: database,
    });

    new kinesisfirehose.DeliveryStream(stack, 'Delivery Stream', {
      destination: new kinesisfirehose.RedshiftDestination({
        cluster: cluster,
        user: {
          username: 'firehose',
        },
        database: database,
        tableName: 'table',
        tableColumns: [{name: 'column', dataType: 'varchar(4)'}],
      }),
    });

    expect(stack).toHaveResource('AWS::KinesisFirehose::DeliveryStream');
  });
});
