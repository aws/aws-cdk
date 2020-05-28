import * as acm from '@aws-cdk/aws-certificatemanager';
import { App, CfnOutput, Stack } from '@aws-cdk/core';
import { DomainName, HttpApi, HttpProxyIntegration } from '../../../lib';

const app = new App();

const stack = new Stack(app, 'integ-http-proxy');

// const certArn = 'arn:aws:acm:us-east-1:111111111111:certificate';
const certArn = 'arn:aws:acm:ap-northeast-1:903779448426:certificate/293cf875-ca98-4c2e-a797-e1cf6df2553c';
const domainName = 'demo.pahud.dev';

const dn = new DomainName(stack, 'DN', {
  domainName,
  certificate: acm.Certificate.fromCertificateArn(stack, 'cert', certArn),
});

const api = new HttpApi(stack, 'HttpProxyApi', {
  defaultIntegration: new HttpProxyIntegration({ url: 'https://upstream.com' }),
  defaultDomainMapping: {
    domainName: dn,
    mappingKey: 'prod',
  },
});

new CfnOutput(stack, 'RegionalDomainName', { value: dn.regionalDomainName });
new CfnOutput(stack, 'DomainName', { value: dn.domainName });
new CfnOutput(stack, 'CustomUDomainURL', { value: `https://${dn.domainName}` });
new CfnOutput(stack, 'Endpoint', { value: api.url! });
new CfnOutput(stack, 'Region', { value: Stack.of(stack).region});
