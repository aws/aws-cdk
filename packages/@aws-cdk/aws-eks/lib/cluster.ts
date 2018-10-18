import ec2 = require("@aws-cdk/aws-ec2");
import iam = require("@aws-cdk/aws-iam");
import cdk = require("@aws-cdk/cdk");
import { cloudformation } from "./eks.generated";

// TODO: Option to deploy nodes on creation.
// TODO: Add ability to edit security group rules after nodes are created
//       Such as the rule to allow API traffic from the nodes
// TODO: Add Construct to simplify node creation (see eks example)

/**
 * Properties to instantiate the Cluster
 */
export interface IClusterProps {
  /**
   * The VPC in which to create the Cluster
   */
  vpc: ec2.VpcNetworkRef;
  /**
   * Where to place the cluster within the VPC
   * Which SubnetType this placement falls in
   * @default If not supplied, defaults to public
   * subnets if available otherwise private subnets
   */
  vpcPlacement: ec2.VpcPlacementStrategy;
  /**
   * This provides the physical cfn name of the Cluster.
   * It is not recommended to use an explicit name.
   *
   * @default If you don't specify a clusterName, AWS CloudFormation
   * generates a unique physical ID and uses that ID for the name.
   */
  clusterName?: string;
  /**
   * The Kubernetes version to run in the cluster only 1.10 support today
   *
   * @default If not supplied, will use Amazon default version (1.10.3)
   */
  k8sVersion?: string;
  /**
   * Whether to create the worker nodes with the cluster stack.
   * This is not recommended for production as deleting the stack
   * will delete cluster and nodes, and intent may be to just remove
   * worker nodes from the cluster.
   * This ability is added for development and production clusters
   * to tear down and create full workable clusters easily.
   *
   * @default false
   *
   * Not implemented yet.
   */
  createNodes?: boolean;
}

/**
 * Reference properties used when a cluster is exported or imported
 * with the const a = ClusterRef.import | export methodes
 */
export interface IClusterRefProps {
  /**
   * The physical name of the Cluster
   */
  clusterName: string;
  /**
   * The unique ARN assigned to the service by AWS
   * in the form of arn:aws:eks:
   */
  clusterArn: string;
  /**
   * The API Server endpoint URL
   */
  clusterEndpoint: string;
  /**
   * Reeference the vpc placement for placing nodes into ASG subnets
   */
  vpcPlacement: ec2.VpcPlacementStrategy;
  clusterSecurityGroup: ec2.SecurityGroup;
}

/**
 * A SecurityGroup Reference, object not created with this template.
 */
export abstract class ClusterRef extends cdk.Construct {
  /**
   * Import an existing cluster
   *
   * @param parent the construct parent, in most cases 'this'
   * @param id the id or name to import as
   * @param props the cluster properties to use for importing information
   */
  public static import(
    parent: cdk.Construct,
    id: string,
    props: IClusterRefProps
  ): ClusterRef {
    return new ImportedCluster(parent, id, props);
  }

  public abstract readonly clusterName: string;
  public abstract readonly clusterArn: string;
  public abstract readonly clusterEndpoint: string;
  public abstract readonly vpcPlacement: ec2.VpcPlacementStrategy;
  public abstract readonly clusterSecurityGroup: ec2.SecurityGroup;

  /**
   * Export cluster references to use in other stacks
   */
  public export(): IClusterRefProps {
    return {
      clusterName: this.makeOutput("ClusterName", this.clusterName),
      clusterArn: this.makeOutput("ClusterArn", this.clusterArn),
      clusterEndpoint: this.makeOutput("ClusterEndpoint", this.clusterEndpoint),
      vpcPlacement: this.vpcPlacement,
      clusterSecurityGroup: this.clusterSecurityGroup
    };
  }

  private makeOutput(name: string, value: any): string {
    return new cdk.Output(this, name, { value }).makeImportValue().toString();
  }
}

/**
 * A Cluster represents a managed Kubernetes Service (EKS)
 *
 * This is a fully managed cluster of API Servers (control-plane)
 * The user is still required to create the worker nodes.
 */
export class Cluster extends ClusterRef {
  /**
   * The Name of the created EKS Cluster
   *
   * @type {string}
   * @memberof Cluster
   */
  public readonly clusterName: string;
  /**
   * The AWS generated ARN for the Cluster resource
   *
   * @type {string}
   * @memberof Cluster
   */
  public readonly clusterArn: string;
  /**
   * The endpoint URL for the Cluster
   * This is the URL inside the kubeconfig file to use with kubectl
   *
   * @type {string}
   * @memberof Cluster
   */
  public readonly clusterEndpoint: string;
  /**
   * The VPC Placement strategy for the given cluster
   * PublicSubnets? PrivateSubnets?
   *
   * @type {ec2.VpcPlacementStrategy}
   * @memberof Cluster
   */
  public readonly vpcPlacement: ec2.VpcPlacementStrategy;
  /**
   * The security group attached to the given cluster
   *
   * @type {ec2.SecurityGroup}
   * @memberof Cluster
   */
  public readonly clusterSecurityGroup: ec2.SecurityGroup;

  private readonly vpc: ec2.VpcNetworkRef;
  private readonly cluster: cloudformation.ClusterResource;
  private readonly clusterSubnetIds: string[] = [];

  constructor(parent: cdk.Construct, name: string, props: IClusterProps) {
    super(parent, name);

    this.vpc = props.vpc;
    this.vpcPlacement = props.vpcPlacement;
    const subnets = this.vpc.subnets(this.vpcPlacement);
    subnets.map(s => this.clusterSubnetIds.push(s.subnetId));

    const role = this.createRole();
    this.clusterSecurityGroup = this.addDefaultSecurityGroup();
    const sgId = this.clusterSecurityGroup.securityGroupId;

    const clusterProps: cloudformation.ClusterResourceProps = {
      clusterName: props.clusterName,
      roleArn: role.roleArn,
      version: props.k8sVersion,
      resourcesVpcConfig: {
        securityGroupIds: new Array(sgId),
        subnetIds: this.clusterSubnetIds
      }
    };
    this.cluster = this.createCluster(clusterProps);
    this.clusterName = this.cluster.clusterName;
    this.clusterArn = this.cluster.clusterArn;
    this.clusterEndpoint = this.cluster.clusterEndpoint;
  }

  private createCluster(props: cloudformation.ClusterResourceProps) {
    const cluster = new cloudformation.ClusterResource(this, "Cluster", props);

    return cluster;
  }

  private createRole() {
    const role = new iam.Role(this, "ClusterRole", {
      assumedBy: new iam.ServicePrincipal("eks.amazonaws.com"),
      managedPolicyArns: [
        "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy",
        "arn:aws:iam::aws:policy/AmazonEKSServicePolicy"
      ]
    });

    return role;
  }

  private addDefaultSecurityGroup() {
    return new ec2.SecurityGroup(this, "ClusterSecurityGroup", {
      vpc: this.vpc,
      description: "Cluster API Server Security Group.",
      tags: {
        Name: "DefaultClusterSecurityGroup",
        Description: "Default Security group for EKS Cluster"
      }
    });
  }
}

/**
 * Import a cluster to use in another stack
 * This cluster was not create here
 *
 * @default has not been tested, will be when
 * node creation is active implemented.
 */
class ImportedCluster extends ClusterRef {
  public readonly clusterName: string;
  public readonly clusterArn: string;
  public readonly clusterEndpoint: string;
  public readonly vpcPlacement: ec2.VpcPlacementStrategy;
  public readonly clusterSecurityGroup: ec2.SecurityGroup;

  constructor(parent: cdk.Construct, name: string, props: IClusterRefProps) {
    super(parent, name);

    this.clusterName = props.clusterName;
    this.clusterEndpoint = props.clusterEndpoint;
    this.clusterArn = props.clusterArn;
    this.vpcPlacement = props.vpcPlacement;
    this.clusterSecurityGroup = props.clusterSecurityGroup;
  }
}
