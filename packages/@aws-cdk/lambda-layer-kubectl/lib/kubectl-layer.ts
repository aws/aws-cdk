import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import { Construct } from 'constructs';

/**
 * KubectlLayerProps
 */
export interface KubectlLayerProps {
  /**
   * Kubectl Version which is actually a version of k8s the EKS cluster is running.
   * @default 1.20.15
   */
  readonly kubectlVersion?: string;

  /**
   * Helm Charts version
   * @default 3.9.0
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
          KUBECTL_VERSION: props?.kubectlVersion ?? '1.20.15',
          HELM_VERSION: props?.helmVersion ?? '3.9.0',
        },
      }),
      description: '/opt/kubectl/kubectl and /opt/helm/helm',
    });
  }
}