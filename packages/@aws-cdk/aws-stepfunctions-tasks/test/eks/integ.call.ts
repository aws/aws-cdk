/// !cdk-integ pragma:disable-update-workflow
import * as eks from '@aws-cdk/aws-eks';
import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import { EksCall, HttpMethods } from '../../lib';

/*
 * Create a state machine with a task state to use the Kubernetes API to read Kubernetes resource objects
 * via a Kubernetes API endpoint.
 *
 * Stack verification steps:
 * The generated State Machine can be executed from the CLI (or Step Functions console)
 * and runs with an execution status of `Succeeded`.
 *
 * -- aws stepfunctions start-execution --state-machine-arn <state-machine-arn-from-output> provides execution arn
 * -- aws stepfunctions describe-execution --execution-arn <state-machine-arn-from-output> returns a status of `Succeeded`
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-tasks-eks-call-integ');

const cluster = new eks.Cluster(stack, 'EksCluster', {
  version: eks.KubernetesVersion.V1_21,
  clusterName: 'eksCluster',
});

const executionRole = new iam.Role(stack, 'Role', {
  roleName: 'stateMachineExecutionRole',
  assumedBy: new iam.ServicePrincipal('states.amazonaws.com'),
});

cluster.awsAuth.addMastersRole(executionRole);

const callJob = new EksCall(stack, 'Call a EKS Endpoint', {
  cluster: cluster,
  httpMethod: HttpMethods.GET,
  httpPath: '/api/v1/namespaces/default/pods',
});

const chain = sfn.Chain.start(callJob);

const sm = new sfn.StateMachine(stack, 'StateMachine', {
  definition: chain,
  role: executionRole,
  timeout: cdk.Duration.seconds(30),
});

new cdk.CfnOutput(stack, 'stateMachineArn', {
  value: sm.stateMachineArn,
});

app.synth();
