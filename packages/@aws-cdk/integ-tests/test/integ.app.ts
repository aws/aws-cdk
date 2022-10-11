import { App, Stack } from '@aws-cdk/core';
import { IntegTest } from '../lib';

const app = new App();
const stack = new Stack();

new IntegTest(app, 'Integ', { testCases: [stack] });
