import asg = require("@aws-cdk/aws-autoscaling");
import ec2 = require("@aws-cdk/aws-ec2");
import iam = require("@aws-cdk/aws-iam");
import cdk = require("@aws-cdk/cdk");
import { cloudformation } from "./eks.generated";
import { maxPods, nodeAmi, NodeType } from "./instance-data";

// TODO: Option to deploy nodes on Cluster creation.

/**
 * Properties to instantiate the Cluster
 */
export interface IClusterProps extends cdk.StackProps {
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
  version?: string;
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
  /**
   * The security group ID used by the cluster for it's rules
   */
  securityGroupId: string;
  /**
   * The IConnectable interface implementation for updating
   * security group rules
   */
  connections: ec2.Connections;
}

/**
 * A SecurityGroup Reference, object not created with this template.
 */
export abstract class ClusterRef extends cdk.Construct
  implements ec2.IConnectable {
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
  public abstract readonly securityGroupId: string;
  public abstract readonly connections: ec2.Connections;

  /**
   * Export cluster references to use in other stacks
   */
  public export(): IClusterRefProps {
    return {
      clusterName: this.makeOutput("ClusterName", this.clusterName),
      clusterArn: this.makeOutput("ClusterArn", this.clusterArn),
      clusterEndpoint: this.makeOutput("ClusterEndpoint", this.clusterEndpoint),
      vpcPlacement: this.vpcPlacement,
      securityGroupId: this.securityGroupId,
      connections: this.connections
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
  public readonly vpc: ec2.VpcNetworkRef;
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
  public readonly clusterCA: string;
  /**
   * The VPC Placement strategy for the given cluster
   * PublicSubnets? PrivateSubnets?
   *
   * @type {ec2.VpcPlacementStrategy}
   * @memberof Cluster
   */
  public readonly vpcPlacement: ec2.VpcPlacementStrategy;
  /**
   * The security group used by the cluster, currently only one supported
   * Updating the cluster by adding resources causes a destruction and
   * re-creation. This is a limitation of the EKS API itself.
   *
   * @type {ec2.SecurityGroup}
   * @memberof Cluster
   */
  public readonly securityGroup: ec2.SecurityGroup;
  /**
   * The security group ID attached to the security group of the cluster
   * Used within the IConnectable implementation
   *
   * @type {string}
   * @memberof Cluster
   */
  public readonly securityGroupId: string;
  /**
   * Manages connection rules (Security Group Rules) for the cluster
   *
   * @type {ec2.Connections}
   * @memberof Cluster
   */
  public readonly connections: ec2.Connections;

  private readonly cluster: cloudformation.ClusterResource;

  /**
   * Initiates an EKS Cluster with the supplied arguments
   *
   * @param parent a Construct, most likely a cdk.Stack created
   * @param name the name of the Construct to create
   * @param props properties in the IClusterProps interface
   */
  constructor(parent: cdk.Construct, name: string, props: IClusterProps) {
    super(parent, name);

    this.vpc = props.vpc;
    this.vpcPlacement = props.vpcPlacement;
    const subnets = this.vpc.subnets(this.vpcPlacement);
    const subnetIds: string[] = [];
    subnets.map(s => subnetIds.push(s.subnetId));

    const role = this.addClusterRole();

    this.securityGroup = this.addSecurityGroup();
    this.securityGroupId = this.securityGroup.securityGroupId;
    this.connections = new ec2.Connections({
      securityGroup: this.securityGroup
    });

    const clusterProps: cloudformation.ClusterResourceProps = {
      clusterName: props.clusterName,
      roleArn: role.roleArn,
      version: props.version,
      resourcesVpcConfig: {
        securityGroupIds: new Array(this.securityGroupId),
        subnetIds
      }
    };
    this.cluster = this.createCluster(clusterProps);
    this.clusterName = this.cluster.clusterName;
    this.clusterArn = this.cluster.clusterArn;
    this.clusterEndpoint = this.cluster.clusterEndpoint;
    this.clusterCA = this.cluster.clusterCertificateAuthorityData;
  }

  private createCluster(props: cloudformation.ClusterResourceProps) {
    const cluster = new cloudformation.ClusterResource(this, "Cluster", props);

    return cluster;
  }

  /**
   * This is private because for now the EKS API is limited
   * Once the security groups are assigned, one can modify the groups
   * but any additional groups or removal of groups destroys and
   * creates a brand new cluster
   */
  private addSecurityGroup() {
    return new ec2.SecurityGroup(this, "ClusterSecurityGroup", {
      vpc: this.vpc,
      description: "Cluster API Server Security Group.",
      tags: {
        Name: "Cluster SecurityGroup",
        Description: "The security group assigned to the cluster"
      }
    });
  }

  private addClusterRole() {
    const role = new iam.Role(this, "ClusterRole", {
      assumedBy: new iam.ServicePrincipal("eks.amazonaws.com"),
      managedPolicyArns: [
        "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy",
        "arn:aws:iam::aws:policy/AmazonEKSServicePolicy"
      ]
    });

    return role;
  }
}

/**
 * Properties for instantiating an Autoscaling Group of worker nodes
 * The options are limited on purpose, though moe can be added.
 * The requirements for Kubernetes scaling and updated configurations
 * are a bit different.
 *
 * More properties will be added to match those in the future.
 */
export interface INodeProps {
  vpc: ec2.VpcNetworkRef;
  cluster: ClusterRef;
  /**
   * The ec2 InstanceClass to use on the worker nodes
   * Note, not all instance classes are supported
   * ref: https://amazon-eks.s3-us-west-2.amazonaws.com/cloudformation/2018-08-30/amazon-eks-nodegroup.yaml
   *
   * example: ec2.InstanceClass.M5
   *
   * @default M5
   */
  nodeClass?: ec2.InstanceClass;
  /**
   * The size of the chosen instance class.
   * Note, not all instancer sizes are supported per class.
   * ref: https://amazon-eks.s3-us-west-2.amazonaws.com/cloudformation/2018-08-30/amazon-eks-nodegroup.yaml
   *
   * example: ec2.InstanceSize.Large
   *
   * @default Large
   */
  nodeSize?: ec2.InstanceSize;
  /**
   * The instance type for EKS to support
   * Whether to support GPU optimized EKS or Normal instances
   *
   * @default Normal
   */
  nodeType?: NodeType;
  /**
   * Minimum number of instances in the worker group
   *
   * @default 1
   */
  minNodes?: number;
  /**
   * Maximum number of instances in the worker group
   *
   * @default 1
   */
  maxNodes?: number;
  /**
   * The name of the SSH keypair to grant access to the worker nodes
   * This must be created in the AWS Console first
   *
   * @default No SSH access granted
   */
  sshKeyName?: string;
  /**
   * Additional tags to associate with the worker group
   */
  tags?: cdk.Tags;
}
export class Nodes extends cdk.Construct {
  /**
   * A VPC reference to place the autoscaling group of nodes inside
   *
   * @type {ec2.VpcNetworkRef}
   * @memberof Nodes
   */
  public readonly vpc: ec2.VpcNetworkRef;
  /**
   * The autoscaling group used to setup the worker nodes
   *
   * @type {asg.AutoScalingGroup}
   * @memberof Nodes
   */
  public readonly nodeGroup: asg.AutoScalingGroup;
  /**
   * An array of worker nodes as multiple groups can be deployed
   * within a Stack. This is mainly to track and can be read from
   *
   * @type {asg.AutoScalingGroup[]}
   * @memberof Nodes
   */
  public readonly nodeGroups: asg.AutoScalingGroup[] = [];

  private readonly vpcPlacement: ec2.VpcPlacementStrategy;
  private readonly clusterName: string;
  private readonly cluster: ClusterRef;

  /**
   * Creates an instance of Nodes.
   *
   * @param {cdk.Construct} parent
   * @param {string} name
   * @param {INodeProps} props
   * @memberof Nodes
   */
  constructor(parent: cdk.Construct, name: string, props: INodeProps) {
    super(parent, name);

    this.cluster = props.cluster;
    this.clusterName = props.cluster.clusterName;
    this.vpc = props.vpc;
    this.vpcPlacement = props.cluster.vpcPlacement;

    const nodeClass = props.nodeClass || ec2.InstanceClass.M5;
    const nodeSize = props.nodeSize || ec2.InstanceSize.Large;
    const nodeType = props.nodeType || NodeType.Normal;

    const type = new ec2.InstanceTypePair(nodeClass, nodeSize);
    const nodeProps: asg.AutoScalingGroupProps = {
      vpc: this.vpc,
      instanceType: type,
      machineImage: new ec2.GenericLinuxImage(nodeAmi[nodeType]),
      minSize: props.minNodes || 1,
      maxSize: props.maxNodes || 1,
      desiredCapacity: props.minNodes || 1,
      keyName: props.sshKeyName,
      vpcPlacement: this.vpcPlacement,
      tags: props.tags
    };
    this.nodeGroup = this.addNodes(nodeProps, type);
  }

  private addNodes(
    props: asg.AutoScalingGroupProps,
    type: ec2.InstanceTypePair
  ) {
    const nodes = new asg.AutoScalingGroup(
      this,
      `NodeGroup-${type.toString()}`,
      props
    );
    // EKS Required Tags
    nodes.tags.setTag(`kubernetes.io/cluster/${this.clusterName}`, "owned", {
      overwrite: false
    });

    this.addRole(nodes.role);

    // bootstrap nodes
    this.addUserData({ nodes, type: type.toString() });
    this.addDefaultRules({ nodes });

    this.nodeGroups.push(nodes);

    return nodes;
  }

  private addDefaultRules(props: { nodes: asg.AutoScalingGroup }) {
    // self rules
    props.nodes.connections.allowInternally(new ec2.TcpAllPorts());
    props.nodes.connections.allowInternally(new ec2.UdpAllPorts());
    props.nodes.connections.allowInternally(new ec2.IcmpAllTypesAndCodes());

    // Cluster to:from rules
    props.nodes.connections.allowFrom(this.cluster, new ec2.TcpPort(443));
    props.nodes.connections.allowFrom(
      this.cluster,
      new ec2.TcpPortRange(1025, 65535)
    );
  }

  private addUserData(props: { nodes: asg.AutoScalingGroup; type: string }) {
    const max = maxPods.get(props.type);
    props.nodes.addUserData(
      "set -o xtrace",
      `/etc/eks/bootstrap.sh ${this.clusterName} --use-max-pods ${max}`
    );
  }

  private addRole(role: iam.Role) {
    role.attachManagedPolicy(
      "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
    );
    role.attachManagedPolicy("arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy");
    role.attachManagedPolicy(
      "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
    );

    return role;
  }
}

/**
 * Import a cluster to use in another stack
 * This cluster was not created here
 *
 * @default NO
 *
 * Cross stack currently runs into an issue with references
 * to security groups that are in stacks not yet deployed
 */
class ImportedCluster extends ClusterRef {
  public readonly clusterName: string;
  public readonly clusterArn: string;
  public readonly clusterEndpoint: string;
  public readonly vpcPlacement: ec2.VpcPlacementStrategy;
  public readonly securityGroupId: string;
  public readonly connections: ec2.Connections;

  constructor(parent: cdk.Construct, name: string, props: IClusterRefProps) {
    super(parent, name);

    this.clusterName = props.clusterName;
    this.clusterEndpoint = props.clusterEndpoint;
    this.clusterArn = props.clusterArn;
    this.vpcPlacement = props.vpcPlacement;
    this.securityGroupId = props.securityGroupId;
    this.connections = props.connections;
  }
}
