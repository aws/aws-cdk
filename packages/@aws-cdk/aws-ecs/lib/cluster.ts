import autoscaling = require('@aws-cdk/aws-autoscaling');
import cloudwatch = require ('@aws-cdk/aws-cloudwatch');
import ec2 = require('@aws-cdk/aws-ec2');
import iam = require('@aws-cdk/aws-iam');
import cloudmap = require('@aws-cdk/aws-servicediscovery');
import { Construct, Context, IResource, Resource, Stack } from '@aws-cdk/cdk';
import { InstanceDrainHook } from './drain-hook/instance-drain-hook';
import { CfnCluster } from './ecs.generated';

/**
 * Properties to define an ECS cluster
 */
export interface ClusterProps {
  /**
   * A name for the cluster.
   *
   * @default CloudFormation-generated name
   */
  readonly clusterName?: string;

  /**
   * The VPC where your ECS instances will be running or your ENIs will be deployed
   */
  readonly vpc: ec2.IVpc;
}

/**
 * A container cluster that runs on your EC2 instances
 */
export class Cluster extends Resource implements ICluster {
  /**
   * Import an existing cluster
   */
  public static fromClusterAttributes(scope: Construct, id: string, attrs: ClusterAttributes): ICluster {
    return new ImportedCluster(scope, id, attrs);
  }

  /**
   * Connections manager for the EC2 cluster
   */
  public readonly connections: ec2.Connections = new ec2.Connections();

  /**
   * The VPC this cluster was created in.
   */
  public readonly vpc: ec2.IVpc;

  /**
   * The ARN of this cluster
   */
  public readonly clusterArn: string;

  /**
   * The name of this cluster
   */
  public readonly clusterName: string;

  /**
   * The service discovery namespace created in this cluster
   */
  private _defaultNamespace?: cloudmap.INamespace;

  /**
   * Whether the cluster has EC2 capacity associated with it
   */
  private _hasEc2Capacity: boolean = false;

  constructor(scope: Construct, id: string, props: ClusterProps) {
    super(scope, id);

    const cluster = new CfnCluster(this, 'Resource', {clusterName: props.clusterName});

    this.vpc = props.vpc;
    this.clusterArn = cluster.clusterArn;
    this.clusterName = cluster.clusterName;
  }

  /**
   * Add an AWS Cloud Map DNS namespace for this cluster.
   * NOTE: HttpNamespaces are not supported, as ECS always requires a DNSConfig when registering an instance to a Cloud
   * Map service.
   */
  public addDefaultCloudMapNamespace(options: NamespaceOptions): cloudmap.INamespace {
    if (this._defaultNamespace !== undefined) {
      throw new Error("Can only add default namespace once.");
    }

    const namespaceType = options.type === undefined || options.type === NamespaceType.PrivateDns
      ? cloudmap.NamespaceType.DnsPrivate
      : cloudmap.NamespaceType.DnsPublic;

    const sdNamespace = namespaceType === cloudmap.NamespaceType.DnsPrivate ?
      new cloudmap.PrivateDnsNamespace(this, 'DefaultServiceDiscoveryNamespace', {
        name: options.name,
        vpc: this.vpc
      }) :
      new cloudmap.PublicDnsNamespace(this, 'DefaultServiceDiscoveryNamespace', {
        name: options.name,
      });

    this._defaultNamespace = sdNamespace;

    return sdNamespace;
  }

  /**
   * Getter for namespace added to cluster
   */
  public get defaultNamespace(): cloudmap.INamespace | undefined {
    return this._defaultNamespace;
  }

  /**
   * Add a default-configured AutoScalingGroup running the ECS-optimized AMI to this Cluster
   *
   * Returns the AutoScalingGroup so you can add autoscaling settings to it.
   */
  public addCapacity(id: string, options: AddCapacityOptions): autoscaling.AutoScalingGroup {
    const autoScalingGroup = new autoscaling.AutoScalingGroup(this, id, {
      ...options,
      vpc: this.vpc,
      machineImage: options.machineImage || new EcsOptimizedAmi(),
      updateType: options.updateType || autoscaling.UpdateType.ReplacingUpdate,
      instanceType: options.instanceType,
    });

    this.addAutoScalingGroup(autoScalingGroup, options);

    return autoScalingGroup;
  }

  /**
   * Add compute capacity to this ECS cluster in the form of an AutoScalingGroup
   * @param autoScalingGroup the ASG to add to this cluster.
   * [disable-awslint:ref-via-interface] is needed in order to install the ECS
   * agent by updating the ASGs user data.
   */
  public addAutoScalingGroup(autoScalingGroup: autoscaling.AutoScalingGroup, options: AddAutoScalingGroupCapacityOptions = {}) {
    this._hasEc2Capacity = true;
    this.connections.connections.addSecurityGroup(...autoScalingGroup.connections.securityGroups);

    // Tie instances to cluster
    autoScalingGroup.addUserData(`echo ECS_CLUSTER=${this.clusterName} >> /etc/ecs/ecs.config`);

    if (!options.containersAccessInstanceRole) {
      // Deny containers access to instance metadata service
      // Source: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/instance_IAM_role.html
      autoScalingGroup.addUserData('sudo iptables --insert FORWARD 1 --in-interface docker+ --destination 169.254.169.254/32 --jump DROP');
      autoScalingGroup.addUserData('sudo service iptables save');
      // The following is only for AwsVpc networking mode, but doesn't hurt for the other modes.
      autoScalingGroup.addUserData('echo ECS_AWSVPC_BLOCK_IMDS=true >> /etc/ecs/ecs.config');
    }

    // ECS instances must be able to do these things
    // Source: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/instance_IAM_role.html
    autoScalingGroup.addToRolePolicy(new iam.PolicyStatement().addActions(
      "ecs:CreateCluster",
      "ecs:DeregisterContainerInstance",
      "ecs:DiscoverPollEndpoint",
      "ecs:Poll",
      "ecs:RegisterContainerInstance",
      "ecs:StartTelemetrySession",
      "ecs:Submit*",
      "ecr:GetAuthorizationToken",
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ).addAllResources());

    // 0 disables, otherwise forward to underlying implementation which picks the sane default
    if (options.taskDrainTimeSeconds !== 0) {
      new InstanceDrainHook(autoScalingGroup, 'DrainECSHook', {
        autoScalingGroup,
        cluster: this,
        drainTimeSec: options.taskDrainTimeSeconds
      });
    }
  }

  /**
   * Whether the cluster has EC2 capacity associated with it
   */
  public get hasEc2Capacity(): boolean {
    return this._hasEc2Capacity;
  }

  /**
   * Metric for cluster CPU reservation
   *
   * @default average over 5 minutes
   */
  public metricCpuReservation(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('CPUReservation', props);
  }

  /**
   * Metric for cluster Memory reservation
   *
   * @default average over 5 minutes
   */
  public metricMemoryReservation(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('MemoryReservation', props );
  }

  /**
   * Return the given named metric for this Cluster
   */
  public metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return new cloudwatch.Metric({
      namespace: 'AWS/ECS',
      metricName,
      dimensions: { ClusterName: this.clusterName },
      ...props
    });
  }
}

export interface EcsOptimizedAmiProps {
  /**
   * What generation of Amazon Linux to use
   *
   * @default AmazonLinuxGeneration.AmazonLinux if hwType equal to AmiHardwareType.Standard else AmazonLinuxGeneration.AmazonLinux2
   */
  readonly generation?: ec2.AmazonLinuxGeneration;

  /**
   * What ECS Optimized AMI type to use
   *
   * @default AmiHardwareType.Standard
   */
  readonly hwType?: AmiHardwareType;
}

/**
 * Construct a Linux machine image from the latest ECS Optimized AMI published in SSM
 */
export class EcsOptimizedAmi implements ec2.IMachineImageSource {
  private readonly generation: ec2.AmazonLinuxGeneration;
  private readonly hwType: AmiHardwareType;

  private readonly amiParameterName: string;

  constructor(props?: EcsOptimizedAmiProps) {
    this.hwType = (props && props.hwType) || AmiHardwareType.Standard;
    if (props && props.generation) {      // generation defined in the props object
      if (props.generation === ec2.AmazonLinuxGeneration.AmazonLinux && this.hwType !== AmiHardwareType.Standard) {
        throw new Error(`Amazon Linux does not support special hardware type. Use Amazon Linux 2 instead`);
      } else {
        this.generation = props.generation;
      }
    } else {                              // generation not defined in props object
      if (this.hwType === AmiHardwareType.Standard) {    // default to Amazon Linux v1 if no HW is standard
        this.generation = ec2.AmazonLinuxGeneration.AmazonLinux;
      } else {                                         // default to Amazon Linux v2 if special HW
        this.generation = ec2.AmazonLinuxGeneration.AmazonLinux2;
      }
    }

    // set the SSM parameter name
    this.amiParameterName = "/aws/service/ecs/optimized-ami/"
                          + ( this.generation === ec2.AmazonLinuxGeneration.AmazonLinux ? "amazon-linux/" : "" )
                          + ( this.generation === ec2.AmazonLinuxGeneration.AmazonLinux2 ? "amazon-linux-2/" : "" )
                          + ( this.hwType === AmiHardwareType.Gpu ? "gpu/" : "" )
                          + ( this.hwType === AmiHardwareType.Arm ? "arm64/" : "" )
                          + "recommended";
  }

  /**
   * Return the correct image
   */
  public getImage(scope: Construct): ec2.MachineImage {
    const json = Context.getSsmParameter(scope, this.amiParameterName, { defaultValue: "{\"image_id\": \"\"}" });
    const ami = JSON.parse(json).image_id;
    return new ec2.MachineImage(ami, new ec2.LinuxOS());
  }
}

/**
 * An ECS cluster
 */
export interface ICluster extends IResource {
  /**
   * Name of the cluster
   * @attribute
   */
  readonly clusterName: string;

  /**
   * The ARN of this cluster
   * @attribute
   */
  readonly clusterArn: string;

  /**
   * VPC that the cluster instances are running in
   */
  readonly vpc: ec2.IVpc;

  /**
   * Connections manager of the cluster instances
   */
  readonly connections: ec2.Connections;

  /**
   * Whether the cluster has EC2 capacity associated with it
   */
  readonly hasEc2Capacity: boolean;

  /**
   * Getter for Cloudmap namespace created in the cluster
   */
  readonly defaultNamespace?: cloudmap.INamespace;
}

/**
 * Properties to import an ECS cluster
 */
export interface ClusterAttributes {
  /**
   * Name of the cluster
   */
  readonly clusterName: string;

  /**
   * ARN of the cluster
   *
   * @default Derived from clusterName
   */
  readonly clusterArn?: string;

  /**
   * VPC that the cluster instances are running in
   */
  readonly vpc: ec2.IVpc;

  /**
   * Security group of the cluster instances
   */
  readonly securityGroups: ec2.ISecurityGroup[];

  /**
   * Whether the given cluster has EC2 capacity
   *
   * @default true
   */
  readonly hasEc2Capacity?: boolean;

  /**
   * Default namespace properties
   *
   * @default - No default namespace
   */
  readonly defaultNamespace?: cloudmap.INamespace;
}

/**
 * An Cluster that has been imported
 */
class ImportedCluster extends Resource implements ICluster {
  /**
   * Name of the cluster
   */
  public readonly clusterName: string;

  /**
   * ARN of the cluster
   */
  public readonly clusterArn: string;

  /**
   * VPC that the cluster instances are running in
   */
  public readonly vpc: ec2.IVpc;

  /**
   * Security group of the cluster instances
   */
  public readonly connections = new ec2.Connections();

  /**
   * Whether the cluster has EC2 capacity
   */
  public readonly hasEc2Capacity: boolean;

  /**
   * Cloudmap namespace created in the cluster
   */
  private _defaultNamespace?: cloudmap.INamespace;

  constructor(scope: Construct, id: string, props: ClusterAttributes) {
    super(scope, id);
    this.clusterName = props.clusterName;
    this.vpc = props.vpc;
    this.hasEc2Capacity = props.hasEc2Capacity !== false;
    this._defaultNamespace = props.defaultNamespace;

    this.clusterArn = props.clusterArn !== undefined ? props.clusterArn : Stack.of(this).formatArn({
      service: 'ecs',
      resource: 'cluster',
      resourceName: props.clusterName,
    });

    this.clusterArn = props.clusterArn !== undefined ? props.clusterArn : Stack.of(this).formatArn({
      service: 'ecs',
      resource: 'cluster',
      resourceName: props.clusterName,
    });

    let i = 1;
    for (const sgProps of props.securityGroups) {
      this.connections.addSecurityGroup(ec2.SecurityGroup.fromSecurityGroupId(this, `SecurityGroup${i}`, sgProps.securityGroupId));
      i++;
    }
  }

  public get defaultNamespace(): cloudmap.INamespace | undefined {
    return this._defaultNamespace;
  }
}

/**
 * Properties for adding an autoScalingGroup
 */
export interface AddAutoScalingGroupCapacityOptions {
  /**
   * Whether or not the containers can access the instance role
   *
   * @default false
   */
  readonly containersAccessInstanceRole?: boolean;

  /**
   * Give tasks this many seconds to complete when instances are being scaled in.
   *
   * Task draining adds a Lambda and a Lifecycle hook to your AutoScalingGroup
   * that will delay instance termination until all ECS tasks have drained from
   * the instance.
   *
   * Set to 0 to disable task draining.
   *
   * @default 300
   */
  readonly taskDrainTimeSeconds?: number;
}

/**
 * Properties for adding autoScalingGroup
 */
export interface AddCapacityOptions extends AddAutoScalingGroupCapacityOptions, autoscaling.CommonAutoScalingGroupProps {
  /**
   * The type of EC2 instance to launch into your Autoscaling Group
   */
  readonly instanceType: ec2.InstanceType;

  /**
   * The machine image for the ECS instances
   *
   * @default - Amazon Linux 1
   */
  readonly machineImage?: ec2.IMachineImageSource;
}

export interface NamespaceOptions {
  /**
   * The domain name for the namespace, such as foo.com
   */
  readonly name: string;

  /**
   * The type of CloudMap Namespace to create in your cluster
   *
   * @default PrivateDns
   */
  readonly type?: NamespaceType;

  /**
   * The Amazon VPC that you want to associate the namespace with. Required for Private DNS namespaces
   *
   * @default VPC of the cluster for Private DNS Namespace, otherwise none
   */
  readonly vpc?: ec2.IVpc;
}

/**
 * The type of CloudMap namespace to create
 */
export enum NamespaceType {
  /**
   * Create a private DNS namespace
   */
  PrivateDns = 'PrivateDns',

  /**
   * Create a public DNS namespace
   */
  PublicDns = 'PublicDns',
}

/**
 * The type of HW for the ECS Optimized AMI
 */
export enum AmiHardwareType {

  /**
   * Create a standard AMI
   */
  Standard = 'Standard',

  /**
   * Create a GPU optimized AMI
   */
  Gpu = 'GPU',

  /**
   * Create a ARM64 optimized AMI
   */
  Arm = 'ARM64',
}
