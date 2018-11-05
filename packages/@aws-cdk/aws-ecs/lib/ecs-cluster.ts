import autoscaling = require('@aws-cdk/aws-autoscaling');
import cloudwatch = require ('@aws-cdk/aws-cloudwatch');
import ec2 = require('@aws-cdk/aws-ec2');
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import { cloudformation } from './ecs.generated';

/**
 * Properties to define an ECS cluster
 */
export interface EcsClusterProps {
  /**
   * A name for the cluster.
   *
   * @default CloudFormation-generated name
   */
  clusterName?: string;

  /**
   * The VPC where your ECS instances will be running or your ENIs will be deployed
   */
  vpc: ec2.VpcNetworkRef;
}

/**
 * A container cluster that runs on your EC2 instances
 */
export class EcsCluster extends cdk.Construct implements IEcsCluster {
  /**
   * Import an existing cluster
   */
  public static import(parent: cdk.Construct, name: string, props: ImportedEcsClusterProps): IEcsCluster {
    return new ImportedEcsCluster(parent, name, props);
  }

  /**
   * Connections manager for the EC2 cluster
   */
  public readonly connections: ec2.Connections = new ec2.Connections();

  /**
   * The VPC this cluster was created in.
   */
  public readonly vpc: ec2.VpcNetworkRef;

  /**
   * The ARN of this cluster
   */
  public readonly clusterArn: string;

  /**
   * The name of this cluster
   */
  public readonly clusterName: string;

  constructor(parent: cdk.Construct, name: string, props: EcsClusterProps) {
    super(parent, name);

    const cluster = new cloudformation.ClusterResource(this, 'Resource', {clusterName: props.clusterName});

    this.vpc = props.vpc;
    this.clusterArn = cluster.clusterArn;
    this.clusterName = cluster.clusterName;
  }

  /**
   * Add a default-configured AutoScalingGroup running the ECS-optimized AMI to this Cluster
   */
  public addDefaultAutoScalingGroupCapacity(options: AddDefaultAutoScalingGroupOptions) {
    const autoScalingGroup = new autoscaling.AutoScalingGroup(this, 'DefaultAutoScalingGroup', {
      vpc: this.vpc,
      instanceType: options.instanceType,
      machineImage: new EcsOptimizedAmi(),
      updateType: autoscaling.UpdateType.ReplacingUpdate,
      minSize: 0,
      maxSize: options.instanceCount || 1,
      desiredCapacity: options.instanceCount || 1
    });

    this.addAutoScalingGroupCapacity(autoScalingGroup);
  }

  /**
   * Add compute capacity to this ECS cluster in the form of an AutoScalingGroup
   */
  public addAutoScalingGroupCapacity(autoScalingGroup: autoscaling.AutoScalingGroup, options: AddAutoScalingGroupCapacityOptions = {}) {
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
  }

  /**
   * Export the EcsCluster
   */
  public export(): ImportedEcsClusterProps {
    return {
      clusterName: new cdk.Output(this, 'ClusterName', { value: this.clusterName }).makeImportValue().toString(),
      vpc: this.vpc.export(),
      securityGroups: this.connections.securityGroups.map(sg => sg.export()),
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

/**
 * Construct a Linux machine image from the latest ECS Optimized AMI published in SSM
 */
export class EcsOptimizedAmi implements ec2.IMachineImageSource  {
  private static AmiParameterName = "/aws/service/ecs/optimized-ami/amazon-linux/recommended";

  /**
   * Return the correct image
   */
  public getImage(parent: cdk.Construct): ec2.MachineImage {
    const ssmProvider = new cdk.SSMParameterProvider(parent, {
        parameterName: EcsOptimizedAmi.AmiParameterName
    });

    const json = ssmProvider.parameterValue("{\"image_id\": \"\"}");
    const ami = JSON.parse(json).image_id;

    return new ec2.MachineImage(ami, new ec2.LinuxOS());
  }
}

/**
 * An ECS cluster
 */
export interface IEcsCluster {
  /**
   * Name of the cluster
   */
  readonly clusterName: string;

  /**
   * VPC that the cluster instances are running in
   */
  readonly vpc: ec2.VpcNetworkRef;

  /**
   * Connections manager of the cluster instances
   */
  readonly connections: ec2.Connections;
}

/**
 * Properties to import an ECS cluster
 */
export interface ImportedEcsClusterProps {
  /**
   * Name of the cluster
   */
  clusterName: string;

  /**
   * VPC that the cluster instances are running in
   */
  vpc: ec2.VpcNetworkRefProps;

  /**
   * Security group of the cluster instances
   */
  securityGroups: ec2.SecurityGroupRefProps[];
}

/**
 * An EcsCluster that has been imported
 */
class ImportedEcsCluster extends cdk.Construct implements IEcsCluster {
  /**
   * Name of the cluster
   */
  public readonly clusterName: string;

  /**
   * VPC that the cluster instances are running in
   */
  public readonly vpc: ec2.VpcNetworkRef;

  /**
   * Security group of the cluster instances
   */
  public readonly connections = new ec2.Connections();

  constructor(parent: cdk.Construct, name: string, props: ImportedEcsClusterProps) {
    super(parent, name);
    this.clusterName = props.clusterName;
    this.vpc = ec2.VpcNetworkRef.import(this, "vpc", props.vpc);

    let i = 1;
    for (const sgProps of props.securityGroups) {
      this.connections.addSecurityGroup(ec2.SecurityGroupRef.import(this, `SecurityGroup${i}`, sgProps));
      i++;
    }
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
}

/**
 * Properties for adding autoScalingGroup
 */
export interface AddDefaultAutoScalingGroupOptions {

  /**
   * The type of EC2 instance to launch into your Autoscaling Group
   */
  instanceType: ec2.InstanceType;

  /**
   * Number of container instances registered in your ECS Cluster
   *
   * @default 1
   */
  instanceCount?: number;
}
