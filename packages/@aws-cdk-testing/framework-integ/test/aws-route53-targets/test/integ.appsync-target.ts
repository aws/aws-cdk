#!/usr/bin/env node
import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import { App, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import { join } from 'path';

type TestStackProps = {
  certificateArn: string;
  domainName: string;
  hostedZoneId: string;
}

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props: TestStackProps) {
    super(scope, id);

    const { domainName, certificateArn, hostedZoneId } = props;

    const certificate = acm.Certificate.fromCertificateArn(this, 'cert', certificateArn);

    const api = new appsync.GraphqlApi(this, 'api', {
      definition: appsync.Definition.fromFile(join(__dirname, '..', '..', 'aws-appsync', 'test', 'appsync.test.graphql')),
      domainName: {
        certificate,
        domainName,
      },
      name: 'api',
    });

    const zone = route53.HostedZone.fromHostedZoneAttributes(this, 'hosted-zone', {
      zoneName: domainName,
      hostedZoneId,
    });

    new route53.ARecord(this, 'Alias', {
      zone,
      target: route53.RecordTarget.fromAlias(new targets.AppSyncTarget(api)),
    });
  }
}

const certificateArn = process.env.CDK_INTEG_CERT_ARN ?? process.env.CERT_ARN;
if (!certificateArn) throw new Error('For this test you must provide your own CertificateArn as an env var "CERT_ARN". See framework-integ/README.md for details.');
const domainName = process.env.CDK_INTEG_DOMAIN_NAME ?? process.env.DOMAIN_NAME;
if (!domainName) throw new Error('For this test you must provide your own DomainName as an env var "DOMAIN_NAME". See framework-integ/README.md for details.');
const hostedZoneId = process.env.CDK_INTEG_HOSTED_ZONE_ID ?? process.env.HOSTED_ZONE_ID;
if (!hostedZoneId) throw new Error('For this test you must provide your own HostedZoneId as an env var "HOSTED_ZONE_ID". See framework-integ/README.md for details.');

const app = new App();
const testCase = new TestStack(app, 'aws-cdk-appsync-alias-integ', { certificateArn, domainName, hostedZoneId });
new IntegTest(app, 'appsync-domain-name', {
  enableLookups: true,
  regions: ['us-east-1'],
  stackUpdateWorkflow: false,
  testCases: [testCase],
});
