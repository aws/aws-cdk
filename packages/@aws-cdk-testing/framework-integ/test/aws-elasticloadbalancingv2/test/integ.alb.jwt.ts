import * as integ from '@aws-cdk/integ-tests-alpha';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as route53 from 'aws-cdk-lib/aws-route53';
import { App, Stack, RemovalPolicy, UnscopedValidationError } from 'aws-cdk-lib/core';
import type { StackProps } from 'aws-cdk-lib/core';
import type { Construct } from 'constructs';

interface AlbJwtStackProps extends StackProps {
  hostedZoneId: string;
  hostedZoneName: string;
  domainName: string;
}

class AlbJwtStack extends Stack {
  constructor(scope: Construct, id: string, props: AlbJwtStackProps) {
    super(scope, id);
    const domainName = `jwt.${props.domainName}`;

    const hostedZone = route53.PublicHostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
      hostedZoneId: props.hostedZoneId,
      zoneName: props.hostedZoneName,
    });
    const certificate = new acm.Certificate(this, 'Certificate', {
      domainName: `*.${props.domainName}`,
      validation: acm.CertificateValidation.fromDns(hostedZone),
      subjectAlternativeNames: [hostedZone.zoneName],
    });

    // Create Cognito UserPool as IdP
    const userPool = new cognito.UserPool(this, 'UserPool', {
      signInAliases: {
        email: true,
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });
    const userPoolDomain = userPool.addDomain('Domain', {
      customDomain: {
        domainName,
        certificate,
      },
    });

    const vpc = new ec2.Vpc(this, 'Vpc', {
      maxAzs: 2,
    });

    const lb = new elbv2.ApplicationLoadBalancer(this, 'LoadBalancer', {
      vpc,
      internetFacing: true,
    });
    const listener = lb.addListener('Listener', {
      protocol: elbv2.ApplicationProtocol.HTTPS,
      certificates: [certificate],
      defaultAction: elbv2.ListenerAction.authenticateJwt({
        jwksEndpoint: `https://${userPoolDomain.domainName}.auth.${this.region}.amazoncognito.com/.well-known/jwks.json`,
        issuer: `https://${userPoolDomain.domainName}.auth.${this.region}.amazoncognito.com`,
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
        jwksEndpoint: `https://${userPoolDomain.domainName}.auth.${this.region}.amazoncognito.com/.well-known/jwks.json`,
        issuer: `https://${userPoolDomain.domainName}.auth.${this.region}.amazoncognito.com`,
        next: elbv2.ListenerAction.fixedResponse(200, {
          contentType: 'text/plain',
          messageBody: 'Authenticated Additional Action',
        }),
      }),
    });
  }
}

/**
 * In order to test this you need to have a valid public hosted zone that you can use
 * to request certificates for.
 */
const hostedZoneId = process.env.CDK_INTEG_HOSTED_ZONE_ID ?? process.env.HOSTED_ZONE_ID;
if (!hostedZoneId) throw new UnscopedValidationError('For this test you must provide your own HostedZoneId as an env var "HOSTED_ZONE_ID". See framework-integ/README.md for details.');
const hostedZoneName = process.env.CDK_INTEG_HOSTED_ZONE_NAME ?? process.env.HOSTED_ZONE_NAME;
if (!hostedZoneName) throw new UnscopedValidationError('For this test you must provide your own HostedZoneName as an env var "HOSTED_ZONE_NAME". See framework-integ/README.md for details.');
const domainName = process.env.CDK_INTEG_DOMAIN_NAME ?? process.env.DOMAIN_NAME;
if (!domainName) throw new UnscopedValidationError('For this test you must provide your own DomainName as an env var "DOMAIN_NAME". See framework-integ/README.md for details.');

const app = new App();
const testCase = new AlbJwtStack(app, 'AlbJwtStack', {
  hostedZoneId,
  hostedZoneName,
  domainName,
});
new integ.IntegTest(app, 'IntegTestAlbJwt', {
  testCases: [testCase],
});

