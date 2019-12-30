import * as cfn from '@aws-cdk/aws-cloudformation';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import { Construct, Resource, Stack } from "@aws-cdk/core";
import * as cr from '@aws-cdk/custom-resources';
import * as path from 'path';
import { Cluster } from './cluster';

export interface FargateProfileOptions {
  /**
   * The name of the Fargate profile.
   * @default - generated
   */
  readonly fargateProfileName?: string;

  /**
   * The Amazon Resource Name (ARN) of the pod execution role to use for pods
   * that match the selectors in the Fargate profile. The pod execution role
   * allows Fargate infrastructure to register with your cluster as a node, and
   * it provides read access to Amazon ECR image repositories.
   *
   * @see https://docs.aws.amazon.com/eks/latest/userguide/pod-execution-role.html
   * @default - a role will be automatically created
   */
  readonly podExecutionRole?: iam.IRole;

  /**
   * The selectors to match for pods to use this Fargate profile. Each selector
   * must have an associated namespace. Optionally, you can also specify labels
   * for a namespace.
   *
   * You may specify up to five selectors in a Fargate profile.
   */
  readonly selectors?: Selector[];

  /**
   * The VPC from which to select subnets to launch your pods into.
   *
   * By default, all private subnets are selected. You can customize this using
   * `subnetSelection`.
   *
   * @default - pods will not be placed into a VPC
   */
  readonly vpc?: ec2.IVpc;

  /**
   * Select which subnets to launch your pods into. At this time, pods running
   * on Fargate are not assigned public IP addresses, so only private subnets
   * (with no direct route to an Internet Gateway) are allowed.
   *
   * @default - all private subnets of the VPC are selected.
   */
  readonly subnetSelection?: ec2.SubnetSelection;

  /**
   * The metadata to apply to the Fargate profile to assist with categorization
   * and organization. Each tag consists of a key and an optional value, both of
   * which you define. Fargate profile tags do not propagate to any other
   * resources associated with the Fargate profile, such as the pods that are
   * scheduled with it.
   */
  readonly tags?: { [name: string]: string };
}

export interface FargateProfileProps extends FargateProfileOptions {
  /**
   * The EKS cluster to apply the Fargate profile to.
   */
  readonly cluster: Cluster;
}

export interface Selector {
  /**
   * The Kubernetes namespace that the selector should match.
   */
  readonly namespace?: string;

  /**
   * The Kubernetes labels that the selector should match. A pod must contain
   * all of the labels that are specified in the selector for it to be
   * considered a match.
   */
  readonly labels?: { [key: string]: string };
}

export class FargateProfile extends Resource {

  /**
   * @attribute
   */
  public readonly fargateProfileArn: string;

  /**
   * @attribute
   */
  public readonly fargateProfileName: string;

  constructor(scope: Construct, id: string, props: FargateProfileProps) {
    super(scope, id, {
      physicalName: props.fargateProfileName
    });

    const role = props.podExecutionRole ?? new iam.Role(this, 'PodExecutionRole', {
      assumedBy: new iam.ServicePrincipal('eks-fargate-pods.amazonaws.com'),
      managedPolicies: [ iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKSFargatePodExecutionRolePolicy') ]
    });

    let subnets: string[] | undefined;
    if (props.vpc) {
      const selection: ec2.SubnetSelection = props.subnetSelection ?? { subnetType: ec2.SubnetType.PRIVATE };
      subnets = props.vpc.selectSubnets(selection).subnetIds;
    }

    const resource = new cfn.CustomResource(this, 'Resource', {
      provider: Provider.getOrCreate(this).provider,
      resourceType: 'Custom::AWSCDK-EKS-FargateProfile',
      properties: {
        Config: {
          clusterName: props.cluster.clusterName,
          fargateProfileName: this.physicalName,
          podExecutionRole: role.roleArn,
          selectors: props.selectors,
          subnets,
          tags: props.tags
        }
      }
    });

    this.fargateProfileArn = resource.getAttString('fargateProfileArn');
    this.fargateProfileName = resource.ref;
  }
}

export class Provider extends Construct {

  public static getOrCreate(scope: Construct) {
    const stack = Stack.of(scope);
    const uid = '@aws-cdk/aws-eks.FargateProfileResourceProvider';
    return stack.node.tryFindChild(uid) as Provider || new Provider(stack, uid);
  }

  public readonly provider: cr.Provider;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.provider = new cr.Provider(this, 'Provider', {
      onEventHandler: new lambda.Function(this, 'OnEventHandler', {
        code: lambda.Code.fromAsset(path.join(__dirname, 'fargate-profile-resource-handler')),
        runtime: lambda.Runtime.NODEJS_12_X,
        handler: 'index.onEvent'
      }),
      isCompleteHandler: new lambda.Function(this, 'IsCompleteHandler', {
        code: lambda.Code.fromAsset(path.join(__dirname, 'fargate-profile-resource-handler')),
        runtime: lambda.Runtime.NODEJS_12_X,
        handler: 'index.isComplete'
      })
    });
  }
}