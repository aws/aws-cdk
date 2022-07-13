import * as path from 'path';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import { Duration, NestedStack, Stack } from '@aws-cdk/core';
import * as cr from '@aws-cdk/custom-resources';
import { NodeProxyAgentLayer } from '@aws-cdk/lambda-layer-node-proxy-agent';
import { Construct } from 'constructs';

const HANDLER_DIR = path.join(__dirname, 'cluster-resource-handler');
const HANDLER_RUNTIME = lambda.Runtime.NODEJS_14_X;

export interface ClusterResourceProviderProps {
  /**
   * The IAM role to assume in order to interact with the cluster.
   */
  readonly adminRole: iam.IRole;

  /**
   * The VPC to provision the functions in.
   */
  readonly vpc?: ec2.IVpc;

  /**
   * The subnets to place the functions in.
   */
  readonly subnets?: ec2.ISubnet[];

  /**
   * Environment to add to the handler.
   */
  readonly environment?: { [key: string]: string };

  /**
   * An AWS Lambda layer that includes the NPM dependency `proxy-agent`.
   *
   * If not defined, a default layer will be used.
   */
  readonly onEventLayer?: lambda.ILayerVersion;

  /**
   * The security group to associate with the functions.
   *
   * @default - No security group.
   */
  readonly securityGroup?: ec2.ISecurityGroup;
}

/**
 * A custom resource provider that handles cluster operations. It serves
 * multiple custom resources such as the cluster resource and the fargate
 * resource.
 *
 * @internal
 */
export class ClusterResourceProvider extends NestedStack {

  public static getOrCreate(scope: Construct, props: ClusterResourceProviderProps) {
    const stack = Stack.of(scope);
    const uid = '@aws-cdk/aws-eks.ClusterResourceProvider';
    return stack.node.tryFindChild(uid) as ClusterResourceProvider ?? new ClusterResourceProvider(stack, uid, props);
  }

  /**
   * The custom resource provider to use for custom resources.
   */
  public readonly provider: cr.Provider;

  private constructor(scope: Construct, id: string, props: ClusterResourceProviderProps) {
    super(scope, id);

    // The NPM dependency proxy-agent is required in order to support proxy routing with the AWS JS SDK.
    const nodeProxyAgentLayer = new NodeProxyAgentLayer(this, 'NodeProxyAgentLayer');

    const onEvent = new lambda.Function(this, 'OnEventHandler', {
      code: lambda.Code.fromAsset(HANDLER_DIR),
      description: 'onEvent handler for EKS cluster resource provider',
      runtime: HANDLER_RUNTIME,
      environment: {
        AWS_STS_REGIONAL_ENDPOINTS: 'regional',
        ...props.environment,
      },
      handler: 'index.onEvent',
      timeout: Duration.minutes(1),
      vpc: props.subnets ? props.vpc : undefined,
      vpcSubnets: props.subnets ? { subnets: props.subnets } : undefined,
      securityGroups: props.securityGroup ? [props.securityGroup] : undefined,
      // Allow user to override the layer.
      layers: props.onEventLayer ? [props.onEventLayer] : [nodeProxyAgentLayer],
    });

    const isComplete = new lambda.Function(this, 'IsCompleteHandler', {
      code: lambda.Code.fromAsset(HANDLER_DIR),
      description: 'isComplete handler for EKS cluster resource provider',
      runtime: HANDLER_RUNTIME,
      environment: {
        AWS_STS_REGIONAL_ENDPOINTS: 'regional',
        ...props.environment,
      },
      handler: 'index.isComplete',
      timeout: Duration.minutes(1),
      vpc: props.subnets ? props.vpc : undefined,
      vpcSubnets: props.subnets ? { subnets: props.subnets } : undefined,
      securityGroups: props.securityGroup ? [props.securityGroup] : undefined,
      layers: [nodeProxyAgentLayer],
    });

    this.provider = new cr.Provider(this, 'Provider', {
      onEventHandler: onEvent,
      isCompleteHandler: isComplete,
      totalTimeout: Duration.hours(1),
      queryInterval: Duration.minutes(1),
      vpc: props.subnets ? props.vpc : undefined,
      vpcSubnets: props.subnets ? { subnets: props.subnets } : undefined,
      securityGroups: props.securityGroup ? [props.securityGroup] : undefined,
    });

    props.adminRole.grant(onEvent.role!, 'sts:AssumeRole');
    props.adminRole.grant(isComplete.role!, 'sts:AssumeRole');
  }

  /**
   * The custom resource service token for this provider.
   */
  public get serviceToken() { return this.provider.serviceToken; }
}
