import { App, Stack } from '@aws-cdk/cdk';
import { VpcNetwork } from '../lib';

const app = new App();

const stack = new Stack(app, 'aws-cdk-ec2-vpc');

new VpcNetwork(stack, 'MyVpc');

app.run();
