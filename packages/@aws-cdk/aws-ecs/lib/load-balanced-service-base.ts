import { ICertificate } from '@aws-cdk/aws-certificatemanager';
import elbv2 = require('@aws-cdk/aws-elasticloadbalancingv2');
import cdk = require('@aws-cdk/cdk');
import { BaseService } from './base/base-service';
import { ICluster } from './cluster';
import { ContainerImage } from './container-image';

export enum LoadBalancerType {
  Application,
  Network
}

export interface LoadBalancedServiceBaseProps {
  /**
   * The cluster where your service will be deployed
   */
  cluster: ICluster;

  /**
   * The image to start.
   */
  image: ContainerImage;

  /**
   * The container port of the application load balancer attached to your Fargate service. Corresponds to container port mapping.
   *
   * @default 80
   */
  containerPort?: number;

  /**
   * Determines whether the Application Load Balancer will be internet-facing
   *
   * @default true
   */
  publicLoadBalancer?: boolean;

  /**
   * Number of desired copies of running tasks
   *
   * @default 1
   */
  desiredCount?: number;

  /**
   * Whether to create an application load balancer or a network load balancer
   * @default application
   */
  loadBalancerType?: LoadBalancerType

  /**
   * Certificate Manager certificate to associate with the load balancer.
   * Setting this option will set the load balancer port to 443.
   */
  certificate?: ICertificate;

  /**
   * Environment variables to pass to the container
   *
   * @default No environment variables
   */
  environment?: { [key: string]: string };
}

/**
 * Base class for load-balanced Fargate and ECS service
 */
export abstract class LoadBalancedServiceBase extends cdk.Construct {
  public readonly loadBalancerType: LoadBalancerType;

  public readonly loadBalancer: elbv2.BaseLoadBalancer;

  public readonly listener: elbv2.ApplicationListener | elbv2.NetworkListener;

  public readonly targetGroup: elbv2.ApplicationTargetGroup | elbv2.NetworkTargetGroup;

  constructor(scope: cdk.Construct, id: string, props: LoadBalancedServiceBaseProps) {
    super(scope, id);

    // Load balancer
    this.loadBalancerType = props.loadBalancerType !== undefined ? props.loadBalancerType : LoadBalancerType.Application;

    if (this.loadBalancerType !== LoadBalancerType.Application && this.loadBalancerType !== LoadBalancerType.Network) {
       throw new Error(`invalid loadBalancerType`);
    }

    const internetFacing = props.publicLoadBalancer !== undefined ? props.publicLoadBalancer : true;

    const lbProps = {
      vpc: props.cluster.vpc,
      internetFacing
    };

    if (this.loadBalancerType === LoadBalancerType.Application) {
      this.loadBalancer = new elbv2.ApplicationLoadBalancer(this, 'LB', lbProps);
    } else {
      this.loadBalancer = new elbv2.NetworkLoadBalancer(this, 'LB', lbProps);
    }

    const targetProps = {
      port: 80
    };

    const hasCertificate = props.certificate !== undefined;
    if (hasCertificate && this.loadBalancerType !== LoadBalancerType.Application) {
      throw new Error("Cannot add certificate to an NLB");
    }

    if (this.loadBalancerType === LoadBalancerType.Application) {
      this.listener = (this.loadBalancer as elbv2.ApplicationLoadBalancer).addListener('PublicListener', {
        port: hasCertificate ? 443 : 80,
        open: true
      });
      this.targetGroup = this.listener.addTargets('ECS', targetProps);

      if (props.certificate !== undefined) {
        this.listener.addCertificateArns('Arns', [props.certificate.certificateArn]);
      }
    } else {
      this.listener = (this.loadBalancer as elbv2.NetworkLoadBalancer).addListener('PublicListener', { port: 80 });
      this.targetGroup = this.listener.addTargets('ECS', targetProps);
    }

    new cdk.CfnOutput(this, 'LoadBalancerDNS', { value: this.loadBalancer.dnsName });
  }

  protected addServiceAsTarget(service: BaseService) {
    if (this.loadBalancerType === LoadBalancerType.Application) {
      (this.targetGroup as elbv2.ApplicationTargetGroup).addTarget(service);
    } else {
      (this.targetGroup as elbv2.NetworkTargetGroup).addTarget(service);
    }
  }
}
