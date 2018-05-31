import { App, Output, Stack } from 'aws-cdk';
import { VpcNetwork } from 'aws-cdk-ec2';
import { PrivateHostedZone, PublicHostedZone, TXTRecord } from '../lib';

const app = new App(process.argv);

const stack = new Stack(app, 'aws-cdk-route53-integ');

const vpc = new VpcNetwork(stack, 'VPC');

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

new Output(stack, 'PrivateZoneId', { value: privateZone.hostedZoneId });
new Output(stack, 'PublicZoneId', { value: publicZone.hostedZoneId });

process.stdout.write(app.run());
