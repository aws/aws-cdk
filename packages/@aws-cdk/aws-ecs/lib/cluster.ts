import autoscaling = require('@aws-cdk/aws-autoscaling');
import cloudwatch = require ('@aws-cdk/aws-cloudwatch');
import ec2 = require('@aws-cdk/aws-ec2');
import iam = require('@aws-cdk/aws-iam');
import cloudmap = require('@aws-cdk/aws-servicediscovery');
import ssm = require('@aws-cdk/aws-ssm');
import { Construct, Duration, IResource, Resource, Stack } from '@aws-cdk/core';
import { InstanceDrainHook } from './drain-hook/instance-drain-hook';
import { CfnCluster } from './ecs.generated';

/**
 * The properties used to define an ECS cluster.
 */
export interface ClusterProps {
  /**
   * The name for the cluster.
   *
   * @default CloudFormation-generated name
   */
  readonly clusterName?: string;

  /**
   * The VPC to associate with the cluster.
   */
  readonly vpc: ec2.IVpc;
}

/**
 * A regional grouping of one or more container instances on which you can run tasks and services.
 */
export class Cluster extends Resource implements ICluster {
  /**
   * This method adds attributes from a specified cluster to this cluster.
   */
  public static fromClusterAttributes(scope: Construct, id: string, attrs: ClusterAttributes): ICluster {
    return new ImportedCluster(scope, id, attrs);
  }

  /**
   * Manage the allowed network connections for the cluster with Security Groups.
   */
  public readonly connections: ec2.Connections = new ec2.Connections();

  /**
   * The VPC associated with the cluster.
   */
  public readonly vpc: ec2.IVpc;

  /**
   * The Amazon Resource Name (ARN) that identifies the cluster.
   */
  public readonly clusterArn: string;

  /**
   * The name of the cluster.
   */
  public readonly clusterName: string;

  /**
   * The AWS Cloud Map namespace to associate with the cluster.
   */
  private _defaultCloudMapNamespace?: cloudmap.INamespace;

  /**
   * Specifies whether the cluster has EC2 instance capacity.
   */
  private _hasEc2Capacity: boolean = false;

  /**
   * Constructs a new instance of the Cluster class.
   */
  constructor(scope: Construct, id: string, props: ClusterProps) {
    super(scope, id, {
      physicalName: props.clusterName,
    });

    const cluster = new CfnCluster(this, 'Resource', {
      clusterName: this.physicalName,
    });

    this.clusterArn = this.getResourceArnAttribute(cluster.attrArn, {
      service: 'ecs',
      resource: 'cluster',
      resourceName: this.physicalName,
    });
    this.clusterName = this.getResourceNameAttribute(cluster.ref);

    this.vpc = props.vpc;
  }

  /**
   * Add an AWS Cloud Map DNS namespace for this cluster.
   * NOTE: HttpNamespaces are not supported, as ECS always requires a DNSConfig when registering an instance to a Cloud
   * Map service.
   */
  public addDefaultCloudMapNamespace(options: CloudMapNamespaceOptions): cloudmap.INamespace {
    if (this._defaultCloudMapNamespace !== undefined) {
      throw new Error("Can only add default namespace once.");
    }

    const namespaceType = options.type !== undefined
      ? options.type
      : cloudmap.NamespaceType.DNS_PRIVATE;

    const sdNamespace = namespaceType === cloudmap.NamespaceType.DNS_PRIVATE ?
      new cloudmap.PrivateDnsNamespace(this, 'DefaultServiceDiscoveryNamespace', {
        name: options.name,
        vpc: this.vpc
      }) :
      new cloudmap.PublicDnsNamespace(this, 'DefaultServiceDiscoveryNamespace', {
        name: options.name,
      });

    this._defaultCloudMapNamespace = sdNamespace;

    return sdNamespace;
  }

  /**
   * Getter for namespace added to cluster
   */
  public get defaultCloudMapNamespace(): cloudmap.INamespace | undefined {
    return this._defaultCloudMapNamespace;
  }

  /**
   * This method adds compute capacity to a cluster by creating an AutoScalingGroup with the specified options.
   *
   * Returns the AutoScalingGroup so you can add autoscaling settings to it.
   */
  public addCapacity(id: string, options: AddCapacityOptions): autoscaling.AutoScalingGroup {
    const autoScalingGroup = new autoscaling.AutoScalingGroup(this, id, {
      ...options,
      vpc: this.vpc,
      machineImage: options.machineImage || new EcsOptimizedAmi(),
      updateType: options.updateType || autoscaling.UpdateType.REPLACING_UPDATE,
      instanceType: options.instanceType,
    });

    this.addAutoScalingGroup(autoScalingGroup, options);

    return autoScalingGroup;
  }

  /**
   * This method adds compute capacity to a cluster using the specified AutoScalingGroup.
   *
   * @param autoScalingGroup the ASG to add to this cluster.
   * [disable-awslint:ref-via-interface] is needed in order to install the ECS
   * agent by updating the ASGs user data.
   */
  public addAutoScalingGroup(autoScalingGroup: autoscaling.AutoScalingGroup, options: AddAutoScalingGroupCapacityOptions = {}) {
    this._hasEc2Capacity = true;
    this.connections.connections.addSecurityGroup(...autoScalingGroup.connections.securityGroups);

    // Tie instances to cluster
    autoScalingGroup.addUserData(`echo ECS_CLUSTER=${this.clusterName} >> /etc/ecs/ecs.config`);

    if (!options.canContainersAccessInstanceRole) {
      // Deny containers access to instance metadata service
      // Source: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/instance_IAM_role.html
      autoScalingGroup.addUserData('sudo iptables --insert FORWARD 1 --in-interface docker+ --destination 169.254.169.254/32 --jump DROP');
      autoScalingGroup.addUserData('sudo service iptables save');
      // The following is only for AwsVpc networking mode, but doesn't hurt for the other modes.
      autoScalingGroup.addUserData('echo ECS_AWSVPC_BLOCK_IMDS=true >> /etc/ecs/ecs.config');
    }

    // ECS instances must be able to do these things
    // Source: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/instance_IAM_role.html
    autoScalingGroup.addToRolePolicy(new iam.PolicyStatement({
      actions: [
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
      ],
      resources: ['*']
    }));

    // 0 disables, otherwise forward to underlying implementation which picks the sane default
    if (!options.taskDrainTime || options.taskDrainTime.toSeconds() !== 0) {
      new InstanceDrainHook(autoScalingGroup, 'DrainECSHook', {
        autoScalingGroup,
        cluster: this,
        drainTime: options.taskDrainTime
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
   * This method returns the CloudWatch metric for this clusters CPU reservation.
   *
   * @default average over 5 minutes
   */
  public metricCpuReservation(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('CPUReservation', props);
  }

  /**
   * This method returns the CloudWatch metric for this clusters memory reservation.
   *
   * @default average over 5 minutes
   */
  public metricMemoryReservation(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('MemoryReservation', props );
  }

  /**
   * This method returns the specifed CloudWatch metric for this cluster.
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

/**
 * The properties that define which ECS-optimized AMI is used.
 */
export interface EcsOptimizedAmiProps {
  /**
   * The Amazon Linux generation to use.
   *
   * @default AmazonLinuxGeneration.AmazonLinux2
   */
  readonly generation?: ec2.AmazonLinuxGeneration;

  /**
   * The ECS-optimized AMI variant to use.
   *
   * @default AmiHardwareType.Standard
   */
  readonly hardwareType?: AmiHardwareType;
}

/**
 * Construct a Linux machine image from the latest ECS Optimized AMI published in SSM
 */
export class EcsOptimizedAmi implements ec2.IMachineImage {
  private readonly generation: ec2.AmazonLinuxGeneration;
  private readonly hwType: AmiHardwareType;

  private readonly amiParameterName: string;

  /**
   * Constructs a new instance of the EcsOptimizedAmi class.
   */
  constructor(props?: EcsOptimizedAmiProps) {
    this.hwType = (props && props.hardwareType) || AmiHardwareType.STANDARD;
    if (props && props.generation) {      // generation defined in the props object
      if (props.generation === ec2.AmazonLinuxGeneration.AMAZON_LINUX && this.hwType !== AmiHardwareType.STANDARD) {
        throw new Error(`Amazon Linux does not support special hardware type. Use Amazon Linux 2 instead`);
      } else {
        this.generation = props.generation;
      }
    } else {                              // generation not defined in props object
      // always default to Amazon Linux v2 regardless of HW
      this.generation = ec2.AmazonLinuxGeneration.AMAZON_LINUX_2;
    }

    // set the SSM parameter name
    this.amiParameterName = "/aws/service/ecs/optimized-ami/"
                          + ( this.generation === ec2.AmazonLinuxGeneration.AMAZON_LINUX ? "amazon-linux/" : "" )
                          + ( this.generation === ec2.AmazonLinuxGeneration.AMAZON_LINUX_2 ? "amazon-linux-2/" : "" )
                          + ( this.hwType === AmiHardwareType.GPU ? "gpu/" : "" )
                          + ( this.hwType === AmiHardwareType.ARM ? "arm64/" : "" )
                          + "recommended/image_id";
  }

  /**
   * Return the correct image
   */
  public getImage(scope: Construct): ec2.MachineImageConfig {
    const ami = ssm.StringParameter.valueForStringParameter(scope, this.amiParameterName);
    return {
      imageId: ami,
      osType: ec2.OperatingSystemType.LINUX
    };
  }
}

/**
 * A regional grouping of one or more container instances on which you can run tasks and services.
 */
export interface ICluster extends IResource {
  /**
   * The name of the cluster.
   * @attribute
   */
  readonly clusterName: string;

  /**
   * The Amazon Resource Name (ARN) that identifies the cluster.
   * @attribute
   */
  readonly clusterArn: string;

  /**
   * The VPC associated with the cluster.
   */
  readonly vpc: ec2.IVpc;

  /**
   * Manage the allowed network connections for the cluster with Security Groups.
   */
  readonly connections: ec2.Connections;

  /**
   * Specifies whether the cluster has EC2 instance capacity.
   */
  readonly hasEc2Capacity: boolean;

  /**
   * The AWS Cloud Map namespace to associate with the cluster.
   */
  readonly defaultCloudMapNamespace?: cloudmap.INamespace;
}

/**
 * The properties to import from the ECS cluster.
 */
export interface ClusterAttributes {
  /**
   * The name of the cluster.
   */
  readonly clusterName: string;

  /**
   * The Amazon Resource Name (ARN) that identifies the cluster.
   *
   * @default Derived from clusterName
   */
  readonly clusterArn?: string;

  /**
   * The VPC associated with the cluster.
   */
  readonly vpc: ec2.IVpc;

  /**
   * The security groups associated with the container instances registered to the cluster.
   */
  readonly securityGroups: ec2.ISecurityGroup[];

  /**
   * Specifies whether the cluster has EC2 instance capacity.
   *
   * @default true
   */
  readonly hasEc2Capacity?: boolean;

  /**
   * The AWS Cloud Map namespace to associate with the cluster.
   *
   * @default - No default namespace
   */
  readonly defaultCloudMapNamespace?: cloudmap.INamespace;
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
  private _defaultCloudMapNamespace?: cloudmap.INamespace;

  /**
   * Constructs a new instance of the ImportedCluster class.
   */
  constructor(scope: Construct, id: string, props: ClusterAttributes) {
    super(scope, id);
    this.clusterName = props.clusterName;
    this.vpc = props.vpc;
    this.hasEc2Capacity = props.hasEc2Capacity !== false;
    this._defaultCloudMapNamespace = props.defaultCloudMapNamespace;

    this.clusterArn = props.clusterArn !== undefined ? props.clusterArn : Stack.of(this).formatArn({
      service: 'ecs',
      resource: 'cluster',
      resourceName: props.clusterName
    });

    let i = 1;
    for (const sgProps of props.securityGroups) {
      this.connections.addSecurityGroup(ec2.SecurityGroup.fromSecurityGroupId(this, `SecurityGroup${i}`, sgProps.securityGroupId));
      i++;
    }
  }

  public get defaultCloudMapNamespace(): cloudmap.INamespace | undefined {
    return this._defaultCloudMapNamespace;
  }
}

/**
 * The properties for adding an AutoScalingGroup.
 */
export interface AddAutoScalingGroupCapacityOptions {
  /**
   * Specifies whether the containers can access the container instance role.
   *
   * @default false
   */
  readonly canContainersAccessInstanceRole?: boolean;

  /**
   * The time period to wait before force terminating an instance that is draining.
   *
   * This creates a Lambda function that is used by a lifecycle hook for the
   * AutoScalingGroup that will delay instance termination until all ECS tasks
   * have drained from the instance. Set to 0 to disable task draining.
   *
   * Set to 0 to disable task draining.
   *
   * @default Duration.minutes(5)
   */
  readonly taskDrainTime?: Duration;
}

/**
 * The properties for adding instance capacity to an AutoScalingGroup.
 */
export interface AddCapacityOptions extends AddAutoScalingGroupCapacityOptions, autoscaling.CommonAutoScalingGroupProps {
  /**
   * The EC2 instance type to use when launching instances into the AutoScalingGroup.
   */
  readonly instanceType: ec2.InstanceType;

  /**
   * The ECS-optimized AMI variant to use. For more information, see
   * [Amazon ECS-optimized AMIs](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-optimized_AMI.html).
   *
   * @default - Amazon Linux 2
   */
  readonly machineImage?: ec2.IMachineImage;
}

/**
 * The options for creating an AWS Cloud Map namespace.
 */
export interface CloudMapNamespaceOptions {
  /**
   * The name of the namespace, such as example.com.
   */
  readonly name: string;

  /**
   * The type of CloudMap Namespace to create.
   *
   * @default PrivateDns
   */
  readonly type?: cloudmap.NamespaceType;

  /**
   * The VPC to associate the namespace with. This property is required for private DNS namespaces.
   *
   * @default VPC of the cluster for Private DNS Namespace, otherwise none
   */
  readonly vpc?: ec2.IVpc;
}

/**
 * The ECS-optimized AMI variant to use. For more information, see
 * [Amazon ECS-optimized AMIs](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-optimized_AMI.html).
 */
export enum AmiHardwareType {

  /**
   * Use the Amazon ECS-optimized Amazon Linux 2 AMI.
   */
  STANDARD = 'Standard',

  /**
   * Use the Amazon ECS GPU-optimized AMI.
   */
  GPU = 'GPU',

  /**
   * Use the Amazon ECS-optimized Amazon Linux 2 (arm64) AMI.
   */
  ARM = 'ARM64',
}
