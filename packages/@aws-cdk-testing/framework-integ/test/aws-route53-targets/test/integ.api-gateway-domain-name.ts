#!/usr/bin/env node
import * as apig from 'aws-cdk-lib/aws-apigateway';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as route53 from 'aws-cdk-lib/aws-route53';
import { App, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

/**********************************************************************************************************************
 *
 *    Warning! This test case can not be deployed!
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

    const handler = new lambda.Function(this, 'Handler', {
      code: lambda.Code.fromInline(`exports.handler = async () => {
        return {
          statusCode: '200',
          body: 'hello, world!'
        };
      };`),
      runtime: STANDARD_NODEJS_RUNTIME,
      handler: 'index.handler',
    });

    const certificate = acm.Certificate.fromCertificateArn(this, 'cert', certArn);

    const api = new apig.LambdaRestApi(this, 'api', {
      cloudWatchRole: true,
      handler,
      domainName: {
        certificate,
        domainName,
        endpointType: apig.EndpointType.REGIONAL,
      },
    });

    const zone = route53.HostedZone.fromHostedZoneAttributes(this, 'hosted-zone', {
      zoneName: domainName,
      hostedZoneId,
    });

    new route53.ARecord(this, 'Alias', {
      zone,
      target: route53.RecordTarget.fromAlias(new targets.ApiGateway(api)),
    });
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const testCase = new TestStack(app, 'aws-cdk-apigw-alias-integ');
new IntegTest(app, 'apigateway-domain-name', {
  testCases: [testCase],
});
