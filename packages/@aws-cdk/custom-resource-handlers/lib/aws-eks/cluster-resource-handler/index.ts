/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
import { EKS } from '@aws-sdk/client-eks';
// eslint-disable-next-line import/no-extraneous-dependencies
import { fromTemporaryCredentials } from '@aws-sdk/credential-providers';
// eslint-disable-next-line import/no-extraneous-dependencies
import { NodeHttpHandler } from '@aws-sdk/node-http-handler';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ProxyAgent } from 'proxy-agent';
import { ClusterResourceHandler } from './cluster';
import { EksClient } from './common';
import * as consts from './consts';
import { FargateProfileResourceHandler } from './fargate';
import { IsCompleteResponse } from 'aws-cdk-lib/custom-resources/lib/provider-framework/types';

const proxyAgent = new ProxyAgent();
const awsConfig = {
  logger: console,
  requestHandler: new NodeHttpHandler({
    httpAgent: proxyAgent,
    httpsAgent: proxyAgent,
  }) as any,
};

let eks: EKS | undefined;

const defaultEksClient: EksClient = {
  createCluster: req => getEksClient().createCluster(req),
  deleteCluster: req => getEksClient().deleteCluster(req),
  describeCluster: req => getEksClient().describeCluster(req),
  describeUpdate: req => getEksClient().describeUpdate(req),
  updateClusterConfig: req => getEksClient().updateClusterConfig(req),
  updateClusterVersion: req => getEksClient().updateClusterVersion(req),
  createFargateProfile: req => getEksClient().createFargateProfile(req),
  deleteFargateProfile: req => getEksClient().deleteFargateProfile(req),
  describeFargateProfile: req => getEksClient().describeFargateProfile(req),
  configureAssumeRole: (req) => {
    eks = new EKS({
      ...awsConfig,
      credentials: fromTemporaryCredentials({
        params: req,
      }),
    });
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
