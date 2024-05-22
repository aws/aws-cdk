import {
  App, Stack, StackProps,
  aws_eks as eks,
  aws_ec2 as ec2,
  aws_iam as iam,
} from 'aws-cdk-lib';
import { getClusterVersionConfig } from './integ-tests-kubernetes-version';
import { Construct } from 'constructs';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

export interface ClusterStackProps extends StackProps {
  readonly vpc?: ec2.IVpc;
  readonly mastersRole?: iam.IRole;
  readonly trustedArn?: string;
  readonly authenticationMode?: eks.AuthenticationMode;
  readonly defaultCapacity?: number;
}

export class ClusterStack extends Stack {
  public readonly cluster: eks.Cluster;
  public readonly mastersRole: iam.IRole;
  public readonly otherClusterAdminRole: iam.IRole;
  public readonly viewerRole: iam.IRole;
  public readonly allPoliciesRole: iam.IRole;
  public readonly vpc: ec2.IVpc;
  private readonly namespaceScopeOptions: eks.AccessPolicyNameOptions;
  private readonly clusterScopeOptions: eks.AccessPolicyNameOptions;

  constructor(scope: Construct, id: string, props?: ClusterStackProps) {
    super(scope, id, props);

    this.vpc = props?.vpc ?? new ec2.Vpc(this, 'Vpc', { natGateways: 1 });

    this.mastersRole = new iam.Role(this, 'clusterAdminRole', {
      assumedBy: props?.trustedArn ?
        new iam.ArnPrincipal(props?.trustedArn) : new iam.AccountRootPrincipal(),
    });

    this.otherClusterAdminRole = new iam.Role(this, 'otherClusterAdminRole', {
      assumedBy: props?.trustedArn ?
        new iam.ArnPrincipal(props?.trustedArn) : new iam.AccountRootPrincipal(),
    });

    this.viewerRole = new iam.Role(this, 'viewerRole', {
      assumedBy: props?.trustedArn ?
        new iam.ArnPrincipal(props?.trustedArn) : new iam.AccountRootPrincipal(),
    });

    this.allPoliciesRole = new iam.Role(this, 'allPoliciesRole', {
      assumedBy: props?.trustedArn ?
        new iam.ArnPrincipal(props?.trustedArn) : new iam.AccountRootPrincipal(),
    });

    this.cluster = new eks.Cluster(this, 'Cluster', {
      vpc: this.vpc,
      mastersRole: props?.mastersRole ?? this.mastersRole,
      ...getClusterVersionConfig(this, eks.KubernetesVersion.V1_29),
      authenticationMode: props?.authenticationMode,
      defaultCapacity: props?.defaultCapacity,
    });

    // common options for namespaces access scope
    this.namespaceScopeOptions = {
      accessScopeType: eks.AccessScopeType.NAMESPACE,
      namespaces: ['foo', 'bar'],
    };
    // common options for cluster access scope
    this.clusterScopeOptions = {
      accessScopeType: eks.AccessScopeType.CLUSTER,
    };

  }
  public assertGrantToOtherClusterAdminRole() {
    // grantAccess to otherClusterAdminRole
    this.cluster.grantAccess('otherClusterAdminRoleAccess', this.otherClusterAdminRole.roleArn, [
      eks.AccessPolicy.fromAccessPolicyName('AmazonEKSClusterAdminPolicy', { ...this.clusterScopeOptions }),
    ]);
  }
  public assertGrantToViewerRole() {
    // grantAccess to viewerRole
    this.cluster.grantAccess('viewerRoleAccess', this.viewerRole.roleArn, [
      eks.AccessPolicy.fromAccessPolicyName('AmazonEKSAdminViewPolicy', { ...this.namespaceScopeOptions }),
    ]);
  }
  public assertGrantToAllPoliciesRole() {
    // grantAccess to viewerRole
    this.cluster.grantAccess('allPoliciesRoleAccess', this.allPoliciesRole.roleArn, [
      eks.AccessPolicy.fromAccessPolicyName('AmazonEKSClusterAdminPolicy', { ...this.clusterScopeOptions }), // CLUSTER scope
      eks.AccessPolicy.fromAccessPolicyName('AmazonEKSAdminPolicy', { ...this.namespaceScopeOptions }), // NAMESPACE scope
      eks.AccessPolicy.fromAccessPolicyName('AmazonEKSAdminViewPolicy', { ...this.namespaceScopeOptions }), // NAMESPACE scope
      eks.AccessPolicy.fromAccessPolicyName('AmazonEKSEditPolicy', { ...this.namespaceScopeOptions }), // NAMESPACE scope
      eks.AccessPolicy.fromAccessPolicyName('AmazonEKSViewPolicy', { ...this.namespaceScopeOptions }), // NAMESPACE scope
    ]);
  }
}

const app = new App();

// create a cluster that supports API only
const stack1 = new ClusterStack(app, 'integ-eks-stack1', {
  authenticationMode: eks.AuthenticationMode.API,
});

stack1.assertGrantToOtherClusterAdminRole();
stack1.assertGrantToViewerRole();
stack1.assertGrantToAllPoliciesRole();

// create a cluster that supports API_AND_CONFIG_MAP
const stack2 = new ClusterStack(app, 'integ-eks-stack2', {
  authenticationMode: eks.AuthenticationMode.API_AND_CONFIG_MAP,
  vpc: stack1.vpc,
});

stack2.assertGrantToOtherClusterAdminRole();
stack2.assertGrantToViewerRole();
stack2.assertGrantToAllPoliciesRole();

// create a cluster that supports CONFIG_MAP only
const stack3 = new ClusterStack(app, 'integ-eks-stack3', {
  authenticationMode: eks.AuthenticationMode.CONFIG_MAP,
  vpc: stack1.vpc,
});

// create a cluster with authenticationMode undefined
const stack4 = new ClusterStack(app, 'integ-eks-stack4', {
  vpc: stack1.vpc,
});

new IntegTest(app, 'access-entry-test', {
  testCases: [stack1, stack2, stack3, stack4],
  cdkCommandOptions: {
    deploy: {
      args: {
        rollback: false,
        concurrency: 4,
        stacks: ['integ-eks-stack1', 'integ-eks-stack2', 'integ-eks-stack3', 'integ-eks-stack4'],
      },
    },
  },
});
