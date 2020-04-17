import { NestedStack } from '@aws-cdk/aws-cloudformation';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import { Construct, Duration } from '@aws-cdk/core';
import * as cr from '@aws-cdk/custom-resources';
import * as path from 'path';
import { KubectlLayer } from './kubectl-layer';

export class KubectlProvider extends NestedStack {
  /**
   * The custom resource provider.
   */
  public readonly provider: cr.Provider;

  /**
   * The IAM role used to execute this provider.
   */
  public readonly role: iam.IRole;

  public constructor(scope: Construct, id: string) {
    super(scope, id);

    const handler = new lambda.Function(this, 'Handler', {
      code: lambda.Code.fromAsset(path.join(__dirname, 'kubectl-handler')),
      runtime: lambda.Runtime.PYTHON_3_7,
      handler: 'index.handler',
      timeout: Duration.minutes(15),
      layers: [ KubectlLayer.getOrCreate(this, { version: '2.0.0-beta2' }) ],
      memorySize: 256,
    });

    this.provider = new cr.Provider(this, 'Provider', {
      onEventHandler: handler
    });

    this.role = handler.role!;

    this.role.addToPolicy(new iam.PolicyStatement({
      actions: [ 'eks:DescribeCluster' ],
      resources: [ '*' ]
    }));
  }
}
