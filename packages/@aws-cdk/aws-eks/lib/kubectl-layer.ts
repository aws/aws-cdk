import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import { Construct } from 'constructs';

/**
 * An AWS Lambda layer that includes kubectl and the AWS CLI.
 */
export class KubectlLayer extends lambda.LayerVersion {
  constructor(scope: Construct, id: string) {
    super(scope, id, {
      code: lambda.Code.fromAsset(path.join(__dirname, 'kubectl-layer.zip')),
      description: 'Tools required for interacting with the EKS cluster (kubectl, helm and the AWS CLI)',
    });
  }
}
