import { expect as expectCDK, haveResourceLike } from '@aws-cdk/assert';
import * as ecs from '@aws-cdk/aws-ecs';
import * as alb from '@aws-cdk/aws-elasticloadbalancingv2';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import {
  Container,
  Environment,
  Service,
  ServiceDescription,
} from '../lib';
import { HttpLoadBalancerListenerRules } from '../lib/extensions/http-load-balancer-listener-rules';

export = {
  'it should produce listener rules'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const environment = new Environment(stack, 'production');
    const serviceDescription = new ServiceDescription();
    serviceDescription.add(new Container({
      cpu: 256,
      memoryMiB: 512,
      trafficPort: 80,
      image: ecs.ContainerImage.fromRegistry('nathanpeck/name'),
    }));

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

    // WHEN
    serviceDescription.add(new HttpLoadBalancerListenerRules({
      listener,
      rules: [
        HttpLoadBalancerListenerRules.hostHeader('www.example.com'),
        HttpLoadBalancerListenerRules.hostHeaderRedirect('*.example.com', {
          host: 'www.example.com',
        }),
        HttpLoadBalancerListenerRules.pathPattern('/somepath'),
        HttpLoadBalancerListenerRules.pathPatternRedirect('/redirect', {
          host: 'aws.amazon.com',
        }),
      ],
    }));

    new Service(stack, 'my-service', {
      environment,
      serviceDescription,
    });

    // THEN
    expectCDK(stack).to(haveResourceLike('AWS::ElasticLoadBalancingV2::TargetGroup'));

    // hostHeader()
    expectCDK(stack).to(haveResourceLike('AWS::ElasticLoadBalancingV2::ListenerRule', {
      Conditions: [
        {
          Field: 'host-header',
          HostHeaderConfig: {
            Values: ['www.example.com'],
          },
        },
      ],
      Actions: [{ Type: 'forward' }],
      Priority: 1,
    }));

    // hostHeaderRedirect()
    expectCDK(stack).to(haveResourceLike('AWS::ElasticLoadBalancingV2::ListenerRule', {
      Conditions: [
        {
          Field: 'host-header',
          HostHeaderConfig: {
            Values: ['*.example.com'],
          },
        },
      ],
      Actions: [{
        Type: 'redirect',
        RedirectConfig: {
          Host: 'www.example.com',
          StatusCode: 'HTTP_302',
        },
      }],
      Priority: 6,
    }));

    // pathPattern()
    expectCDK(stack).to(haveResourceLike('AWS::ElasticLoadBalancingV2::ListenerRule', {
      Conditions: [
        {
          Field: 'path-pattern',
          PathPatternConfig: {
            Values: ['/somepath'],
          },
        },
      ],
      Actions: [{ Type: 'forward' }],
      Priority: 11,
    }));

    // pathPatternRedirect()
    expectCDK(stack).to(haveResourceLike('AWS::ElasticLoadBalancingV2::ListenerRule', {
      Conditions: [
        {
          Field: 'path-pattern',
          PathPatternConfig: {
            Values: ['/redirect'],
          },
        },
      ],
      Actions: [{
        Type: 'redirect',
        RedirectConfig: {
          Host: 'aws.amazon.com',
          StatusCode: 'HTTP_302',
        },
      }],
      Priority: 16,
    }));

    test.done();
  },

  'it does not produce a target group without rules'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const environment = new Environment(stack, 'production');
    const serviceDescription = new ServiceDescription();
    serviceDescription.add(new Container({
      cpu: 256,
      memoryMiB: 512,
      trafficPort: 80,
      image: ecs.ContainerImage.fromRegistry('nathanpeck/name'),
    }));

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

    serviceDescription.add(new HttpLoadBalancerListenerRules({
      listener,
    }));

    new Service(stack, 'my-service', {
      environment,
      serviceDescription,
    });

    // THEN
    expectCDK(stack).notTo(haveResourceLike('AWS::ElasticLoadBalancingV2::TargetGroup'));

    test.done();
  },
}
