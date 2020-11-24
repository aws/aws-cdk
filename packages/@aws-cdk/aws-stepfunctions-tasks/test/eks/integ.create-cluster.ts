import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import { EksCreateCluster, VpcConfigRequest } from '../../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-tasks-eks-create-cluster-integ');

const resourcesVpcConfiguration : VpcConfigRequest = {
  subnetIds: ['<PUBSUBNET_AZ_1>', '<PUBSUBNET_AZ_2>'],
  endpointPublicAccess: true,
  endpointPrivateAccess: false,
};

const createClusterJob = new EksCreateCluster(stack, 'Create a Cluster', {
  name: 'clusterName',
  role: '*',
  resourcesVpcConfig: resourcesVpcConfiguration,
});

const chain = sfn.Chain.start(createClusterJob);

const sm = new sfn.StateMachine(stack, 'StateMachine', {
  definition: chain,
  timeout: cdk.Duration.seconds(30),
});

new cdk.CfnOutput(stack, 'stateMachineArn', {
  value: sm.stateMachineArn,
});


app.synth();
