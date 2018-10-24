import autoscaling = require('@aws-cdk/aws-autoscaling');
import cloudwatch = require ('@aws-cdk/aws-cloudwatch');
import ec2 = require('@aws-cdk/aws-ec2');
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import { BaseCluster, BaseClusterProps } from '../base/base-cluster';

export interface EcsClusterProps extends BaseClusterProps {
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

export class EcsCluster extends BaseCluster implements IEcsCluster {
  public static import(parent: cdk.Construct, name: string, props: ImportedEcsClusterProps): IEcsCluster {
    return new ImportedEcsCluster(parent, name, props);
  }

  public readonly autoScalingGroup: autoscaling.AutoScalingGroup;
  public readonly securityGroup: ec2.SecurityGroupRef;

  constructor(parent: cdk.Construct, name: string, props: EcsClusterProps) {
    super(parent, name, props);

    const autoScalingGroup = new autoscaling.AutoScalingGroup(this, 'AutoScalingGroup', {
      vpc: props.vpc,
      instanceType: props.instanceType || new ec2.InstanceTypePair(ec2.InstanceClass.T2, ec2.InstanceSize.Micro),
      machineImage: new EcsOptimizedAmi(),
      updateType: autoscaling.UpdateType.ReplacingUpdate,
      minSize: 0, // NOTE: This differs from default of 1 in ASG construct lib -- also does not appear to work?
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

    // Note: if the ASG doesn't launch or doesn't register itself with
    // ECS, *Cluster* stabilization will fail after timing our for an hour
    // or so, because the *Service* doesn't have any running instances.
    // During this time, you CANNOT DO ANYTHING ELSE WITH YOUR STACK.
    //
    // Apart from the weird relationship here between Cluster and Service
    // (why is Cluster failing and not Service?), the experience is...
    //
    // NOT GREAT.
    //
    // Also, there's sort of a bidirectional dependency between Cluster and ASG:
    //
    // - ASG depends on Cluster to get the ClusterName (which needs to go into
    //   UserData).
    // - Cluster depends on ASG to boot up, so the service is launched, so the
    //   Cluster can stabilize.

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
   * Export the EcsCluster
   */
  public export(): ImportedEcsClusterProps {
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

  public getImage(parent: cdk.Construct): ec2.MachineImage {
    const ssmProvider = new cdk.SSMParameterProvider(parent);

    const json = ssmProvider.getString(EcsOptimizedAmi.AmiParameterName, "{\"image_id\": \"\"}");
    const ami = JSON.parse(json).image_id;

    return new ec2.MachineImage(ami, new ec2.LinuxOS());
  }
}

export interface IEcsCluster {
  readonly clusterName: string;
  readonly vpc: ec2.VpcNetworkRef;
  readonly securityGroup: ec2.SecurityGroupRef;
}

export interface ImportedEcsClusterProps {
  readonly clusterName: string;
  readonly vpc: ec2.VpcNetworkRefProps;
  readonly securityGroup: ec2.SecurityGroupRefProps;
}

// /**
//  * A EcsCluster that has been imported
//  */
class ImportedEcsCluster extends cdk.Construct implements IEcsCluster {
  public readonly clusterName: string;
  public readonly vpc: ec2.VpcNetworkRef;
  public readonly securityGroup: ec2.SecurityGroupRef;

  constructor(parent: cdk.Construct, name: string, props: ImportedEcsClusterProps) {
    super(parent, name);
    this.clusterName = props.clusterName;
    this.vpc = ec2.VpcNetworkRef.import(this, "vpc", props.vpc);
    this.securityGroup = ec2.SecurityGroupRef.import(this, "securityGroup", props.securityGroup);
  }
}
