import * as lambda from 'aws-cdk-lib/aws-lambda';
import { KubectlV24Layer } from '@aws-cdk/lambda-layer-kubectl-v24';
import { KubectlV29Layer } from '@aws-cdk/lambda-layer-kubectl-v29';
import { Construct } from 'constructs';
import * as eks from 'aws-cdk-lib/aws-eks';

const versionMap: { [key: string]: any } = {
  1.24: KubectlV24Layer,
  1.29: KubectlV29Layer,
};

export function getClusterVersionConfig(scope: Construct, version?: eks.KubernetesVersion) {
  const _version = version ?? eks.KubernetesVersion.V1_24;
  return {
    version: _version,
    // Crazy type-casting is required because KubectlLayer peer depends on
    // types from aws-cdk-lib, but we run integration tests in the @aws-cdk/
    // v1-style directory, not in the aws-cdk-lib v2-style directory.
    // kubectlLayer: new KubectlV24Layer(scope, 'KubectlLayer') as unknown as lambda.ILayerVersion,
    kubectlLayer: new versionMap[_version.version](scope, 'KubectlLayer') as unknown as lambda.ILayerVersion,
  };
};