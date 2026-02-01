import { Stack, App } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { Construct } from 'constructs';

class TestStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const vpc = new ec2.Vpc(this, 'Vpc', {
      natGateways: 0,
    });

    const alb = new elbv2.ApplicationLoadBalancer(this, 'Alb', {
      vpc,
    });

    const listener = alb.addListener('Listener', {
      port: 80,
    });

    listener.addAction('TransformsAction', {
      action: elbv2.ListenerAction.fixedResponse(200, {
        contentType: 'text/plain',
        messageBody: 'Hello, world!',
      }),
      priority: 1,
      conditions: [
        elbv2.ListenerCondition.pathPatterns(['/api/*']),
      ],
      transforms: [
        elbv2.ListenerTransform.hostHeaderRewrite([
          {
            regex: '^(.*)\\.example\\.com$',
            replace: '$1.internal.example.com',
          },
        ]),
        elbv2.ListenerTransform.urlRewrite([
          {
            regex: '^/old-path/(.*)$',
            replace: '/new-path/$1',
          },
        ]),
      ],
    });
    listener.addAction('DefaultAction', {
      action: elbv2.ListenerAction.fixedResponse(404, {
        contentType: 'text/plain',
        messageBody: 'Not Found',
      }),
    });
  }
}

const app = new App();
const stack = new TestStack(app, 'AlbTransformsStack');

new IntegTest(app, 'AlbTransformsInteg', {
  testCases: [stack],
});
