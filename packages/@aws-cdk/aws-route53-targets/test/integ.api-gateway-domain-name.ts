#!/usr/bin/env node
import apig = require('@aws-cdk/aws-apigateway');
import acm = require('@aws-cdk/aws-certificatemanager');
import lambda = require('@aws-cdk/aws-lambda');
import route53 = require('@aws-cdk/aws-route53');
import { App, Construct, Stack } from '@aws-cdk/core';
import targets = require('../lib');

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
      runtime: lambda.Runtime.NODEJS_8_10,
      handler: 'index.handler'
    });

    const certificate = acm.Certificate.fromCertificateArn(this, 'cert', certArn);

    const api = new apig.LambdaRestApi(this, 'api', {
      handler,
      domainName: {
        certificate,
        domainName,
        endpointType: apig.EndpointType.REGIONAL,
      }
    });

    const zone = route53.HostedZone.fromHostedZoneAttributes(this, 'hosted-zone', {
      zoneName: domainName,
      hostedZoneId
    });

    new route53.ARecord(this, 'Alias', {
      zone,
      target: route53.AddressRecordTarget.fromAlias(new targets.ApiGateway(api))
    });
  }
}

const app = new App();
new TestStack(app, 'aws-cdk-apigw-alias-integ');
app.synth();
