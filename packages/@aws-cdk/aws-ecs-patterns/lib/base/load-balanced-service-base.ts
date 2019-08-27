import { ICertificate } from '@aws-cdk/aws-certificatemanager';
import { IVpc } from '@aws-cdk/aws-ec2';
import { AwsLogDriver, BaseService, Cluster, ContainerImage, ICluster, LogDriver, Secret } from '@aws-cdk/aws-ecs';
import { ApplicationListener, ApplicationLoadBalancer, ApplicationTargetGroup, BaseLoadBalancer, NetworkListener,
  NetworkLoadBalancer, NetworkTargetGroup } from '@aws-cdk/aws-elasticloadbalancingv2';
import { IRole } from '@aws-cdk/aws-iam';
import { AddressRecordTarget, ARecord, IHostedZone } from '@aws-cdk/aws-route53';
import { LoadBalancerTarget } from '@aws-cdk/aws-route53-targets';
import cdk = require('@aws-cdk/core');

export enum LoadBalancerType {
  APPLICATION,
  NETWORK
}

/**
 * The properties for the base LoadBalancedEc2Service or LoadBalancedFargateService service.
 */
export interface LoadBalancedServiceBaseProps {
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
   * The image used to start a container.
   */
  readonly image: ContainerImage;

  /**
   * The port number on the container that is bound to the user-specified or automatically assigned host port.
   *
   * If you are using containers in a task with the awsvpc or host network mode, exposed ports should be specified using containerPort.
   * If you are using containers in a task with the bridge network mode and you specify a container port and not a host port,
   * your container automatically receives a host port in the ephemeral port range.
   *
   * For more information, see hostPort.
   * Port mappings that are automatically assigned in this way do not count toward the 100 reserved ports limit of a container instance.
   *
   * @default 80
   */
  readonly containerPort?: number;

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
   * The type of the load balancer to be used.
   *
   * @default application
   */
  readonly loadBalancerType?: LoadBalancerType

  /**
   * Certificate Manager certificate to associate with the load balancer.
   * Setting this option will set the load balancer port to 443.
   *
   * @default - No certificate associated with the load balancer.
   */
  readonly certificate?: ICertificate;

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
   * Determines whether the service will be assigned a public IP address.
   *
   * @default false
   */
  readonly publicTasks?: boolean;

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
   * The name of the service.
   *
   * @default - CloudFormation-generated name.
   */
  readonly serviceName?: string;

  /**
   * The log driver to use.
   *
   * @default - AwsLogDriver if enableLogging is true
   */
  readonly logDriver?: LogDriver;

  /**
   * The period of time, in seconds, that the Amazon ECS service scheduler ignores unhealthy
   * Elastic Load Balancing target health checks after a task has first started.
   *
   * @default - defaults to 60 seconds if at least one load balancer is in-use and it is not already set
   */
  readonly healthCheckGracePeriod?: cdk.Duration;

}

/**
 * The base class for LoadBalancedEc2Service and LoadBalancedFargateService services.
 */
export abstract class LoadBalancedServiceBase extends cdk.Construct {
  public readonly assignPublicIp: boolean;
  /**
   * The desired number of instantiations of the task definition to keep running on the service.
   */
  public readonly desiredCount: number;

  public readonly loadBalancerType: LoadBalancerType;

  public readonly loadBalancer: BaseLoadBalancer;

  public readonly listener: ApplicationListener | NetworkListener;

  public readonly targetGroup: ApplicationTargetGroup | NetworkTargetGroup;
  /**
   * The cluster that hosts the service.
   */
  public readonly cluster: ICluster;

  public readonly logDriver?: LogDriver;

  /**
   * Constructs a new instance of the LoadBalancedServiceBase class.
   */
  constructor(scope: cdk.Construct, id: string, props: LoadBalancedServiceBaseProps) {
    super(scope, id);

    if (props.cluster && props.vpc) {
      throw new Error(`You can only specify either vpc or cluster. Alternatively, you can leave both blank`);
    }
    this.cluster = props.cluster || this.getDefaultCluster(this, props.vpc);

    // Create log driver if logging is enabled
    const enableLogging = props.enableLogging !== undefined ? props.enableLogging : true;
    this.logDriver = props.logDriver !== undefined ? props.logDriver : enableLogging ? this.createAWSLogDriver(this.node.id) : undefined;

    this.assignPublicIp = props.publicTasks !== undefined ? props.publicTasks : false;
    this.desiredCount = props.desiredCount || 1;

    // Load balancer
    this.loadBalancerType = props.loadBalancerType !== undefined ? props.loadBalancerType : LoadBalancerType.APPLICATION;

    if (this.loadBalancerType !== LoadBalancerType.APPLICATION && this.loadBalancerType !== LoadBalancerType.NETWORK) {
       throw new Error(`invalid loadBalancerType`);
    }

    const internetFacing = props.publicLoadBalancer !== undefined ? props.publicLoadBalancer : true;

    const lbProps = {
      vpc: this.cluster.vpc,
      internetFacing
    };

    if (this.loadBalancerType === LoadBalancerType.APPLICATION) {
      this.loadBalancer = new ApplicationLoadBalancer(this, 'LB', lbProps);
    } else {
      this.loadBalancer = new NetworkLoadBalancer(this, 'LB', lbProps);
    }

    const targetProps = {
      port: 80
    };

    const hasCertificate = props.certificate !== undefined;
    if (hasCertificate && this.loadBalancerType !== LoadBalancerType.APPLICATION) {
      throw new Error("Cannot add certificate to an NLB");
    }

    if (this.loadBalancerType === LoadBalancerType.APPLICATION) {
      this.listener = (this.loadBalancer as ApplicationLoadBalancer).addListener('PublicListener', {
        port: hasCertificate ? 443 : 80,
        open: true
      });
      this.targetGroup = this.listener.addTargets('ECS', targetProps);

      if (props.certificate !== undefined) {
        this.listener.addCertificateArns('Arns', [props.certificate.certificateArn]);
      }
    } else {
      this.listener = (this.loadBalancer as NetworkLoadBalancer).addListener('PublicListener', { port: 80 });
      this.targetGroup = this.listener.addTargets('ECS', targetProps);
    }

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

  protected getDefaultCluster(scope: cdk.Construct, vpc?: IVpc): Cluster {
    // magic string to avoid collision with user-defined constructs
    const DEFAULT_CLUSTER_ID = `EcsDefaultClusterMnL3mNNYN${vpc ? vpc.node.id : ''}`;
    const stack = cdk.Stack.of(scope);
    return stack.node.tryFindChild(DEFAULT_CLUSTER_ID) as Cluster || new Cluster(stack, DEFAULT_CLUSTER_ID, { vpc });
  }

  protected addServiceAsTarget(service: BaseService) {
    if (this.loadBalancerType === LoadBalancerType.APPLICATION) {
      (this.targetGroup as ApplicationTargetGroup).addTarget(service);
    } else {
      (this.targetGroup as NetworkTargetGroup).addTarget(service);
    }
  }

  private createAWSLogDriver(prefix: string): AwsLogDriver {
    return new AwsLogDriver({ streamPrefix: prefix });
  }
}
