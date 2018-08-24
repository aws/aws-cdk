import autoscaling = require('@aws-cdk/aws-autoscaling');
import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import { cloudformation, ClusterArn} from './ecs.generated';
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

// This works for now but how will we keep this list up to date?
export const ECS_OPTIMIZED_AMI = new ec2.GenericLinuxImage({
    'us-east-2': 'ami-028a9de0a7e353ed9',
    'us-east-1': 'ami-00129b193dc81bc31',
    'us-west-2': 'ami-00d4f478',
    'us-west-1': 'ami-0d438d09af26c9583',
    'eu-west-2': 'ami-a44db8c3',
    'eu-west-3': 'ami-07da674f0655ef4e1',
    'eu-west-1': 'ami-0af844a965e5738db',
    'eu-central-1': 'ami-0291ba887ba0d515f',
    'ap-northeast-2': 'ami-047d2a61f94f862dc',
    'ap-northeast-1': 'ami-0041c416aa23033a2',
    'ap-southeast-2': 'ami-0092e55c70015d8c3',
    'ap-southeast-1': 'ami-091bf462afdb02c60',
    'ca-central-1': 'ami-192fa27d',
    'ap-south-1': 'ami-0c179ca015d301829',
    'sa-east-1': 'ami-0018ff8ee48970ac3',
    'us-gov-west-1': 'ami-c6079ba7',
});

// Needs to inherit from CloudFormationToken to make the string substitution
// downstairs work. This is temporary, will go away in the near future.
export class ClusterName extends cdk.CloudFormationToken {
}

export class Cluster extends cdk.Construct {

    public readonly clusterArn: ClusterArn;

    public readonly clusterName: ClusterName;

    public readonly fleet: autoscaling.AutoScalingGroup;

    constructor(parent: cdk.Construct, name: string, props: ClusterProps) {
        super(parent, name);

        const cluster = new cloudformation.ClusterResource(this, "Resource", {clusterName: props.clusterName});

        this.clusterArn = cluster.clusterArn;

        this.clusterName = new ClusterName(cluster.ref);

        const taskDef = new TaskDefinition(this, "MyTD");

        new Service(this, "Service", {
            cluster: this.clusterName,
            taskDefinition: taskDef.taskDefinitionArn,
            desiredCount: 1,
        });

        const fleet = new autoscaling.AutoScalingGroup(this, 'MyASG', {
            vpc: props.vpc,
            instanceType: new ec2.InstanceTypePair(ec2.InstanceClass.M4, ec2.InstanceSize.XLarge),
            machineImage: ECS_OPTIMIZED_AMI,
            updateType: autoscaling.UpdateType.ReplacingUpdate
        });

        // Tie instances to cluster
        fleet.addUserData(`echo ECS_CLUSTER=${this.clusterName} >> /etc/ecs/ecs.config`);

        if (!props.containersAccessInstanceRole) {
            // Deny containers access to instance metadata service
            // Source: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/instance_IAM_role.html
            fleet.addUserData('sudo iptables --insert FORWARD 1 --in-interface docker+ --destination 169.254.169.254/32 --jump DROP');
            fleet.addUserData('sudo service iptables save');
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
        fleet.addToRolePolicy(new cdk.PolicyStatement().addActions(
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

        this.fleet = fleet;

    }
}
