import * as acm from '@aws-cdk/aws-certificatemanager';
import * as lambda from '@aws-cdk/aws-lambda';
import { App, CfnOutput, Stack } from '@aws-cdk/core';
import { DomainName, HttpApi, LambdaProxyIntegration } from '../../lib';

const app = new App();

const stack = new Stack(app, 'integ-http-proxy');

const handler = new lambda.Function(stack, 'echohandler', {
  runtime: lambda.Runtime.NODEJS_12_X,
  handler: 'index.handler',
  code: new lambda.InlineCode('exports.handler = async function(event, context) { return { statusCode: 200, headers: { "content-type": "application/json"  }, body: JSON.stringify(event) }; };'),
});

const certArn = 'arn:aws:acm:us-east-1:111111111111:certificate';
const domainName = 'apigv2.demo.com';

const dn = new DomainName(stack, 'DN', {
  domainName,
  certificate: acm.Certificate.fromCertificateArn(stack, 'cert', certArn),
});

const prodApi = new HttpApi(stack, 'HttpProxyProdApi', {
  defaultIntegration: new LambdaProxyIntegration({ handler }),
  // https://${dn.domainName} goes to prodApi $default stage
  defaultDomainMapping: {
    domainName: dn,
    mappingKey: '/',
  },
});

const betaApi = new HttpApi(stack, 'HttpProxyBetaApi', {
  defaultIntegration: new LambdaProxyIntegration({ handler }),
  // https://${dn.domainName}/beta goes to betaApi $default stage
  defaultDomainMapping: {
    domainName: dn,
    mappingKey: 'beta',
  },
});

prodApi.addStage('testing', {
  stageName: 'testing',
  autoDeploy: true,
  // https://${dn.domainName}/testing goes to prodApi testing stage
  domainMapping: {
    domainName: dn,
    mappingKey: 'testing',
  },
} );

new CfnOutput(stack, 'RegionalDomainName', { value: dn.regionalDomainName });
new CfnOutput(stack, 'DomainName', { value: dn.domainName });
new CfnOutput(stack, 'CustomUDomainURL', { value: `https://${dn.domainName}` });
new CfnOutput(stack, 'ProdApiEndpoint', { value: prodApi.url! });
new CfnOutput(stack, 'BetaApiEndpoint', { value: betaApi.url! });
new CfnOutput(stack, 'Region', { value: Stack.of(stack).region});
