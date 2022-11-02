import * as lambda from '@aws-cdk/aws-lambda';
import { KubectlV23Layer } from '@aws-cdk/lambda-layer-kubectl-v23';
import { Construct } from 'constructs';
import * as eks from '../lib';

export function getClusterVersionConfig(scope: Construct) {
  return {
    version: eks.KubernetesVersion.V1_23,
    // Crazy type-casting is required because KubectlLayer peer depends on
    // types from aws-cdk-lib, but we run integration tests in the @aws-cdk/
    // v1-style directory, not in the aws-cdk-lib v2-style directory.
    kubectlLayer: new KubectlV23Layer(scope, 'KubectlLayer') as unknown as lambda.ILayerVersion,
  };
};