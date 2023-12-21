import { Construct, IConstruct } from 'constructs';
import { ICluster, Cluster } from './cluster';
import * as iam from '../../aws-iam';
import { Duration, Stack, NestedStack, Names, CfnCondition, Fn, Aws } from '../../core';
import { KubectlFunction } from '../../custom-resource-handlers/dist/aws-eks/kubectl-provider.generated';
import * as cr from '../../custom-resources';
import { AwsCliLayer } from '../../lambda-layer-awscli';
import { KubectlLayer } from '../../lambda-layer-kubectl';

/**
 * Properties for a KubectlProvider
 */
export interface KubectlProviderProps {
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
   * The custom resource provider's service token.
   */
  readonly functionArn: string;

  /**
   * The IAM role to assume in order to perform kubectl operations against this cluster.
   */
  readonly kubectlRoleArn: string;

  /**
   * The IAM execution role of the handler. This role must be able to assume kubectlRoleArn
   */
  readonly handlerRole: iam.IRole;
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
   * The IAM role to assume in order to perform kubectl operations against this cluster.
   */
  readonly roleArn: string;

  /**
   * The IAM execution role of the handler.
   */
  readonly handlerRole: iam.IRole;
}

/**
 * Implementation of Kubectl Lambda
 */
export class KubectlProvider extends NestedStack implements IKubectlProvider {

  /**
   * Take existing provider or create new based on cluster
   *
   * @param scope Construct
   * @param cluster k8s cluster
   */
  public static getOrCreate(scope: Construct, cluster: ICluster) {
    // if this is an "owned" cluster, it has a provider associated with it
    if (cluster instanceof Cluster) {
      return cluster._attachKubectlResourceScope(scope);
    }

    // if this is an imported cluster, it maybe has a predefined kubectl provider?
    if (cluster.kubectlProvider) {
      return cluster.kubectlProvider;
    }

    // if this is an imported cluster and there is no kubectl provider defined, we need to provision a custom resource provider in this stack
    // we will define one per stack for each cluster based on the cluster uniqueid
    const uid = `${Names.nodeUniqueId(cluster.node)}-KubectlProvider`;
    const stack = Stack.of(scope);
    let provider = stack.node.tryFindChild(uid) as KubectlProvider;
    if (!provider) {
      provider = new KubectlProvider(stack, uid, { cluster });
    }

    return provider;
  }

  /**
   * Import an existing provider
   *
   * @param scope Construct
   * @param id an id of resource
   * @param attrs attributes for the provider
   */
  public static fromKubectlProviderAttributes(scope: Construct, id: string, attrs: KubectlProviderAttributes): IKubectlProvider {
    return new ImportedKubectlProvider(scope, id, attrs);
  }

  /**
   * The custom resource provider's service token.
   */
  public readonly serviceToken: string;

  /**
   * The IAM role to assume in order to perform kubectl operations against this cluster.
   */
  public readonly roleArn: string;

  /**
   * The IAM execution role of the handler.
   */
  public readonly handlerRole: iam.IRole;

  public constructor(scope: Construct, id: string, props: KubectlProviderProps) {
    super(scope, id);

    const cluster = props.cluster;

    if (!cluster.kubectlRole) {
      throw new Error('"kubectlRole" is not defined, cannot issue kubectl commands against this cluster');
    }

    if (cluster.kubectlPrivateSubnets && !cluster.kubectlSecurityGroup) {
      throw new Error('"kubectlSecurityGroup" is required if "kubectlSubnets" is specified');
    }

    const memorySize = cluster.kubectlMemory ? cluster.kubectlMemory.toMebibytes() : 1024;

    const handler = new KubectlFunction(this, 'Handler', {
      timeout: Duration.minutes(15),
      description: 'onEvent handler for EKS kubectl resource provider',
      memorySize,
      environment: cluster.kubectlEnvironment,
      role: cluster.kubectlLambdaRole ? cluster.kubectlLambdaRole : undefined,

      // defined only when using private access
      vpc: cluster.kubectlPrivateSubnets ? cluster.vpc : undefined,
      securityGroups: cluster.kubectlPrivateSubnets && cluster.kubectlSecurityGroup ? [cluster.kubectlSecurityGroup] : undefined,
      vpcSubnets: cluster.kubectlPrivateSubnets ? { subnets: cluster.kubectlPrivateSubnets } : undefined,
    });

    // allow user to customize the layers with the tools we need
    handler.addLayers(props.cluster.awscliLayer ?? new AwsCliLayer(this, 'AwsCliLayer'));
    handler.addLayers(props.cluster.kubectlLayer ?? new KubectlLayer(this, 'KubectlLayer'));

    this.handlerRole = handler.role!;

    this.handlerRole.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['eks:DescribeCluster'],
      resources: [cluster.clusterArn],
    }));

    // taken from the lambda default role logic.
    // makes it easier for roles to be passed in.
    if (handler.isBoundToVpc) {
      handler.role?.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaVPCAccessExecutionRole'));
    }

    // For OCI helm chart authorization.
    this.handlerRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2ContainerRegistryReadOnly'),
    );

    /**
     * For OCI helm chart public ECR authorization. As ECR public is only available in `aws` partition,
     * we conditionally attach this policy when the AWS partition is `aws`.
     */
    const hasEcrPublicCondition = new CfnCondition(this.handlerRole.node.scope!, 'HasEcrPublic', {
      expression: Fn.conditionEquals(Aws.PARTITION, 'aws'),
    });

    const conditionalPolicy = iam.ManagedPolicy.fromManagedPolicyArn(this, 'ConditionalPolicyArn',
      Fn.conditionIf(hasEcrPublicCondition.logicalId,
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonElasticContainerRegistryPublicReadOnly').managedPolicyArn,
        Aws.NO_VALUE).toString(),
    );

    this.handlerRole.addManagedPolicy(iam.ManagedPolicy.fromManagedPolicyArn(this, 'conditionalPolicy', conditionalPolicy.managedPolicyArn));

    // allow this handler to assume the kubectl role
    cluster.kubectlRole.grant(this.handlerRole, 'sts:AssumeRole');

    const provider = new cr.Provider(this, 'Provider', {
      onEventHandler: handler,
      vpc: cluster.kubectlPrivateSubnets ? cluster.vpc : undefined,
      vpcSubnets: cluster.kubectlPrivateSubnets ? { subnets: cluster.kubectlPrivateSubnets } : undefined,
      securityGroups: cluster.kubectlPrivateSubnets && cluster.kubectlSecurityGroup ? [cluster.kubectlSecurityGroup] : undefined,
    });

    this.serviceToken = provider.serviceToken;
    this.roleArn = cluster.kubectlRole.roleArn;
  }

}

class ImportedKubectlProvider extends Construct implements IKubectlProvider {

  /**
   * The custom resource provider's service token.
   */
  public readonly serviceToken: string;

  /**
   * The IAM role to assume in order to perform kubectl operations against this cluster.
   */
  public readonly roleArn: string;

  /**
   * The IAM execution role of the handler.
   */
  public readonly handlerRole: iam.IRole;

  constructor(scope: Construct, id: string, props: KubectlProviderAttributes) {
    super(scope, id);

    this.serviceToken = props.functionArn;
    this.roleArn = props.kubectlRoleArn;
    this.handlerRole = props.handlerRole;
  }
}
