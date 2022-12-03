import * as identitypool from '@aws-cdk/aws-cognito-identitypool';
import { App, Stack } from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
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
  excludedPages: ['https://my-website2.com/exclude'],
  favoritePages: ['https://my-website2.com/favorite'],
  includedPages: [],
  sessionSampleRate: 0.1,
  telemetries: [],
});

new IntegTest(app, 'Integ', { testCases: [stack] });
