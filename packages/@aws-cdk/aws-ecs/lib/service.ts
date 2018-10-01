import ec2 = require('@aws-cdk/aws-ec2');
import elb = require('@aws-cdk/aws-elasticloadbalancing');
import elbv2 = require('@aws-cdk/aws-elasticloadbalancingv2');
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import { Cluster } from './cluster';
import { cloudformation } from './ecs.generated';
import { TaskDefinition } from './task-definition';

export interface ServiceProps {
  /**
   * Cluster where service will be deployed
   */
  cluster: Cluster; // should be required? do we assume 'default' exists?

  /**
   * Task Definition used for running tasks in the service
   */
  taskDefinition: TaskDefinition;

  /**
   * Number of desired copies of running tasks
   *
   * @default 1
   */
  desiredCount?: number;

  /**
   * A name for the service.
   *
   * @default CloudFormation-generated name
   */
  serviceName?: string;

  /**
   * Whether the service is hosted in EC2 or Fargate
   *
   * @default EC2
   */
  launchType?: LaunchType;

  /**
   * The maximum number of tasks, specified as a percentage of the Amazon ECS
   * service's DesiredCount value, that can run in a service during a
   * deployment.
   *
   * @default 200
   */
  maximumPercent?: number;

  /**
   * The minimum number of tasks, specified as a percentage of
   * the Amazon ECS service's DesiredCount value, that must
   * continue to run and remain healthy during a deployment.
   *
   * @default 50
   */
  minimumHealthyPercent?: number;

  /**
   * Role used by ECS agent to register containers with the Load Balancer
   *
   * @default A role will be created for you
   */
  role?: iam.Role;

  /**
   * Time after startup to ignore unhealthy load balancer checks.
   *
   * @default ???
   */
  healthCheckGracePeriodSeconds?: number;

  ///////// TBD ///////////////////////////////
  // healthCheckGracePeriodSeconds?: number; // only needed with load balancers
  // loadBalancers?: LoadBalancer[];
  // placementConstraints?: PlacementConstraint[];
  // placementStrategies?: PlacementStrategy[];
  // networkConfiguration?: NetworkConfiguration;
  // serviceRegistries?: ServiceRegistry[];
  //
  // platformVersion?: string; // FARGATE ONLY. default is LATEST. Other options:  1.2.0, 1.1.0, 1.0.0
  ////////////////////////////////////////////
}

export class Service extends cdk.Construct implements elb.ILoadBalancerTarget,
      elbv2.IApplicationLoadBalancerTarget, elbv2.INetworkLoadBalancerTarget, cdk.IDependable {
  public readonly dependencyElements: cdk.IDependable[];
  public readonly connections: ec2.Connections;
  private loadBalancers = new Array<cloudformation.ServiceResource.LoadBalancerProperty>();
  private readonly taskDefinition: TaskDefinition;
  private role?: iam.Role;
  private readonly resource: cloudformation.ServiceResource;

  constructor(parent: cdk.Construct, name: string, props: ServiceProps) {
    super(parent, name);

    this.connections = new ec2.Connections({
      securityGroupRule: {
        canInlineRule: false,
        toEgressRuleJSON() { return {}; },
        toIngressRuleJSON() { return {}; },
        uniqueId: ''
      },
    });

    this.taskDefinition = props.taskDefinition;
    if (!this.taskDefinition.defaultContainer) {
      throw new Error('A TaskDefinition must have at least one essential container');
    }

    this.role = props.role;

    this.resource = new cloudformation.ServiceResource(this, "Service", {
      cluster: props.cluster.clusterName,
      taskDefinition: props.taskDefinition.taskDefinitionArn,
      desiredCount: props.desiredCount,
      serviceName: props.serviceName,
      launchType: props.launchType,
      loadBalancers: new cdk.Token(() => this.loadBalancers),
      deploymentConfiguration: {
        maximumPercent: props.maximumPercent,
        minimumHealthyPercent: props.minimumHealthyPercent
      },
      role: new cdk.Token(() => this.role && this.role.roleArn),
    });

    this.dependencyElements = [this.resource];
  }

  public attachToClassicLB(loadBalancer: elb.LoadBalancer): void {
    // FIXME: If Fargate then throw a helpful error
    // FIXME: Security Groups
    this.loadBalancers.push({
      loadBalancerName: loadBalancer.loadBalancerName,
      containerName: this.taskDefinition.defaultContainer!.name,
      containerPort: this.taskDefinition.defaultContainer!.loadBalancerPort(true),
    });
    this.createLoadBalancerRole();
  }

  public attachToApplicationTargetGroup(targetGroup: elbv2.ApplicationTargetGroup): elbv2.LoadBalancerTargetProps {
    // FIXME: Security Groups
    this.loadBalancers.push({
      targetGroupArn: targetGroup.targetGroupArn,
      containerName: this.taskDefinition.defaultContainer!.name,
      containerPort: this.taskDefinition.defaultContainer!.loadBalancerPort(false),
    });
    this.createLoadBalancerRole();

    return { targetType: elbv2.TargetType.SelfRegistering };
  }

  public attachToNetworkTargetGroup(targetGroup: elbv2.NetworkTargetGroup): elbv2.LoadBalancerTargetProps {
    this.loadBalancers.push({
      targetGroupArn: targetGroup.targetGroupArn,
      containerName: this.taskDefinition.defaultContainer!.name,
      containerPort: this.taskDefinition.defaultContainer!.loadBalancerPort(false),
    });
    this.createLoadBalancerRole();

    return { targetType: elbv2.TargetType.SelfRegistering };
  }

  public createLoadBalancerRole() {
    if (!this.role) {
      this.role = new iam.Role(this, 'Role', {
        assumedBy: new cdk.ServicePrincipal('ecs-tasks.amazonaws.com'),
      });
      this.role.attachManagedPolicy(new iam.AwsManagedPolicy('service-role/AmazonEC2ContainerServiceRole').policyArn);
      this.resource.addDependency(this.role);
    }
  }

}

export enum LaunchType {
  EC2 = 'EC2',
  Fargate = 'FARGATE'
}