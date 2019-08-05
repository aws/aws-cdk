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
   * The cluster where your service will be deployed
   * You can only specify either vpc or cluster. Alternatively, you can leave both blank
   *
   * @default - create a new cluster; if you do not specify a cluster nor a vpc, a new VPC will be created for you as well
   */
  readonly cluster?: ICluster;

  /**
   * VPC that the cluster instances or tasks are running in
   * You can only specify either vpc or cluster. Alternatively, you can leave both blank
   *
   * @default - use vpc of cluster or create a new one
   */
  readonly vpc?: IVpc;

  /**
   * The image to start.
   */
  readonly image: ContainerImage;

  /**
   * The container port of the application load balancer attached to your Fargate service. Corresponds to container port mapping.
   *
   * @default 80
   */
  readonly containerPort?: number;

  /**
   * Determines whether the Application Load Balancer will be internet-facing
   *
   * @default true
   */
  readonly publicLoadBalancer?: boolean;

  /**
   * Number of desired copies of running tasks
   *
   * @default 1
   */
  readonly desiredCount?: number;

  /**
   * Whether to create an application load balancer or a network load balancer
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
   * Environment variables to pass to the container
   *
   * @default - No environment variables.
   */
  readonly environment?: { [key: string]: string };

  /**
   * Secret environment variables to pass to the container
   *
   * @default - No secret environment variables.
   */
  readonly secrets?: { [key: string]: Secret };

  /**
   * Whether to create an AWS log driver
   *
   * @default true
   */
  readonly enableLogging?: boolean;

  /**
   * Determines whether your Fargate Service will be assigned a public IP address.
   *
   * @default false
   */
  readonly publicTasks?: boolean;

  /**
   * Domain name for the service, e.g. api.example.com
   *
   * @default - No domain name.
   */
  readonly domainName?: string;

  /**
   * Route53 hosted zone for the domain, e.g. "example.com."
   *
   * @default - No Route53 hosted domain zone.
   */
  readonly domainZone?: IHostedZone;

  /**
   * Override for the Fargate Task Definition execution role
   *
   * @default - No value
   */
  readonly executionRole?: IRole;

  /**
   * Override for the Fargate Task Definition task role
   *
   * @default - No value
   */
  readonly taskRole?: IRole;

  /**
   * Override value for the container name
   *
   * @default - No value
   */
  readonly containerName?: string;

  /**
   * Override value for the service name
   *
   * @default CloudFormation-generated name
   */
  readonly serviceName?: string;

  /**
   * The LogDriver to use for logging.
   *
   * @default AwsLogDriver if enableLogging is true
   */
  readonly logDriver?: LogDriver;
}

/**
 * The base class for LoadBalancedEc2Service and LoadBalancedFargateService services.
 */
export abstract class LoadBalancedServiceBase extends cdk.Construct {
  public readonly assignPublicIp: boolean;

  public readonly desiredCount: number;

  public readonly loadBalancerType: LoadBalancerType;

  public readonly loadBalancer: BaseLoadBalancer;

  public readonly listener: ApplicationListener | NetworkListener;

  public readonly targetGroup: ApplicationTargetGroup | NetworkTargetGroup;

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
