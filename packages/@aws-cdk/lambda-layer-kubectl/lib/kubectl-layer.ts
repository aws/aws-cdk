import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import { Construct } from 'constructs';

/**
 * KubectlLayerProps 
 */
export interface KubectlLayerProps {
  /**
   * Kubectl Version which is actually a version of k8s the EKS cluster is running.
   */
  readonly kubectlVersion?: string;

  /**
   * Helm Charts version
   */
  readonly helmVersion?: string;
}

/**
 * An AWS Lambda layer that includes `kubectl` and `helm`.
 */
export class KubectlLayer extends lambda.LayerVersion {
  constructor(scope: Construct, id: string, props?: KubectlLayerProps) {
    super(scope, id, {
      code: lambda.Code.fromDockerBuild(path.join(__dirname, '..', 'layer'), {
        buildArgs: {
          KUBECTL_VERSION: props?.kubectlVersion ?? '1.20.0',
          HELM_VERSION: props?.helmVersion ?? '3.8.2',
        },
      }),
      description: `/opt/kubectl/kubectl and /opt/helm/helm`,
    });
  }
}