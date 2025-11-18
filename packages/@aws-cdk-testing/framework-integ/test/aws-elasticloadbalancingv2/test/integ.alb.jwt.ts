import * as integ from '@aws-cdk/integ-tests-alpha';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { App, Stack } from 'aws-cdk-lib/core';
import { Construct } from 'constructs';

class AlbJwtStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const vpc = new ec2.Vpc(this, 'Vpc', {
      maxAzs: 2,
    });

    const lb = new elbv2.ApplicationLoadBalancer(this, 'LoadBalancer', {
      vpc,
      internetFacing: true,
    });
    const listener = lb.addListener('Listener', {
      protocol: elbv2.ApplicationProtocol.HTTP,
      defaultAction: elbv2.ListenerAction.authenticateJwt({
        jwksEndpoint: 'https://test-userpool-id/.well-known/jwks.json',
        issuer: 'https://test-userpool-id',
        next: elbv2.ListenerAction.fixedResponse(200, {
          contentType: 'text/plain',
          messageBody: 'Authenticated',
        }),
      }),
    });
    listener.addAction('AdditionalAction', {
      priority: 10,
      conditions: [
        elbv2.ListenerCondition.pathPatterns(['/additional*']),
      ],
      action: elbv2.ListenerAction.authenticateJwt({
        jwksEndpoint: 'https://test-userpool-id/.well-known/jwks.json',
        issuer: 'https://test-userpool-id',
        next: elbv2.ListenerAction.fixedResponse(200, {
          contentType: 'text/plain',
          messageBody: 'Authenticated Additional Action',
        }),
      }),
    });
  }
}

const app = new App();
const testCase = new AlbJwtStack(app, 'AlbJwtStack');
new integ.IntegTest(app, 'IntegTestAlbJwt', {
  testCases: [testCase],
  diffAssets: true,
});
