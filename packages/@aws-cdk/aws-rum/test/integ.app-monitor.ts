import * as identitypool from '@aws-cdk/aws-cognito-identitypool';
import { App, Stack } from '@aws-cdk/core';
import * as rum from '../lib';

const app = new App();

const stack = new Stack(app, 'integ-app-monitor');

new rum.AppMonitor(stack, 'DefaultValueAppMonitor', {
  domain: 'my-website.com',
});

const myIdentityPool = new identitypool.IdentityPool(stack, 'MyIdentityPool');
new rum.AppMonitor(stack, 'CustomValueAppMonitor', {
  domain: 'my-website2.com',
  appMonitorName: 'my-app-monitor',
  identityPool: myIdentityPool,
  role: myIdentityPool.unauthenticatedRole,
  persistence: true,
  allowCookies: true,
  enableXRay: true,
  excludedPages: ['/exclude'],
  favoritePages: ['/favorite'],
  includedPages: [],
  sessionSampleRate: 10,
  telemetries: [],
});

app.synth();
