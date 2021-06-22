import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import { EMRContainersCreateVirtualCluster } from '../../lib/emrcontainers/create-virtual-cluster';

/*
 * Stack verification steps:
 * * aws stepfunctions start-execution --state-machine-arn <deployed state machine arn> : should return execution arn
 * * aws stepfunctions describe-execution --execution-arn <exection-arn generated before> : should return status as SUCCEEDED
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-tasks-emr-containers-create-virtual-cluster-integ');

const createVirtualClusterJob = new EMRContainersCreateVirtualCluster(stack, 'Create a Virtual Cluster Job', {
  name: 'emr-containers-test-cluster',
  containerProvider: {
    id: 'test-eks',
    info: {
      eksInfo: {
        namespace: 'kube-system',
      },
    },
    type: 'EKS',
  },
});

const chain = sfn.Chain.start(createVirtualClusterJob);

const sm = new sfn.StateMachine(stack, 'StateMachine', {
  definition: chain,
  timeout: cdk.Duration.seconds(30),
  // todo: add a role prop here
});

new cdk.CfnOutput(stack, 'stateMachineArn', {
  value: sm.stateMachineArn,
});


app.synth();
