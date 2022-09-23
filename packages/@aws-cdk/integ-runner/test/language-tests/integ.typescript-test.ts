import { App, Stack } from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';

const app = new App();
const stack = new Stack(app);

new IntegTest(app, 'Integ', { testCases: [stack] });

app.synth();
