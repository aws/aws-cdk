import * as cdk from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import { CfnWorkGroup } from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-athena-workgroup-tags');

new CfnWorkGroup(stack, 'AthenaWorkgroup', {
  name: 'HelloWorld',
  description: 'A WorkGroup',
  recursiveDeleteOption: true,
  state: 'ENABLED',
  tags: [
    {
      key: 'key1',
      value: 'value1',
    },
    {
      key: 'key2',
      value: 'value2',
    },
  ],
});

new IntegTest(app, 'athena-workgroup-tags-test', {
  testCases: [stack],
});

app.synth();
