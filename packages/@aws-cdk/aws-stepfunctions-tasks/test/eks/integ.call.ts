import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import { EksCall, MethodType } from '../../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-tasks-eks-call-integ');

const callJob = new EksCall(stack, 'Call a EKS Endpoint', {
  clusterName: 'clusterName',
  certificateAuthority: 'certificateAuthority',
  endpoint: 'https://apiid.gr7.us-east-1.eks.amazonaws.com',
  httpMethod: MethodType.GET,
  path: '/api/v1/namespaces/default/pods',
});

const chain = sfn.Chain.start(callJob);

const sm = new sfn.StateMachine(stack, 'StateMachine', {
  definition: chain,
  timeout: cdk.Duration.seconds(30),
});

new cdk.CfnOutput(stack, 'stateMachineArn', {
  value: sm.stateMachineArn,
});


app.synth();
