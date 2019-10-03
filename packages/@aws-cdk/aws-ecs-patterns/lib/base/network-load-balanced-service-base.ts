import { IVpc } from '@aws-cdk/aws-ec2';
import { AwsLogDriver, BaseService, CloudMapOptions, Cluster, ContainerImage, ICluster, LogDriver, PropagatedTagSource, Secret } from '@aws-cdk/aws-ecs';
import { NetworkListener, NetworkLoadBalancer, NetworkTargetGroup } from '@aws-cdk/aws-elasticloadbalancingv2';
import { IRole } from '@aws-cdk/aws-iam';
import { AddressRecordTarget, ARecord, IHostedZone } from '@aws-cdk/aws-route53';
import { LoadBalancerTarget } from '@aws-cdk/aws-route53-targets';
import cdk = require('@aws-cdk/core');

/**
 * The properties for the base NetworkLoadBalancedEc2Service or NetworkLoadBalancedFargateService service.
 */
export interface NetworkLoadBalancedServiceBaseProps {
  /**
   * The name of the cluster that hosts the service.
   *
   * If a cluster is specified, the vpc construct should be omitted. Alternatively, you can omit both cluster and vpc.
   * @default - create a new cluster; if both cluster and vpc are omitted, a new VPC will be created for you.
   */
  readonly cluster?: ICluster;

  /**
   * The VPC where the container instances will be launched or the elastic network interfaces (ENIs) will be deployed.
   *
   * If a vpc is specified, the cluster construct should be omitted. Alternatively, you can omit both vpc and cluster.
   * @default - uses the VPC defined in the cluster or creates a new VPC.
   */
  readonly vpc?: IVpc;

  /**
   * The properties required to create a new task definition. One of taskImageOptions or taskDefinition must be specified.
   *
   * @default - none
   */
  readonly taskImageOptions?: NetworkLoadBalancedTaskImageOptions;

  /**
   * Determines whether the Load Balancer will be internet-facing.
   *
   * @default true
   */
  readonly publicLoadBalancer?: boolean;

  /**
   * The desired number of instantiations of the task definition to keep running on the service.
   *
   * @default 1
   */
  readonly desiredCount?: number;

  /**
   * The domain name for the service, e.g. "api.example.com."
   *
   * @default - No domain name.
   */
  readonly domainName?: string;

  /**
   * The Route53 hosted zone for the domain, e.g. "example.com."
   *
   * @default - No Route53 hosted domain zone.
   */
  readonly domainZone?: IHostedZone;

  /**
   * The name of the service.
   *
   * @default - CloudFormation-generated name.
   */
  readonly serviceName?: string;

  /**
   * The period of time, in seconds, that the Amazon ECS service scheduler ignores unhealthy
   * Elastic Load Balancing target health checks after a task has first started.
   *
   * @default - defaults to 60 seconds if at least one load balancer is in-use and it is not already set
   */
  readonly healthCheckGracePeriod?: cdk.Duration;

  /**
   * The network load balancer that will serve traffic to the service.
   *
   * [disable-awslint:ref-via-interface]
   *
   * @default - a new load balancer will be created.
   */
  readonly loadBalancer?: NetworkLoadBalancer;

  /**
   * Specifies whether to propagate the tags from the task definition or the service to the tasks in the service.
   * Tags can only be propagated to the tasks within the service during service creation.
   *
   * @default - none
   */
  readonly propagateTags?: PropagatedTagSource;

  /**
   * Specifies whether to enable Amazon ECS managed tags for the tasks within the service. For more information, see
   * [Tagging Your Amazon ECS Resources](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-using-tags.html)
   *
   * @default false
   */
  readonly enableECSManagedTags?: boolean;

  /**
   * The options for configuring an Amazon ECS service to use service discovery.
   *
   * @default - AWS Cloud Map service discovery is not enabled.
   */
  readonly cloudMapOptions?: CloudMapOptions;
}

export interface NetworkLoadBalancedTaskImageOptions {
  /**
   * The image used to start a container. Image or taskDefinition must be specified, but not both.
   *
   * @default - none
   */
  readonly image: ContainerImage;

  /**
   * The environment variables to pass to the container.
   *
   * @default - No environment variables.
   */
  readonly environment?: { [key: string]: string };

  /**
   * The secret to expose to the container as an environment variable.
   *
   * @default - No secret environment variables.
   */
  readonly secrets?: { [key: string]: Secret };

  /**
   * Flag to indicate whether to enable logging.
   *
   * @default true
   */
  readonly enableLogging?: boolean;

  /**
   * The log driver to use.
   *
   * @default - AwsLogDriver if enableLogging is true
   */
  readonly logDriver?: LogDriver;

  /**
   * The name of the task execution IAM role that grants the Amazon ECS container agent permission to call AWS APIs on your behalf.
   *
   * @default - No value
   */
  readonly executionRole?: IRole;

  /**
   * The name of the task IAM role that grants containers in the task permission to call AWS APIs on your behalf.
   *
   * @default - A task role is automatically created for you.
   */
  readonly taskRole?: IRole;

  /**
   * The container name value to be specified in the task definition.
   *
   * @default - none
   */
  readonly containerName?: string;

  /**
   * The port number on the container that is bound to the user-specified or automatically assigned host port.
   *
   * If you are using containers in a task with the awsvpc or host network mode, exposed ports should be specified using containerPort.
   * If you are using containers in a task with the bridge network mode and you specify a container port and not a host port,
   * your container automatically receives a host port in the ephemeral port range.
   *
   * Port mappings that are automatically assigned in this way do not count toward the 100 reserved ports limit of a container instance.
   *
   * For more information, see
   * [hostPort](https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_PortMapping.html#ECS-Type-PortMapping-hostPort).
   *
   * @default 80
   */
  readonly containerPort?: number;
}

/**
 * The base class for NetworkLoadBalancedEc2Service and NetworkLoadBalancedFargateService services.
 */
export abstract class NetworkLoadBalancedServiceBase extends cdk.Construct {
  /**
   * The desired number of instantiations of the task definition to keep running on the service.
   */
  public readonly desiredCount: number;

  /**
   * The Network Load Balancer for the service.
   */
  public readonly loadBalancer: NetworkLoadBalancer;

  /**
   * The listener for the service.
   */
  public readonly listener: NetworkListener;

  /**
   * The target group for the service.
   */
  public readonly targetGroup: NetworkTargetGroup;

  /**
   * The cluster that hosts the service.
   */
  public readonly cluster: ICluster;

  /**
   * Constructs a new instance of the NetworkLoadBalancedServiceBase class.
   */
  constructor(scope: cdk.Construct, id: string, props: NetworkLoadBalancedServiceBaseProps = {}) {
    super(scope, id);

    if (props.cluster && props.vpc) {
      throw new Error('You can only specify either vpc or cluster. Alternatively, you can leave both blank');
    }
    this.cluster = props.cluster || this.getDefaultCluster(this, props.vpc);

    this.desiredCount = props.desiredCount || 1;

    const internetFacing = props.publicLoadBalancer !== undefined ? props.publicLoadBalancer : true;

    const lbProps = {
      vpc: this.cluster.vpc,
      internetFacing
    };

    this.loadBalancer = props.loadBalancer !== undefined ? props.loadBalancer : new NetworkLoadBalancer(this, 'LB', lbProps);

    const targetProps = {
      port: 80
    };

    this.listener = this.loadBalancer.addListener('PublicListener', { port: 80 });
    this.targetGroup = this.listener.addTargets('ECS', targetProps);

    if (typeof props.domainName !== 'undefined') {
      if (typeof props.domainZone === 'undefined') {
        throw new Error('A Route53 hosted domain zone name is required to configure the specified domain name');
      }

      new ARecord(this, "DNS", {
        zone: props.domainZone,
        recordName: props.domainName,
        target: AddressRecordTarget.fromAlias(new LoadBalancerTarget(this.loadBalancer)),
      });
    }

    new cdk.CfnOutput(this, 'LoadBalancerDNS', { value: this.loadBalancer.loadBalancerDnsName });
  }

  /**
   * Returns the default cluster.
   */
  protected getDefaultCluster(scope: cdk.Construct, vpc?: IVpc): Cluster {
    // magic string to avoid collision with user-defined constructs
    const DEFAULT_CLUSTER_ID = `EcsDefaultClusterMnL3mNNYN${vpc ? vpc.node.id : ''}`;
    const stack = cdk.Stack.of(scope);
    return stack.node.tryFindChild(DEFAULT_CLUSTER_ID) as Cluster || new Cluster(stack, DEFAULT_CLUSTER_ID, { vpc });
  }

  /**
   * Adds service as a target of the target group.
   */
  protected addServiceAsTarget(service: BaseService) {
    this.targetGroup.addTarget(service);
  }

  protected createAWSLogDriver(prefix: string): AwsLogDriver {
    return new AwsLogDriver({ streamPrefix: prefix });
  }
}
