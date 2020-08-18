import * as path from 'path';
import { IVpc, ISecurityGroup, SubnetSelection } from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import { Construct, Duration, NestedStack } from '@aws-cdk/core';
import * as cr from '@aws-cdk/custom-resources';
import { KubectlLayer } from './kubectl-layer';

export interface KubectlProviderProps {

  /**
   * Connect the provider to a VPC.
   *
   * @default - no vpc attachement.
   */
  readonly vpc?: IVpc;

  /**
   * Select the Vpc subnets to attach to the provider.
   *
   * @default - no subnets.
   */
  readonly vpcSubnets?: SubnetSelection;

  /**
   * Attach security groups to the provider.
   *
   * @default - no security groups.
   */
  readonly securityGroups?: ISecurityGroup[];

  /**
   * Environment variables to inject to the provider function.
   */
  readonly env?: { [key: string]: string };

}

export class KubectlProvider extends NestedStack {
  /**
   * The custom resource provider.
   */
  public readonly provider: cr.Provider;

  /**
   * The IAM role used to execute this provider.
   */
  public readonly role: iam.IRole;

  public constructor(scope: Construct, id: string, props: KubectlProviderProps = { }) {
    super(scope, id);

    const handler = new lambda.Function(this, 'Handler', {
      code: lambda.Code.fromAsset(path.join(__dirname, 'kubectl-handler')),
      runtime: lambda.Runtime.PYTHON_3_7,
      handler: 'index.handler',
      timeout: Duration.minutes(15),
      description: 'onEvent handler for EKS kubectl resource provider',
      layers: [KubectlLayer.getOrCreate(this, { version: '2.0.0' })],
      memorySize: 256,
      vpc: props.vpc,
      securityGroups: props.securityGroups,
      vpcSubnets: props.vpcSubnets,
      environment: props.env,
    });

    this.provider = new cr.Provider(this, 'Provider', {
      onEventHandler: handler,
    });

    this.role = handler.role!;

    this.role.addToPolicy(new iam.PolicyStatement({
      actions: ['eks:DescribeCluster'],
      resources: ['*'],
    }));
  }

  /**
   * The custom resource provider service token.
   */
  public get serviceToken() { return this.provider.serviceToken; }
}
