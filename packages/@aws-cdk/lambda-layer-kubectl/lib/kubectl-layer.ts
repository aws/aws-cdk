import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import { Construct } from 'constructs';

/**
 * An AWS Lambda layer that includes `kubectl` and `helm`.
 */
export class KubectlLayer extends lambda.LayerVersion {
  constructor(scope: Construct, id: string) {
    super(scope, id, {
      code: lambda.Code.fromAsset(path.join(__dirname, 'layer.zip')),
      description: '/opt/kubectl/kubectl and /opt/helm/helm',
    });
  }
}
