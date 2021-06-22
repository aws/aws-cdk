import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import { EMRContainersDeleteVirtualCluster } from '../../lib';

/*
 * Stack verification steps:
 * * aws stepfunctions start-execution --state-machine-arn <deployed state machine arn> : should return execution arn
 * * aws stepfunctions describe-execution --execution-arn <exection-arn generated before> : should return status as SUCCEEDED
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-tasks-emr-containers-delete-virtual-cluster-integ');

const deleteVirtualCluster = new EMRContainersDeleteVirtualCluster(stack, 'EMR Containers Delete Virtual Cluster', {
  id: 'z0yghc9wfddurogzx9ws12qr0',
});

const chain = sfn.Chain.start(deleteVirtualCluster);

const sm = new sfn.StateMachine(stack, 'StateMachine', {
  definition: chain,
  timeout: cdk.Duration.seconds(30),
  // todo: add a role prop here
});

new cdk.CfnOutput(stack, 'stateMachineArn', {
  value: sm.stateMachineArn,
});


app.synth();
