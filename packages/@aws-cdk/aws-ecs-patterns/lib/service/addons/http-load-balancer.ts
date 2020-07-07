import { ServiceAddon } from './addon-interfaces';
import { Service } from '../service';
import cdk = require('@aws-cdk/core');
import alb = require('@aws-cdk/aws-elasticloadbalancingv2');
import { Ec2Service } from '@aws-cdk/aws-ecs';

export class HttpLoadBalancerAddon extends ServiceAddon {
  private loadBalancer!: alb.IApplicationLoadBalancer;
  private listener!: alb.IApplicationListener;

  constructor() {
    super('load-balancer');
  }

  // Before the service is created go ahead and create the load balancer itself.
  prehook(service: Service, scope: cdk.Stack) {
    this.parentService = service;

    this.loadBalancer = new alb.ApplicationLoadBalancer(scope, `${this.parentService.id}-load-balancer`, {
      vpc: this.parentService.vpc,
      internetFacing: true,
    });

    this.listener = this.loadBalancer.addListener(`${this.parentService.id}-listener`, {
      port: 80,
      open: true,
    });
  }

  // After the service is created add the service to the load balancer's listener
  useService(service: Ec2Service) {
    this.listener.addTargets(this.parentService.id, {
      deregistrationDelay: cdk.Duration.seconds(10),
      port: 80,
      targets: [service],
    });
  }
}
