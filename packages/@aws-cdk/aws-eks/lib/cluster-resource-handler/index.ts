/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
import { IsCompleteResponse } from '@aws-cdk/custom-resources/lib/provider-framework/types';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as aws from 'aws-sdk';
import { ClusterResourceHandler } from './cluster';
import { EksClient } from './common';
import * as consts from './consts';
import { FargateProfileResourceHandler } from './fargate';

// eslint-disable-next-line @typescript-eslint/no-require-imports, import/no-extraneous-dependencies
const ProxyAgent = require('proxy-agent');

aws.config.logger = console;
aws.config.update({
  httpOptions: { agent: new ProxyAgent() },
});

let eks: aws.EKS | undefined;

const defaultEksClient: EksClient = {
  createCluster: req => getEksClient().createCluster(req).promise(),
  deleteCluster: req => getEksClient().deleteCluster(req).promise(),
  describeCluster: req => getEksClient().describeCluster(req).promise(),
  describeUpdate: req => getEksClient().describeUpdate(req).promise(),
  updateClusterConfig: req => getEksClient().updateClusterConfig(req).promise(),
  updateClusterVersion: req => getEksClient().updateClusterVersion(req).promise(),
  createFargateProfile: req => getEksClient().createFargateProfile(req).promise(),
  deleteFargateProfile: req => getEksClient().deleteFargateProfile(req).promise(),
  describeFargateProfile: req => getEksClient().describeFargateProfile(req).promise(),
  configureAssumeRole: req => {
    console.log(JSON.stringify({ assumeRole: req }, undefined, 2));
    const creds = new aws.ChainableTemporaryCredentials({
      params: req,
      stsConfig: { stsRegionalEndpoints: 'regional' },
    });

    eks = new aws.EKS({ credentials: creds });
  },
};

function getEksClient() {
  if (!eks) {
    throw new Error('EKS client not initialized (call "configureAssumeRole")');
  }

  return eks;
}

export async function onEvent(event: AWSLambda.CloudFormationCustomResourceEvent) {
  const provider = createResourceHandler(event);
  return provider.onEvent();
}

export async function isComplete(event: AWSLambda.CloudFormationCustomResourceEvent): Promise<IsCompleteResponse> {
  const provider = createResourceHandler(event);
  return provider.isComplete();
}

function createResourceHandler(event: AWSLambda.CloudFormationCustomResourceEvent) {
  switch (event.ResourceType) {
    case consts.CLUSTER_RESOURCE_TYPE: return new ClusterResourceHandler(defaultEksClient, event);
    case consts.FARGATE_PROFILE_RESOURCE_TYPE: return new FargateProfileResourceHandler(defaultEksClient, event);
    default:
      throw new Error(`Unsupported resource type "${event.ResourceType}`);
  }
}
