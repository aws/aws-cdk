/**
 * Integration test for `AlbIntegration` covering both HTTP and HTTPS listeners
 * on the same internal Application Load Balancer.
 *
 * Required env vars (the test owner must own the hosted zone):
 *   HOSTED_ZONE_ID    e.g. Z01234567890ABCDEFGHI
 *   HOSTED_ZONE_NAME  e.g. example.com
 *
 * The ALB is exposed under `alb-integ.<HOSTED_ZONE_NAME>` via a Route53 alias,
 * so the HTTPS listener's certificate matches the URI hostname seen by API
 * Gateway when calling the backend through VPC Link V2.
 */
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as elbv2_targets from 'aws-cdk-lib/aws-elasticloadbalancingv2-targets';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as route53_targets from 'aws-cdk-lib/aws-route53-targets';
import * as cdk from 'aws-cdk-lib';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests-alpha';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

interface AlbIntegrationStackProps extends cdk.StackProps {
  readonly hostedZoneId: string;
  readonly hostedZoneName: string;
  readonly domainName: string;
}

class AlbIntegrationStack extends cdk.Stack {
  public readonly api: apigateway.RestApi;

  constructor(scope: cdk.App, id: string, props: AlbIntegrationStackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'Vpc', { natGateways: 1 });

    const backendFunction = new lambda.Function(this, 'BackendFunction', {
      runtime: lambda.Runtime.NODEJS_24_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
        exports.handler = async function(event) {
          return {
            statusCode: 200,
            statusDescription: '200 OK',
            isBase64Encoded: false,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: 'Hello from ALB Integration!',
              path: event.path,
              method: event.httpMethod,
            }),
          };
        };
      `),
      vpc,
    });

    const alb = new elbv2.ApplicationLoadBalancer(this, 'Alb', {
      vpc,
      internetFacing: false,
    });

    const hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
      hostedZoneId: props.hostedZoneId,
      zoneName: props.hostedZoneName,
    });

    const certificate = new acm.Certificate(this, 'Certificate', {
      domainName: props.domainName,
      validation: acm.CertificateValidation.fromDns(hostedZone),
    });

    new route53.ARecord(this, 'AliasRecord', {
      zone: hostedZone,
      recordName: props.domainName,
      target: route53.RecordTarget.fromAlias(new route53_targets.LoadBalancerTarget(alb)),
    });

    const httpListener = alb.addListener('HttpListener', {
      port: 80,
      protocol: elbv2.ApplicationProtocol.HTTP,
      open: false,
    });
    httpListener.addTargets('HttpTarget', {
      targets: [new elbv2_targets.LambdaTarget(backendFunction)],
      healthCheck: { enabled: true, healthyHttpCodes: '200' },
    });

    const httpsListener = alb.addListener('HttpsListener', {
      port: 443,
      protocol: elbv2.ApplicationProtocol.HTTPS,
      certificates: [certificate],
      open: false,
    });
    httpsListener.addTargets('HttpsTarget', {
      targets: [new elbv2_targets.LambdaTarget(backendFunction)],
      healthCheck: { enabled: true, healthyHttpCodes: '200' },
    });

    this.api = new apigateway.RestApi(this, 'RestApi', {
      cloudWatchRole: true,
      deployOptions: { stageName: 'prod' },
    });

    // HTTP listener — URI hostname does not need to match any cert; use the
    // load balancer's default DNS name (derived from the listener).
    this.api.root.addResource('http').addMethod('GET', new apigateway.AlbIntegration(httpListener));

    // HTTPS listener — URI hostname MUST match the cert, so use the alias.
    this.api.root.addResource('https').addMethod('GET', new apigateway.AlbIntegration(httpsListener, {
      loadBalancerDnsName: props.domainName,
    }));
  }
}

const hostedZoneId = process.env.CDK_INTEG_HOSTED_ZONE_ID ?? process.env.HOSTED_ZONE_ID;
if (!hostedZoneId) throw new Error('Set HOSTED_ZONE_ID env var to a hosted zone you own.');
const hostedZoneName = process.env.CDK_INTEG_HOSTED_ZONE_NAME ?? process.env.HOSTED_ZONE_NAME;
if (!hostedZoneName) throw new Error('Set HOSTED_ZONE_NAME env var (e.g. pricoach.com).');
const domainName = process.env.CDK_INTEG_DOMAIN_NAME ?? process.env.DOMAIN_NAME ?? `alb-integ.${hostedZoneName}`;

const app = new cdk.App();
const stack = new AlbIntegrationStack(app, 'AlbIntegrationTestStack', {
  hostedZoneId,
  hostedZoneName,
  domainName,
});
cdk.RemovalPolicies.of(stack).apply(cdk.RemovalPolicy.DESTROY);

const integ = new IntegTest(app, 'AlbIntegrationInteg', {
  testCases: [stack],
});

// API Gateway forwards to the ALB without a path, so Lambda sees `/` for both
// routes. We only assert the message + method, which proves both listeners are
// reachable through their respective `AlbIntegration`s.
const expectedBody = {
  message: 'Hello from ALB Integration!',
  method: 'GET',
};

integ.assertions.httpApiCall(stack.api.urlForPath('/http')).expect(
  ExpectedResult.objectLike({ body: expectedBody }),
);
integ.assertions.httpApiCall(stack.api.urlForPath('/https')).expect(
  ExpectedResult.objectLike({ body: expectedBody }),
);
