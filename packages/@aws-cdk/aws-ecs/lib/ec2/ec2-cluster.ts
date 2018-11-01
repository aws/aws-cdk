import autoscaling = require('@aws-cdk/aws-autoscaling');
import cloudwatch = require ('@aws-cdk/aws-cloudwatch');
import ec2 = require('@aws-cdk/aws-ec2');
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import { BaseCluster, BaseClusterProps } from '../base/base-cluster';

/**
 * Properties to define an ECS cluster
 */
export interface Ec2ClusterProps extends BaseClusterProps {
  /**
   * Whether or not the containers can access the instance role
   *
   * @default false
   */
  containersAccessInstanceRole?: boolean;

  /**
   * The type of EC2 instance to launch into your Autoscaling Group
   */
  instanceType?: ec2.InstanceType;

  /**
   * Number of container instances registered in your ECS Cluster
   *
   * @default 1
   */
  size?: number;
}

/**
 * A container cluster that runs on your EC2 instances
 */
export class Ec2Cluster extends BaseCluster implements IEc2Cluster {
  /**
   * Import an existing cluster
   */
  public static import(parent: cdk.Construct, name: string, props: ImportedEc2ClusterProps): IEc2Cluster {
    return new ImportedEc2Cluster(parent, name, props);
  }

  /**
   * The AutoScalingGroup that the cluster is running on
   */
  public readonly autoScalingGroup: autoscaling.AutoScalingGroup;

  /**
   * SecurityGroup of the EC2 instances
   */
  public readonly securityGroup: ec2.SecurityGroupRef;

  constructor(parent: cdk.Construct, name: string, props: Ec2ClusterProps) {
    super(parent, name, props);

    const autoScalingGroup = new autoscaling.AutoScalingGroup(this, 'AutoScalingGroup', {
      vpc: props.vpc,
      instanceType: props.instanceType || new ec2.InstanceTypePair(ec2.InstanceClass.T2, ec2.InstanceSize.Micro),
      machineImage: new EcsOptimizedAmi(),
      updateType: autoscaling.UpdateType.ReplacingUpdate,
      minSize: 0,
      maxSize: props.size || 1,
      desiredCapacity: props.size || 1
    });

    this.securityGroup = autoScalingGroup.connections.securityGroup!;

    // Tie instances to cluster
    autoScalingGroup.addUserData(`echo ECS_CLUSTER=${this.clusterName} >> /etc/ecs/ecs.config`);

    if (!props.containersAccessInstanceRole) {
      // Deny containers access to instance metadata service
      // Source: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/instance_IAM_role.html
      autoScalingGroup.addUserData('sudo iptables --insert FORWARD 1 --in-interface docker+ --destination 169.254.169.254/32 --jump DROP');
      autoScalingGroup.addUserData('sudo service iptables save');
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
      "ecr:BatchCheckLayerAvailability",
      "ecr:GetDownloadUrlForLayer",
      "ecr:BatchGetImage",
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ).addAllResources()); // Conceivably we might do better than all resources and add targeted ARNs

    this.autoScalingGroup = autoScalingGroup;
  }

  /**
   * Export the Ec2Cluster
   */
  public export(): ImportedEc2ClusterProps {
    return {
      clusterName: new cdk.Output(this, 'ClusterName', { value: this.clusterName }).makeImportValue().toString(),
      vpc: this.vpc.export(),
      securityGroup: this.securityGroup.export(),
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
export interface IEc2Cluster {
  /**
   * Name of the cluster
   */
  readonly clusterName: string;

  /**
   * VPC that the cluster instances are running in
   */
  readonly vpc: ec2.VpcNetworkRef;

  /**
   * Security group of the cluster instances
   */
  readonly securityGroup: ec2.SecurityGroupRef;
}

/**
 * Properties to import an ECS cluster
 */
export interface ImportedEc2ClusterProps {
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
  securityGroup: ec2.SecurityGroupRefProps;
}

/**
 * An Ec2Cluster that has been imported
 */
class ImportedEc2Cluster extends cdk.Construct implements IEc2Cluster {
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
  public readonly securityGroup: ec2.SecurityGroupRef;

  constructor(parent: cdk.Construct, name: string, props: ImportedEc2ClusterProps) {
    super(parent, name);
    this.clusterName = props.clusterName;
    this.vpc = ec2.VpcNetworkRef.import(this, "vpc", props.vpc);
    this.securityGroup = ec2.SecurityGroupRef.import(this, "securityGroup", props.securityGroup);
  }
}
