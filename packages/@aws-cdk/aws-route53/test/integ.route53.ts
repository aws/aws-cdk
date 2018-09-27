import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import { PrivateHostedZone, PublicHostedZone, TXTRecord } from '../lib';

const app = new cdk.App(process.argv);

const stack = new cdk.Stack(app, 'aws-cdk-route53-integ');

const vpc = new ec2.VpcNetwork(stack, 'VPC');

const privateZone = new PrivateHostedZone(stack, 'PrivateZone', {
  zoneName: 'cdk.local', vpc
});

const publicZone = new PublicHostedZone(stack, 'PublicZone', {
  zoneName: 'cdk.test'
});

new TXTRecord(privateZone, 'TXT', {
  recordName: '_foo',
  recordValue: 'Bar!',
  ttl: 60
});

new cdk.Output(stack, 'PrivateZoneId', { value: privateZone.hostedZoneId });
new cdk.Output(stack, 'PublicZoneId', { value: publicZone.hostedZoneId });

process.stdout.write(app.run());
