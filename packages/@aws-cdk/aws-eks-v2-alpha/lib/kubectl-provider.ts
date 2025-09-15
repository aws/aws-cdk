import { Construct, IConstruct } from 'constructs';
import { Cluster, ICluster } from './cluster';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Duration, CfnCondition, Fn, Aws, Size } from 'aws-cdk-lib/core';
import * as cr from 'aws-cdk-lib/custom-resources';
import { AwsCliLayer } from 'aws-cdk-lib/lambda-layer-awscli';
import * as path from 'path';

export interface KubectlProviderOptions {
  /**
   * An IAM role that can perform kubectl operations against this cluster.
   *
   * The role should be mapped to the `system:masters` Kubernetes RBAC role.
   *
   * This role is directly passed to the lambda handler that sends Kube Ctl commands to the cluster.
   * @default - if not specified, the default role created by a lambda function will
   * be used.
   */
  readonly role?: iam.IRole;

  /**
   * An AWS Lambda layer that contains the `aws` CLI.
   *
   * If not defined, a default layer will be used containing the AWS CLI 2.x.
   */
  readonly awscliLayer?: lambda.ILayerVersion;

  /**
   *
   * Custom environment variables when running `kubectl` against this cluster.
   */
  readonly environment?: { [key: string]: string };

  /**
   * A security group to use for `kubectl` execution.
   *
   * @default - If not specified, the k8s endpoint is expected to be accessible
   * publicly.
   */
  readonly securityGroup?: ec2.ISecurityGroup;

  /**
   * The amount of memory allocated to the kubectl provider's lambda function.
   */
  readonly memory?: Size;

  /**
   * An AWS Lambda layer that includes `kubectl` and `helm`
   */
  readonly kubectlLayer: lambda.ILayerVersion;

  /**
   * Subnets to host the `kubectl` compute resources. If not specified, the k8s
   * endpoint is expected to be accessible publicly.
   */
  readonly privateSubnets?: ec2.ISubnet[];
}

/**
 * Properties for a KubectlProvider
 */
export interface KubectlProviderProps extends KubectlProviderOptions {
  /**
   * The cluster to control.
   */
  readonly cluster: ICluster;
}

/**
 * Kubectl Provider Attributes
 */
export interface KubectlProviderAttributes {
  /**
   * The kubectl provider lambda arn
   */
  readonly serviceToken: string;

  /**
   * The role of the provider lambda function.
   * Only required if you deploy helm charts using this imported provider.
   *
   * @default - no role.
   */
  readonly role?: iam.IRole;
}

/**
 * Imported KubectlProvider that can be used in place of the default one created by CDK
 */
export interface IKubectlProvider extends IConstruct {
  /**
   * The custom resource provider's service token.
   */
  readonly serviceToken: string;

  /**
   * The role of the provider lambda function. If undefined,
   * you cannot use this provider to deploy helm charts.
   */
  readonly role?: iam.IRole;
}

/**
 * Implementation of Kubectl Lambda
 */
export class KubectlProvider extends Construct implements IKubectlProvider {
  /**
   * Take existing provider on cluster
   *
   * @param scope Construct
   * @param cluster k8s cluster
   */
  public static getKubectlProvider(scope: Construct, cluster: ICluster) {
    // if this is an "owned" cluster, we need to wait for the kubectl barrier
    // before applying any resources.
    if (cluster instanceof Cluster) {
      cluster._dependOnKubectlBarrier(scope);
    }

    return cluster.kubectlProvider;
  }

  /**
   * Import an existing provider
   *
   * @param scope Construct
   * @param id an id of resource
   * @param attrs attributes for the provider
   */
  public static fromKubectlProviderAttributes(scope: Construct, id: string, attrs: KubectlProviderAttributes): IKubectlProvider {
    class Import extends Construct implements IKubectlProvider {
      public readonly serviceToken: string = attrs.serviceToken;
      public readonly role?: iam.IRole = attrs.role;
    }
    return new Import(scope, id);
  }

  /**
   * The custom resource provider's service token.
   */
  public readonly serviceToken: string;

  /**
   * The IAM execution role of the handler.
   */
  public readonly role?: iam.IRole;

  public constructor(scope: Construct, id: string, props: KubectlProviderProps) {
    super(scope, id);

    const vpc = props.privateSubnets ? props.cluster.vpc : undefined;
    let securityGroups;
    if (props.privateSubnets && props.cluster.clusterSecurityGroup) {
      securityGroups = [props.cluster.clusterSecurityGroup];
    }
    const privateSubnets = props.privateSubnets ? { subnets: props.privateSubnets } : undefined;

    const handler = new lambda.Function(this, 'Handler', {
      timeout: Duration.minutes(15),
      description: 'onEvent handler for EKS kubectl resource provider',
      memorySize: props.memory?.toMebibytes() ?? 1024,
      environment: {
        // required and recommended for boto3
        AWS_STS_REGIONAL_ENDPOINTS: 'regional',
        ...props.environment,
      },
      role: props.role,
      code: lambda.Code.fromAsset(path.join(__dirname, 'kubectl-handler')),
      handler: 'index.handler',
      runtime: lambda.Runtime.determineLatestPythonRuntime(this),
      // defined only when using private access
      vpc,
      securityGroups,
      vpcSubnets: privateSubnets,
    });

    // allow user to customize the layers with the tools we need
    handler.addLayers(props.awscliLayer ?? new AwsCliLayer(this, 'AwsCliLayer'));
    handler.addLayers(props.kubectlLayer);

    const handlerRole = handler.role!;

    handlerRole.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['eks:DescribeCluster'],
      resources: [props.cluster.clusterArn],
    }));

    // taken from the lambda default role logic.
    // makes it easier for roles to be passed in.
    if (handler.isBoundToVpc) {
      handlerRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaVPCAccessExecutionRole'));
    }

    // For OCI helm chart authorization.
    handlerRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2ContainerRegistryReadOnly'),
    );

    /**
     * For OCI helm chart public ECR authorization. As ECR public is only available in `aws` partition,
     * we conditionally attach this policy when the AWS partition is `aws`.
     */
    const hasEcrPublicCondition = new CfnCondition(handlerRole.node.scope!, 'HasEcrPublic', {
      expression: Fn.conditionEquals(Aws.PARTITION, 'aws'),
    });

    const conditionalPolicy = iam.ManagedPolicy.fromManagedPolicyArn(this, 'ConditionalPolicyArn',
      Fn.conditionIf(hasEcrPublicCondition.logicalId,
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonElasticContainerRegistryPublicReadOnly').managedPolicyArn,
        Aws.NO_VALUE).toString(),
    );

    handlerRole.addManagedPolicy(iam.ManagedPolicy.fromManagedPolicyArn(this, 'conditionalPolicy', conditionalPolicy.managedPolicyArn));

    const provider = new cr.Provider(this, 'Provider', {
      onEventHandler: handler,
      vpc: props.cluster.vpc,
      vpcSubnets: privateSubnets,
      securityGroups,
    });

    this.serviceToken = provider.serviceToken;
    this.role = handlerRole;
  }
}
