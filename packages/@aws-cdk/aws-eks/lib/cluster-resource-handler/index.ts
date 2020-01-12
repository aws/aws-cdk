// tslint:disable:no-console

import { IsCompleteResponse } from '@aws-cdk/custom-resources/lib/provider-framework/types';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as aws from 'aws-sdk';
import { ClusterResourceHandler, EksClient } from './handler';

aws.config.logger = console;

let eks: aws.EKS | undefined;

const defaultEksClient: EksClient = {
  createCluster: req => getEksClient().createCluster(req).promise(),
  deleteCluster: req => getEksClient().deleteCluster(req).promise(),
  describeCluster: req => getEksClient().describeCluster(req).promise(),
  updateClusterConfig: req => getEksClient().updateClusterConfig(req).promise(),
  updateClusterVersion: req => getEksClient().updateClusterVersion(req).promise(),
  configureAssumeRole: req => {
    console.log(JSON.stringify({ assumeRole: req }, undefined, 2));
    const creds = new aws.ChainableTemporaryCredentials({
      params: req
    });

    eks = new aws.EKS({ credentials: creds });
  }
};

function getEksClient() {
  if (!eks) {
    throw new Error(`EKS client not initialized (call "configureAssumeRole")`);
  }

  return eks;
}

export async function onEvent(event: AWSLambda.CloudFormationCustomResourceEvent) {
  const provider = new ClusterResourceHandler(defaultEksClient, event);
  return provider.onEvent();
}

export async function isComplete(event: AWSLambda.CloudFormationCustomResourceEvent): Promise<IsCompleteResponse> {
  const provider = new ClusterResourceHandler(defaultEksClient, event);
  return provider.isComplete();
}
