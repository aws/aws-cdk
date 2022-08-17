#!/usr/bin/env node
import * as apig from '@aws-cdk/aws-apigateway';
import * as acm from '@aws-cdk/aws-certificatemanager';
import * as lambda from '@aws-cdk/aws-lambda';
import * as route53 from '@aws-cdk/aws-route53';
import { App, Stack } from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import { Construct } from 'constructs';
import * as targets from '../lib';

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
      runtime: lambda.Runtime.NODEJS_14_X,
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

const app = new App();
const testCase = new TestStack(app, 'aws-cdk-apigw-alias-integ');
new IntegTest(app, 'apigateway-domain-name', {
  testCases: [testCase],
});
