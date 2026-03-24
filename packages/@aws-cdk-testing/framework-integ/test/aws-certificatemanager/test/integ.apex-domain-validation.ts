import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Stack } from 'aws-cdk-lib';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';

const app = new App();
const stack = new Stack(app, 'AcmApexDomainStack', {
  env: { account: '123456789012', region: 'us-east-1' },
});

const zone = new route53.HostedZone(stack, 'Zone', {
  zoneName: 'example.com',
});

new acm.Certificate(stack, 'Cert', {
  domainName: 'test.tostring.example.com',
  validation: acm.CertificateValidation.fromDns(zone),
});

new IntegTest(app, 'AcmApexDomainInteg', {
  testCases: [stack],
});
