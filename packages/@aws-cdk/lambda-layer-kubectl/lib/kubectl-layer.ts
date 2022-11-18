import { ASSET_FILE, LAYER_SOURCE_DIR } from '@aws-cdk/asset-kubectl-v20';
import * as lambda from '@aws-cdk/aws-lambda';
import { FileSystem } from '@aws-cdk/core';
import { Construct } from 'constructs';

/**
 * An AWS Lambda layer that includes `kubectl` and `helm`.
 */
export class KubectlLayer extends lambda.LayerVersion {
  constructor(scope: Construct, id: string) {
    super(scope, id, {
      code: lambda.Code.fromAsset(ASSET_FILE, {
        // we hash the layer directory (it contains the tools versions and Dockerfile) because hashing the zip is non-deterministic
        assetHash: FileSystem.fingerprint(LAYER_SOURCE_DIR),
      }),
      description: '/opt/kubectl/kubectl and /opt/helm/helm',
    });
  }
}
