import * as acm from '@aws-cdk/aws-certificatemanager';
import { App, CfnOutput, Stack } from '@aws-cdk/core';
import { HttpApi, HttpProxyIntegration } from '../../../lib';

const app = new App();

const stack = new Stack(app, 'integ-http-proxy');

const certArn = 'arn:aws:acm:us-east-1:111111111111:certificate';

const api = new HttpApi(stack, 'HttpProxyApi', {
  defaultIntegration: new HttpProxyIntegration({ url: 'https://upstream.com' }),
});

const domainName = api.addDomainName({
  certificate: acm.Certificate.fromCertificateArn(stack, 'cert', certArn),
  domainName: 'example.com',
  stage: api.defaultStage!,
});

new CfnOutput(stack, 'RegionalDomainName', { value: domainName.regionalDomainName });
new CfnOutput(stack, 'DomainName', { value: domainName.domainName });
new CfnOutput(stack, 'CustomUDomainURL', { value: `https://${domainName.domainName}` });
new CfnOutput(stack, 'Endpoint', { value: api.url! });
