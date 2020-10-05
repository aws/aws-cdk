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
  // https://${dn.domainName}/foo goes to prodApi $default stage
  defaultDomainMapping: {
    domainName: dn,
    mappingKey: 'foo',
  },
});

// beta stage
prodApi.addStage('BetaStage', {
  stageName: 'beta',
  autoDeploy: true,
  // https://${dn.domainName}/bar goes to the beta stage
  domainMapping: {
    domainName: dn,
    mappingKey: 'bar',
  },
});

// the Demo API
new HttpApi(stack, 'DemoApi', {
  defaultIntegration: new LambdaProxyIntegration({ handler }),
  // https://${dn.domainName}/demo goes to apiDemo $default stage
  defaultDomainMapping: {
    domainName: dn,
    mappingKey: 'demo',
  },
});

new CfnOutput(stack, 'RegionalDomainName', { value: dn.regionalDomainName });
new CfnOutput(stack, 'DomainName', { value: dn.domainName });
new CfnOutput(stack, 'CustomUDomainURL', { value: `https://${dn.domainName}` });
new CfnOutput(stack, 'ProdApiDefaultStageURL', { value: `https://${dn.domainName}/foo` });
new CfnOutput(stack, 'ProdApiBetaStageURL', { value: `https://${dn.domainName}/bar` });
new CfnOutput(stack, 'DemoApiDefaultStageURL', { value: `https://${dn.domainName}/demo` });
