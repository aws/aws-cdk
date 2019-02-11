import autoscaling = require('@aws-cdk/aws-autoscaling');
import cloudwatch = require ('@aws-cdk/aws-cloudwatch');
import ec2 = require('@aws-cdk/aws-ec2');
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
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
  clusterName?: string;

  /**
   * The VPC where your ECS instances will be running or your ENIs will be deployed
   */
  vpc: ec2.IVpcNetwork;
}

/**
 * A container cluster that runs on your EC2 instances
 */
export class Cluster extends cdk.Construct implements ICluster {
  /**
   * Import an existing cluster
   */
  public static import(scope: cdk.Construct, id: string, props: ClusterImportProps): ICluster {
    return new ImportedCluster(scope, id, props);
  }

  /**
   * Connections manager for the EC2 cluster
   */
  public readonly connections: ec2.Connections = new ec2.Connections();

  /**
   * The VPC this cluster was created in.
   */
  public readonly vpc: ec2.IVpcNetwork;

  /**
   * The ARN of this cluster
   */
  public readonly clusterArn: string;

  /**
   * The name of this cluster
   */
  public readonly clusterName: string;

  /**
   * Whether the cluster has EC2 capacity associated with it
   */
  private _hasEc2Capacity: boolean = false;

  constructor(scope: cdk.Construct, id: string, props: ClusterProps) {
    super(scope, id);

    const cluster = new CfnCluster(this, 'Resource', {clusterName: props.clusterName});

    this.vpc = props.vpc;
    this.clusterArn = cluster.clusterArn;
    this.clusterName = cluster.clusterName;
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
      machineImage: new EcsOptimizedAmi(),
      updateType: options.updateType || autoscaling.UpdateType.ReplacingUpdate,
      instanceType: options.instanceType,
    });

    this.addAutoScalingGroup(autoScalingGroup, options);

    return autoScalingGroup;
  }

  /**
   * Add compute capacity to this ECS cluster in the form of an AutoScalingGroup
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
   * Export the Cluster
   */
  public export(): ClusterImportProps {
    return {
      clusterName: new cdk.Output(this, 'ClusterName', { value: this.clusterName }).makeImportValue().toString(),
      clusterArn: this.clusterArn,
      vpc: this.vpc.export(),
      securityGroups: this.connections.securityGroups.map(sg => sg.export()),
      hasEc2Capacity: this.hasEc2Capacity,
    };
  }

  /**
   * Metric for cluster CPU reservation
   *
   * @default average over 5 minutes
   */
  public metricCpuReservation(props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
    return this.metric('CPUReservation', props);
  }

  /**
   * Metric for cluster Memory reservation
   *
   * @default average over 5 minutes
   */
  public metricMemoryReservation(props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
    return this.metric('MemoryReservation', props );
  }

  /**
   * Return the given named metric for this Cluster
   */
  public metric(metricName: string, props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
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
   * @default AmazonLinux
   */
  generation?: ec2.AmazonLinuxGeneration;
}

/**
 * Construct a Linux machine image from the latest ECS Optimized AMI published in SSM
 */
export class EcsOptimizedAmi implements ec2.IMachineImageSource {
  private readonly generation: ec2.AmazonLinuxGeneration;
  private readonly amiParameterName: string;

  constructor(props?: EcsOptimizedAmiProps) {
    this.generation = (props && props.generation) || ec2.AmazonLinuxGeneration.AmazonLinux;
    if (this.generation === ec2.AmazonLinuxGeneration.AmazonLinux2) {
      this.amiParameterName = "/aws/service/ecs/optimized-ami/amazon-linux-2/recommended";
    } else {
      this.amiParameterName = "/aws/service/ecs/optimized-ami/amazon-linux/recommended";
    }
  }

  /**
   * Return the correct image
   */
  public getImage(scope: cdk.Construct): ec2.MachineImage {
    const ssmProvider = new cdk.SSMParameterProvider(scope, {
      parameterName: this.amiParameterName
    });

    const json = ssmProvider.parameterValue("{\"image_id\": \"\"}");
    const ami = JSON.parse(json).image_id;

    return new ec2.MachineImage(ami, new ec2.LinuxOS());
  }
}

/**
 * An ECS cluster
 */
export interface ICluster extends cdk.IConstruct {
  /**
   * Name of the cluster
   */
  readonly clusterName: string;

  /**
   * The ARN of this cluster
   */
  readonly clusterArn: string;

  /**
   * VPC that the cluster instances are running in
   */
  readonly vpc: ec2.IVpcNetwork;

  /**
   * Connections manager of the cluster instances
   */
  readonly connections: ec2.Connections;

  /**
   * Whether the cluster has EC2 capacity associated with it
   */
  readonly hasEc2Capacity: boolean;

  /**
   * Export the Cluster
   */
  export(): ClusterImportProps;
}

/**
 * Properties to import an ECS cluster
 */
export interface ClusterImportProps {
  /**
   * Name of the cluster
   */
  clusterName: string;

  /**
   * ARN of the cluster
   *
   * @default Derived from clusterName
   */
  clusterArn?: string;

  /**
   * VPC that the cluster instances are running in
   */
  vpc: ec2.VpcNetworkImportProps;

  /**
   * Security group of the cluster instances
   */
  securityGroups: ec2.SecurityGroupImportProps[];

  /**
   * Whether the given cluster has EC2 capacity
   *
   * @default true
   */
  hasEc2Capacity?: boolean;
}

/**
 * An Cluster that has been imported
 */
class ImportedCluster extends cdk.Construct implements ICluster {
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
  public readonly vpc: ec2.IVpcNetwork;

  /**
   * Security group of the cluster instances
   */
  public readonly connections = new ec2.Connections();

  /**
   * Whether the cluster has EC2 capacity
   */
  public readonly hasEc2Capacity: boolean;

  constructor(scope: cdk.Construct, id: string, private readonly props: ClusterImportProps) {
    super(scope, id);
    this.clusterName = props.clusterName;
    this.vpc = ec2.VpcNetwork.import(this, "vpc", props.vpc);
    this.hasEc2Capacity = props.hasEc2Capacity !== false;

    this.clusterArn = props.clusterArn !== undefined ? props.clusterArn : cdk.Stack.find(this).formatArn({
      service: 'ecs',
      resource: 'cluster',
      resourceName: props.clusterName,
    });

    let i = 1;
    for (const sgProps of props.securityGroups) {
      this.connections.addSecurityGroup(ec2.SecurityGroup.import(this, `SecurityGroup${i}`, sgProps));
      i++;
    }
  }

  public export() {
    return this.props;
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
  containersAccessInstanceRole?: boolean;

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
  taskDrainTimeSeconds?: number;
}

/**
 * Properties for adding autoScalingGroup
 */
export interface AddCapacityOptions extends AddAutoScalingGroupCapacityOptions, autoscaling.CommonAutoScalingGroupProps {
  /**
   * The type of EC2 instance to launch into your Autoscaling Group
   */
  instanceType: ec2.InstanceType;
}
