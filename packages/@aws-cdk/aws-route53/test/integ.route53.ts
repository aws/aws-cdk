import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import { ARecord, CaaAmazonRecord, CnameRecord, PrivateHostedZone, PublicHostedZone, RecordTarget, TxtRecord } from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-route53-integ');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAZs: 1 });

const privateZone = new PrivateHostedZone(stack, 'PrivateZone', {
  zoneName: 'cdk.local', vpc
});

const publicZone = new PublicHostedZone(stack, 'PublicZone', {
  zoneName: 'cdk.test'
});
const publicSubZone = new PublicHostedZone(stack, 'PublicSubZone', {
  zoneName: 'sub.cdk.test'
});
publicZone.addDelegation(publicSubZone);

new TxtRecord(privateZone, 'TXT', {
  zone: privateZone,
  recordName: '_foo',
  values: [
    'Bar!',
    'Baz?'
  ],
  ttl: 60
});

new CnameRecord(stack, 'CNAME', {
  zone: privateZone,
  recordName: 'www',
  domainName: 'server'
});

new ARecord(stack, 'A', {
  zone: privateZone,
  recordName: 'test',
  target: RecordTarget.fromIpAddresses('1.2.3.4', '5.6.7.8')
});

new CaaAmazonRecord(stack, 'CaaAmazon', {
  zone: publicZone
});

new cdk.CfnOutput(stack, 'PrivateZoneId', { value: privateZone.hostedZoneId });
new cdk.CfnOutput(stack, 'PublicZoneId', { value: publicZone.hostedZoneId });

app.run();
