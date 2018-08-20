import ec2 = require('@aws-cdk/aws-ec2');
import iam = require('@aws-cdk/aws-iam');
import sns = require('@aws-cdk/aws-sns');
import cdk = require('@aws-cdk/cdk');

import { cloudformation } from './autoscaling.generated';

/**
 * Properties of a Fleet
 */
export interface AutoScalingGroupProps {
    /**
     * Type of instance to launch
     */
    instanceType: ec2.InstanceType;

    /**
     * Minimum number of instances in the fleet
     * @default 1
     */
    minSize?: number;

    /**
     * Maximum number of instances in the fleet
     * @default 1
     */
    maxSize?: number;

    /**
     * Initial amount of instances in the fleet
     * @default 1
     */
    desiredCapacity?: number;

    /**
     * Name of SSH keypair to grant access to instances
     * @default No SSH access will be possible
     */
    keyName?: string;

    /**
     * AMI to launch
     */
    machineImage: ec2.IMachineImageSource;

    /**
     * VPC to launch these instances in.
     */
    vpc: ec2.VpcNetworkRef;

    /**
     * Where to place instances within the VPC
     */
    vpcPlacement?: ec2.VpcPlacementStrategy;

    /**
     * SNS topic to send notifications about fleet changes
     * @default No fleet change notifications will be sent.
     */
    notificationsTopic?: sns.TopicRef;

    /**
     * Whether the instances can initiate connections to anywhere by default
     *
     * @default true
     */
    allowAllOutbound?: boolean;
}

/**
 * A Fleet represents a managed set of EC2 instances
 *
 * The Fleet models a number of AutoScalingGroups, a launch configuration, a
 * security group and an instance role.
 *
 * It allows adding arbitrary commands to the startup scripts of the instances
 * in the fleet.
 *
 * The ASG spans all availability zones.
 */
export class AutoScalingGroup extends cdk.Construct implements ec2.IClassicLoadBalancerTarget, ec2.IConnectable {
    /**
     * The type of OS instances of this fleet are running.
     */
    public readonly osType: ec2.OperatingSystemType;

    /**
     * Allows specify security group connections for instances of this fleet.
     */
    public readonly connections: ec2.Connections;

    /**
     * The IAM role assumed by instances of this fleet.
     */
    public readonly role: iam.Role;

    private readonly userDataLines = new Array<string>();
    private readonly autoScalingGroup: cloudformation.AutoScalingGroupResource;
    private readonly securityGroup: ec2.SecurityGroup;
    private readonly loadBalancerNames: cdk.Token[] = [];

    constructor(parent: cdk.Construct, name: string, props: AutoScalingGroupProps) {
        super(parent, name);

        this.securityGroup = new ec2.SecurityGroup(this, 'InstanceSecurityGroup', { vpc: props.vpc });
        this.connections = new ec2.Connections({ securityGroup: this.securityGroup });

        if (props.allowAllOutbound !== false) {
            this.connections.allowTo(new ec2.AnyIPv4(), new ec2.AllConnections(), 'Outbound traffic allowed by default');
        }

        this.role = new iam.Role(this, 'InstanceRole', {
            assumedBy: new cdk.ServicePrincipal('ec2.amazonaws.com')
        });

        const iamProfile = new iam.cloudformation.InstanceProfileResource(this, 'InstanceProfile', {
            roles: [ this.role.roleName ]
        });

        // use delayed evaluation
        const machineImage = props.machineImage.getImage(this);
        const userDataToken = new cdk.Token(() => new cdk.FnBase64((machineImage.os.createUserData(this.userDataLines))));

        const launchConfig = new cloudformation.LaunchConfigurationResource(this, 'LaunchConfig', {
            imageId: machineImage.imageId,
            keyName: props.keyName,
            instanceType: props.instanceType.toString(),
            securityGroups: [this.securityGroup.securityGroupId],
            iamInstanceProfile: iamProfile.ref,
            userData: userDataToken
        });

        launchConfig.addDependency(this.role);

        const minSize = props.minSize || 1;
        const maxSize = props.maxSize || 1;
        const desiredCapacity = props.desiredCapacity || 1;

        const asgProps: cloudformation.AutoScalingGroupResourceProps = {
            minSize: minSize.toString(),
            maxSize: maxSize.toString(),
            desiredCapacity: desiredCapacity.toString(),
            launchConfigurationName: launchConfig.ref,
            loadBalancerNames: new cdk.Token(() => this.loadBalancerNames),
        };

        if (props.notificationsTopic) {
            asgProps.notificationConfigurations = [];
            asgProps.notificationConfigurations.push({
                topicArn: props.notificationsTopic.topicArn,
                notificationTypes: [
                    "autoscaling:EC2_INSTANCE_LAUNCH",
                    "autoscaling:EC2_INSTANCE_LAUNCH_ERROR",
                    "autoscaling:EC2_INSTANCE_TERMINATE",
                    "autoscaling:EC2_INSTANCE_TERMINATE_ERROR"
                ],
            });
        }

        const subnets = props.vpc.subnets(props.vpcPlacement);
        asgProps.vpcZoneIdentifier = subnets.map(n => n.subnetId);

        this.autoScalingGroup = new cloudformation.AutoScalingGroupResource(this, 'ASG', asgProps);
        this.osType = machineImage.os.type;
    }

    public attachToClassicLB(loadBalancer: ec2.ClassicLoadBalancer): void {
        this.loadBalancerNames.push(loadBalancer.loadBalancerName);
    }

    /**
     * Add command to the startup script of fleet instances.
     * The command must be in the scripting language supported by the fleet's OS (i.e. Linux/Windows).
     */
    public addUserData(script: string) {
        this.userDataLines.push(script);
    }

    public autoScalingGroupName() {
        return this.autoScalingGroup.ref;
    }

    /**
     * Adds a statement to the IAM role assumed by instances of this fleet.
     */
    public addToRolePolicy(statement: cdk.PolicyStatement) {
        this.role.addToPolicy(statement);
    }
}
