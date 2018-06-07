import { Construct, FnBase64, PolicyStatement, ServicePrincipal, Token } from '@aws-cdk/core';
import { Role } from '@aws-cdk/iam';
import { autoscaling, iam, sns } from '@aws-cdk/resources';
import { AllConnections, AnyIPv4, IConnectionPeer } from './connection';
import { Connections } from './connections';
import { InstanceType } from './instance-types';
import { ClassicLoadBalancer, IClassicLoadBalancerTarget } from './load-balancer';
import { IMachineImageSource, OperatingSystemType } from './machine-image';
import { SecurityGroup } from './security-group';
import { VpcNetworkRef, VpcPlacementStrategy } from './vpc-ref';

/**
 * Properties of a Fleet
 */
export interface FleetProps {
    /**
     * Type of instance to launch
     */
    instanceType: InstanceType;

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
    machineImage: IMachineImageSource;

    /**
     * VPC to launch these instances in.
     */
    vpc: VpcNetworkRef;

    /**
     * Where to place instances within the VPC
     */
    vpcPlacement?: VpcPlacementStrategy;

    /**
     * SNS topic to send notifications about fleet changes
     * @default No fleet change notifications will be sent.
     */
    notificationsTopic?: sns.TopicResource;

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
export class Fleet extends Construct implements IClassicLoadBalancerTarget {
    public readonly connectionPeer: IConnectionPeer;

    /**
     * The type of OS instances of this fleet are running.
     */
    public readonly osType: OperatingSystemType;

    /**
     * Allows specify security group connections for instances of this fleet.
     */
    public readonly connections: Connections;

    /**
     * The IAM role assumed by instances of this fleet.
     */
    public readonly role: Role;

    private readonly userDataLines = new Array<string>();
    private readonly autoScalingGroup: autoscaling.AutoScalingGroupResource;
    private readonly securityGroup: SecurityGroup;
    private readonly loadBalancerNames: Token[] = [];

    constructor(parent: Construct, name: string, props: FleetProps) {
        super(parent, name);

        this.securityGroup = new SecurityGroup(this, 'InstanceSecurityGroup', { vpc: props.vpc });
        this.connections = new Connections(this.securityGroup);
        this.connectionPeer = this.securityGroup;

        if (props.allowAllOutbound !== false) {
            this.connections.allowTo(new AnyIPv4(), new AllConnections(), 'Outbound traffic allowed by default');
        }

        this.role = new Role(this, 'InstanceRole', {
            assumedBy: new ServicePrincipal('ec2.amazonaws.com')
        });

        const iamProfile = new iam.InstanceProfileResource(this, 'InstanceProfile', {
            roles: [ this.role.roleName ]
        });

        // use delayed evaluation
        const machineImage = props.machineImage.getImage(this);
        const userDataToken = new Token(() => new FnBase64((machineImage.os.createUserData(this.userDataLines))));

        const launchConfig = new autoscaling.LaunchConfigurationResource(this, 'LaunchConfig', {
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

        const asgProps: autoscaling.AutoScalingGroupResourceProps = {
            minSize: minSize.toString(),
            maxSize: maxSize.toString(),
            desiredCapacity: desiredCapacity.toString(),
            launchConfigurationName: launchConfig.ref,
            loadBalancerNames: new Token(() => this.loadBalancerNames),
        };

        if (props.notificationsTopic) {
            asgProps.notificationConfigurations = [];
            asgProps.notificationConfigurations.push({
                topicArn: props.notificationsTopic.ref,
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

        this.autoScalingGroup = new autoscaling.AutoScalingGroupResource(this, 'ASG', asgProps);
        this.osType = machineImage.os.type;
    }

    public attachToClassicLB(loadBalancer: ClassicLoadBalancer): void {
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
    public addToRolePolicy(statement: PolicyStatement) {
        this.role.addToPolicy(statement);
    }
}
