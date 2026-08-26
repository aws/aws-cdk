#!/usr/bin/env node
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as apigw from 'aws-cdk-lib/aws-apigatewayv2';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';

/**
 * In order to test this you need to have a valid public hosted zone that you can use
 * to request certificates for.
 *
 */
const hostedZoneId = process.env.CDK_INTEG_HOSTED_ZONE_ID ?? process.env.HOSTED_ZONE_ID;
if (!hostedZoneId) throw new Error('For this test you must provide your own HostedZoneId as an env var "HOSTED_ZONE_ID". See framework-integ/README.md for details.');
const hostedZoneName = process.env.CDK_INTEG_HOSTED_ZONE_NAME ?? process.env.HOSTED_ZONE_NAME;
if (!hostedZoneName) throw new Error('For this test you must provide your own HostedZoneName as an env var "HOSTED_ZONE_NAME". See framework-integ/README.md for details.');
const domainName = process.env.CDK_INTEG_DOMAIN_NAME ?? process.env.DOMAIN_NAME;
if (!domainName) throw new Error('For this test you must provide your own DomainName as an env var "DOMAIN_NAME". See framework-integ/README.md for details.');

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-aws-apigatewayv2-domain-name');

const hostedZone = route53.PublicHostedZone.fromHostedZoneAttributes(stack, 'HostedZone', {
  hostedZoneId,
  zoneName: hostedZoneName,
});

const certificate = new acm.Certificate(stack, 'Certificate', {
  domainName,
  certificateName: 'This is a test name',
  validation: acm.CertificateValidation.fromDns(hostedZone),
});

const domain = new apigw.DomainName(stack, 'DomainName', {
  domainName,
  certificate,
  ipAddressType: apigw.IpAddressType.DUAL_STACK,
});

new apigw.HttpApi(stack, 'HttpApi', {
  routeSelectionExpression: true,
  defaultDomainMapping: {
    domainName: domain,
  },
});

new IntegTest(app, 'http-api', {
  testCases: [stack],
  enableLookups: true,
});

