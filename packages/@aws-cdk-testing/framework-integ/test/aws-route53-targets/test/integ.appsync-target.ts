#!/usr/bin/env node
import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import { App, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import { join } from 'path';

/**********************************************************************************************************************
 *
 *    Warning! As with integ.api-gateway-domain-name.ts, this test case can not be deployed!
 *
 *    Save yourself some time and move on.
 *    The latest given reason is:
 *    - 2023-08-30: With hardcoded domain name and ARNs this will never work, @mrgrain
 *
 *********************************************************************************************************************/

class TestStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const domainName = 'example.com';
    const certArn = 'arn:aws:acm:us-east-1:111111111111:certificate';
    const hostedZoneId = 'AAAAAAAAAAAAA';

    const certificate = acm.Certificate.fromCertificateArn(this, 'cert', certArn);

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
      target: route53.RecordTarget.fromAlias(new targets.AppSync(api)),
    });
  }
}

const app = new App();
const testCase = new TestStack(app, 'aws-cdk-appsync-alias-integ');
new IntegTest(app, 'appsync-domain-name', {
  testCases: [testCase],
});
