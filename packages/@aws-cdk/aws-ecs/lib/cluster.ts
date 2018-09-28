import autoscaling = require('@aws-cdk/aws-autoscaling');
import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import { cloudformation } from './ecs.generated';
import { Service } from './service';
import { TaskDefinition } from './task-definition';

export interface ClusterProps {
  /**
   * A name for the cluster.
   *
   * @default CloudFormation-generated name
   */
  clusterName?: string;

  /**
   * The VPC where your ECS instances will be running
   */
  vpc: ec2.VpcNetworkRef;

  /**
   * Whether or not the containers can access the instance role
   *
   * @default false
   */
  containersAccessInstanceRole?: boolean;
}

/**
 * Construct a Linux machine image from the latest ECS Optimized AMI published in SSM
 */
export class EcsOptimizedAmi implements ec2.IMachineImageSource  {
  private static AmiParamterName = "/aws/service/ecs/optimized-ami/amazon-linux/recommended";

  public getImage(parent: cdk.Construct): ec2.MachineImage {
    const ssmProvider = new cdk.SSMParameterProvider(parent);

    const ami = ssmProvider.getString(EcsOptimizedAmi.AmiParamterName);
    return new ec2.MachineImage(ami, new ec2.LinuxOS());
  }
}

export class Cluster extends cdk.Construct {

  public readonly clusterArn: string;

  public readonly clusterName: string;

  public readonly fleet: autoscaling.AutoScalingGroup;

  constructor(parent: cdk.Construct, name: string, props: ClusterProps) {
    super(parent, name);

    const cluster = new cloudformation.ClusterResource(this, 'Resource', {clusterName: props.clusterName});

    this.clusterArn = cluster.clusterArn;
    this.clusterName = cluster.ref;

    const autoScalingGroup = new autoscaling.AutoScalingGroup(this, 'AutoScalingGroup', {
      vpc: props.vpc,
      instanceType: new ec2.InstanceTypePair(ec2.InstanceClass.M4, ec2.InstanceSize.XLarge),
      machineImage: new EcsOptimizedAmi(),
      updateType: autoscaling.UpdateType.ReplacingUpdate
    });

    // Tie instances to cluster
    autoScalingGroup.addUserData(`echo ECS_CLUSTER=${this.clusterName} >> /etc/ecs/ecs.config`);

    if (!props.containersAccessInstanceRole) {
      // Deny containers access to instance metadata service
      // Source: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/instance_IAM_role.html
      autoScalingGroup.addUserData('sudo iptables --insert FORWARD 1 --in-interface docker+ --destination 169.254.169.254/32 --jump DROP');
      autoScalingGroup.addUserData('sudo service iptables save');
    }

    // Note: if the fleet doesn't launch or doesn't register itself with
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
    autoScalingGroup.addToRolePolicy(new cdk.PolicyStatement().addActions(
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

    this.fleet = autoScalingGroup;
  }

  public runService(taskDefinition: TaskDefinition): Service {
    return new Service(this, `${taskDefinition.family}Service`, {
      cluster: this,
      taskDefinition,
      // FIXME: additional props? Or set on Service object?
    });
  }
}
