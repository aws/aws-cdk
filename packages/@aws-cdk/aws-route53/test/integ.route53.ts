import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import { CnameRecord, PrivateHostedZone, PublicHostedZone, TxtRecord } from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-route53-integ');

const vpc = new ec2.VpcNetwork(stack, 'VPC');

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
  recordValue: 'Bar!',
  ttl: 60
});

new CnameRecord(stack, 'CNAME', {
  zone: privateZone,
  recordName: 'www',
  recordValue: 'server'
});

new cdk.CfnOutput(stack, 'PrivateZoneId', { value: privateZone.hostedZoneId });
new cdk.CfnOutput(stack, 'PublicZoneId', { value: publicZone.hostedZoneId });

app.run();
