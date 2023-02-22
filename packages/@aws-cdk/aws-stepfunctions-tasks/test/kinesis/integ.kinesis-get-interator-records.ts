import * as kds from '@aws-cdk/aws-kinesis';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import { KinesisGetRecords } from '../../lib/kinesis/get-records';
import { KinesisGetShardIterator, ShardIteratorType } from '../../lib/kinesis/get-shard-interator';

/**
 *
 * Stack verification steps:
 * * aws stepfunctions start-execution --state-machine-arn <deployed state machine arn> : should return execution arn
 * *
 * * aws stepfunctions describe-execution --execution-arn <execution-arn generated before> --query 'status': should return status as SUCCEEDED
 * * aws stepfunctions describe-execution --execution-arn <execution-arn generated before> --query 'output': should return the number 42
 */

const shardId = 'shardId-000000000000';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-kinesis-integ');

const stream = new kds.Stream(stack, 'MytestStream');

const stateMachine = new sfn.StateMachine(stack, 'MyStateMachine', {
  definition: sfn.Chain.start(new KinesisGetShardIterator(stack, 'GetSharedInt', {
    streamName: stream.streamName,
    shardId: shardId,
    shardIteratorType: ShardIteratorType.LATEST,
  })).next(new KinesisGetRecords(stack, 'GetRecords', {
    streamName: stream.streamName,
    shardIterator: '$$.Task.Result.ShardIterator',
  })),
});

new cdk.CfnOutput(stack, 'StateMachineARN', {
  value: stateMachine.stateMachineArn,
});

new integ.IntegTest(app, 'LambdaTest', {
  testCases: [stack],
});

app.synth();