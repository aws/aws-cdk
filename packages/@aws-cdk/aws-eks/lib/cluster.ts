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
  securityGroupId: string;
}

/**
 * A SecurityGroup Reference, object not created with this template.
 */
export abstract class ClusterRef extends cdk.Construct
  implements ec2.IConnectable, ec2.ISecurityGroupRule {
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

  public readonly canInlineRule = false;
  public readonly connections: ec2.Connections = new ec2.Connections({
    securityGroup: this
  });

  /**
   * Export cluster references to use in other stacks
   */
  public export(): IClusterRefProps {
    return {
      clusterName: this.makeOutput("ClusterName", this.clusterName),
      clusterArn: this.makeOutput("ClusterArn", this.clusterArn),
      clusterEndpoint: this.makeOutput("ClusterEndpoint", this.clusterEndpoint),
      vpcPlacement: this.vpcPlacement,
      securityGroupId: this.securityGroupId
    };
  }

  public addIngressRule(
    peer: ec2.ISecurityGroupRule,
    connection: ec2.IPortRange,
    description?: string
  ) {
    let id = `from ${peer.uniqueId}:${connection}`;
    if (description === undefined) {
      description = id;
    }
    id = id.replace("/", "_");

    // Skip duplicates
    if (this.tryFindChild(id) === undefined) {
      new ec2.cloudformation.SecurityGroupIngressResource(this, id, {
        groupId: this.securityGroupId,
        ...peer.toIngressRuleJSON(),
        ...connection.toRuleJSON(),
        description
      });
    }
  }

  public addEgressRule(
    peer: ec2.ISecurityGroupRule,
    connection: ec2.IPortRange,
    description?: string
  ) {
    let id = `to ${peer.uniqueId}:${connection}`;
    if (description === undefined) {
      description = id;
    }
    id = id.replace("/", "_");

    // Skip duplicates
    if (this.tryFindChild(id) === undefined) {
      new ec2.cloudformation.SecurityGroupEgressResource(this, id, {
        groupId: this.securityGroupId,
        ...peer.toEgressRuleJSON(),
        ...connection.toRuleJSON(),
        description
      });
    }
  }

  public toIngressRuleJSON(): any {
    return { sourceSecurityGroupId: this.securityGroupId };
  }

  public toEgressRuleJSON(): any {
    return { destinationSecurityGroupId: this.securityGroupId };
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
  public readonly securityGroup: ec2.SecurityGroupRef;
  public readonly securityGroupId: string;

  private readonly cluster: cloudformation.ClusterResource;
  private readonly clusterSubnetIds: string[] = [];

  constructor(parent: cdk.Construct, name: string, props: IClusterProps) {
    super(parent, name);

    this.vpc = props.vpc;
    this.vpcPlacement = props.vpcPlacement;
    const subnets = this.vpc.subnets(this.vpcPlacement);
    subnets.map(s => this.clusterSubnetIds.push(s.subnetId));

    const role = this.addClusterRole();

    this.securityGroup = this.createSecurityGroup();
    this.securityGroupId = this.securityGroup.securityGroupId;
    const sgId = this.securityGroup.securityGroupId;

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
    this.clusterCA = this.cluster.clusterCertificateAuthorityData;
  }

  private createCluster(props: cloudformation.ClusterResourceProps) {
    const cluster = new cloudformation.ClusterResource(this, "Cluster", props);

    return cluster;
  }

  private createSecurityGroup() {
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

export interface INodeProps {
  nodeClass: ec2.InstanceClass;
  nodeSize: ec2.InstanceSize;
  nodeType: NodeType;
  minNodes?: number;
  maxNodes?: number;
  sshKeyName?: string;
  updateType?: asg.UpdateType;
  tags?: cdk.Tags;
}
export class Nodes extends cdk.Construct {
  public readonly nodeGroup: asg.AutoScalingGroup;
  public readonly tags: cdk.TagManager;
  public readonly vpc: ec2.VpcNetworkRef;
  public readonly nodeGroups: asg.AutoScalingGroup[] = [];

  private readonly vpcPlacement: ec2.VpcPlacementStrategy;
  private readonly clusterName: string;
  private readonly clusterEndpoint: string;
  private readonly clusterCA: string;
  private readonly clusterSecurityGroup: ec2.SecurityGroupRef;

  constructor(parent: Cluster, name: string, props: INodeProps) {
    super(parent, name);

    this.clusterName = parent.clusterName;
    this.clusterEndpoint = parent.clusterEndpoint;
    this.clusterCA = parent.clusterCA;
    this.clusterSecurityGroup = parent.securityGroup;
    this.vpc = parent.vpc;
    this.vpcPlacement = parent.vpcPlacement;

    this.tags = new cdk.TagManager(this, { initialTags: props.tags });
    // EKS Required tags
    this.tags.setTag(`kubernetes.io/cluster/${this.clusterName}`, "owned", {
      overwrite: false
    });

    this.nodeGroup = this.addNodes(props);
  }

  public addNodes(props: INodeProps) {
    const type = new ec2.InstanceTypePair(props.nodeClass, props.nodeSize);

    const nodeProps: asg.AutoScalingGroupProps = {
      vpc: this.vpc,
      instanceType: type,
      machineImage: new ec2.GenericLinuxImage(nodeAmi[props.nodeType]),
      minSize: props.minNodes || 1,
      maxSize: props.maxNodes || 1,
      desiredCapacity: props.minNodes || 1,
      updateType: props.updateType,
      keyName: props.sshKeyName,
      vpcPlacement: this.vpcPlacement,
      tags: this.tags.resolve()
    };
    const nodes = new asg.AutoScalingGroup(
      this,
      `NodeGroup-${type}`,
      nodeProps
    );
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
    props.nodes.connections.allowFrom(
      this.clusterSecurityGroup,
      new ec2.TcpPort(443)
    );
    props.nodes.connections.allowFrom(
      this.clusterSecurityGroup,
      new ec2.TcpPortRange(1025, 65535)
    );
  }

  private addUserData(props: { nodes: asg.AutoScalingGroup; type: string }) {
    const max = maxPods.get(props.type);
    props.nodes.addUserData(
      "set -o xtrace",
      `/etc/eks/bootstrap.sh ${
        this.clusterName
      } --use-max-pods ${max} --apiserver-endpoint ${
        this.clusterEndpoint
      } --b64-cluster-ca ${this.clusterCA}`
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
  public readonly securityGroupId: string;

  constructor(parent: cdk.Construct, name: string, props: IClusterRefProps) {
    super(parent, name);

    this.clusterName = props.clusterName;
    this.clusterEndpoint = props.clusterEndpoint;
    this.clusterArn = props.clusterArn;
    this.vpcPlacement = props.vpcPlacement;
    this.securityGroupId = props.securityGroupId;
  }
}
