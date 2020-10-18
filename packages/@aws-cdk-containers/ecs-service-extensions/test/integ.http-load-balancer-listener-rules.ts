import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as alb from '@aws-cdk/aws-elasticloadbalancingv2';
import { App, CfnOutput, Fn, Stack } from '@aws-cdk/core';

import { Container, Environment, Service, ServiceDescription } from '../lib';
import { HttpLoadBalancerListenerRules } from '../lib/extensions/http-load-balancer-listener-rules';

const app = new App();
const stack = new Stack(app, 'http-load-balancer-listener-rules-integ');

const environment = new Environment(stack, 'Environment');

const loadBalancer = new alb.ApplicationLoadBalancer(stack, 'Alb', {
  internetFacing: true,
  vpc: environment.vpc,
});

const listener = loadBalancer.addListener('http', {
  protocol: alb.ApplicationProtocol.HTTP,
  defaultAction: alb.ListenerAction.fixedResponse(404, {
    contentType: 'text/plain',
    messageBody: '404 Not Found',
  }),
});

const serviceDescription = new ServiceDescription();
serviceDescription.add(new Container({
  cpu: 256,
  memoryMiB: 512,
  trafficPort: 80,
  image: ecs.ContainerImage.fromRegistry('nathanpeck/name'),
  environment: {
    PORT: '80',
  },
}));

serviceDescription.add(new HttpLoadBalancerListenerRules({
  listener,
  rules: [
    HttpLoadBalancerListenerRules.pathPattern('/name1'),
    HttpLoadBalancerListenerRules.pathPattern('/name2'),
    HttpLoadBalancerListenerRules.pathPatternRedirect('/redirect', {
      protocol: 'HTTPS',
      host: 'aws.amazon.com',
      port: '443',
      path: '/',
    }),
  ],
}));

const service = new Service(stack, 'Service', {
  environment,
  serviceDescription,
});

service.ecsService.connections.allowFrom(loadBalancer, ec2.Port.allTcp());

new CfnOutput(stack, 'Error404Endpoint', {
  value: Fn.sub('http://${AlbDns}', {
    AlbDns: loadBalancer.loadBalancerDnsName,
  }),
});

new CfnOutput(stack, 'NameEndpoint1', {
  value: Fn.sub('http://${AlbDns}/name1', {
    AlbDns: loadBalancer.loadBalancerDnsName,
  }),
});

new CfnOutput(stack, 'NameEndpoint2', {
  value: Fn.sub('http://${AlbDns}/name2', {
    AlbDns: loadBalancer.loadBalancerDnsName,
  }),
});

new CfnOutput(stack, 'RedirectToAmazon', {
  value: Fn.sub('http://${AlbDns}/redirect', {
    AlbDns: loadBalancer.loadBalancerDnsName,
  }),
});

/**
 * Expect this stack to deploy. The stack outputs include several URLs to test
 * with a browser after the services have settled. Error404Endpoint should show
 * you an error 404. NameEndpoint1 and NameEndpoint2 should show the name
 * container's output. RedirectToAmazon should redirect you to the AWS website.
 *
 * Example:
 *
 * ```
 * $ cdk --app 'node ./integ.http-load-balancer-listener-rules.js' deploy
 * ...
 * Outputs:
 * http-load-balancer-listener-rules-integ.Error404Endpoint = http://someurl
 * http-load-balancer-listener-rules-integ.NameEndpoint1 = http://someurl/name1
 * http-load-balancer-listener-rules-integ.NameEndpoint2 = http://someurl/name2
 * http-load-balancer-listener-rules-integ.RedirectToAmazon = http://someurl/redirect
 * ...
 *
 * $ xdg-open http://someurl
 * $ xdg-open http://someurl/name1
 * $ xdg-open http://someurl/name2
 * $ xdg-open http://someurl/redirect
 * ```
 */
