// tslint:disable:no-console

import { IsCompleteResponse } from '@aws-cdk/custom-resources/lib/provider-framework/types';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as aws from 'aws-sdk';
import { ClusterResourceHandler } from './cluster';
import { EksClient } from './common';
import * as consts from './consts';
import { FargateProfileResourceHandler } from './fargate';
import { OpenIDConnectProviderResourceHandler } from './oidcprovider';
import { OpenIDConnectRoleResourceHandler } from './oidcrole';

aws.config.logger = console;

let eks: aws.EKS | undefined;
let iam: aws.IAM | undefined;

const defaultEksClient: EksClient = {
  createCluster: req => getEksClient().createCluster(req).promise(),
  deleteCluster: req => getEksClient().deleteCluster(req).promise(),
  describeCluster: req => getEksClient().describeCluster(req).promise(),
  updateClusterConfig: req => getEksClient().updateClusterConfig(req).promise(),
  updateClusterVersion: req => getEksClient().updateClusterVersion(req).promise(),
  createFargateProfile: req => getEksClient().createFargateProfile(req).promise(),
  deleteFargateProfile: req => getEksClient().deleteFargateProfile(req).promise(),
  describeFargateProfile: req => getEksClient().describeFargateProfile(req).promise(),
  createOpenIDConnectProvider: req => getIamClient().createOpenIDConnectProvider(req).promise(),
  deleteOpenIDConnectProvider: req => getIamClient().deleteOpenIDConnectProvider(req).promise(),
  getOpenIDConnectProvider: req => getIamClient().getOpenIDConnectProvider(req).promise(),
  getRole: req => getIamClient().getRole(req).promise(),
  updateRole: req => getIamClient().updateRole(req).promise(),
  configureAssumeRole: req => {
    console.log(JSON.stringify({ assumeRole: req }, undefined, 2));
    const creds = new aws.ChainableTemporaryCredentials({
      params: req
    });

    eks = new aws.EKS({ credentials: creds });
    iam = new aws.IAM({ credentials: creds });
  }
};

function getEksClient() {
  if (!eks) {
    throw new Error(`EKS client not initialized (call "configureAssumeRole")`);
  }

  return eks;
}

function getIamClient() {
  if (!iam) {
    throw new Error(`IAM client not initialized (call "configureAssumeRole")`);
  }

  return iam;
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
    case consts.OPENIDCONNECT_PROVIDER_RESOURCE_TYPE: return new OpenIDConnectProviderResourceHandler(defaultEksClient, event);
    case consts.OPENIDCONNECT_ROLE_RESOURCE_TYPE: return new OpenIDConnectRoleResourceHandler(defaultEksClient, event);
    default:
      throw new Error(`Unsupported resource type "${event.ResourceType}`);
  }
}