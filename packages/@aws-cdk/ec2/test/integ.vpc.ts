import { App, Stack } from '@aws-cdk/core';
import { VpcNetwork } from '../lib';

const app = new App(process.argv);

const stack = new Stack(app, 'aws-cdk-ec2-vpc');

new VpcNetwork(stack, 'MyVpc');

process.stdout.write(app.run());
