import { App, Stack } from '@aws-cdk/core';
import * as rum from '../lib';

const app = new App();

const stack = new Stack(app, 'integ-app-monitor');

new rum.AppMonitor(stack, 'MyAppMonitor', {
  domain: 'my-website.com',
});
app.synth();
