import { App, Stack } from '@aws-cdk/cdk';
import { OutboundTrafficMode, VpcNetwork } from '../lib';

const app = new App(process.argv);

const stack = new Stack(app, 'aws-cdk-ec2-vpc');

new VpcNetwork(stack, 'MyVpc', {
    outboundTraffic: OutboundTrafficMode.FromPublicAndPrivateSubnets
});

process.stdout.write(app.run());
