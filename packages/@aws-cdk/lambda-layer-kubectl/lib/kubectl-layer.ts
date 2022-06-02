// import * as crypto from 'crypto';
// import * as fs from 'fs';
import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import { Construct } from 'constructs';

/**
 * KubectlLayerProps 
 */
export interface KubectlLayerProps {
  /**
   * Kubectl Version which is actually a version of EKS cluster.
   */
  readonly kubectlVersion: string;
}

/**
 * An AWS Lambda layer that includes `kubectl` and `helm`.
 */
export class KubectlLayer extends lambda.LayerVersion {
  constructor(scope: Construct, id: string, props: KubectlLayerProps) {
    super(scope, id, {
      code: lambda.Code.fromDockerBuild(path.join(__dirname, '..', 'layer'), {
        buildArgs: {
          KUBECTL_VERSION: props.kubectlVersion,
          HELM_VERSION: '3.8.2',
        },
      }),
      description: `/opt/kubectl/kubectl (${props.kubectlVersion}) and /opt/helm/helm`,
    });
  }
}