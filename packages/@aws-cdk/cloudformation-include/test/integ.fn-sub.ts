import * as core from '@aws-cdk/core';
import * as inc from '../lib';

const app = new core.App();

const stack = new core.Stack(app, 'SubStack');

new inc.CfnInclude(stack, 'ParentStack', {
  templateFile: 'test-templates/fn-sub.json',
});

app.synth();
