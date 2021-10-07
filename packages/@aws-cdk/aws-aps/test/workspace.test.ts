import { Template } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import { WorkSpace } from '../lib/';


test('create a WorkSpace', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');
  // WHEN
  new WorkSpace(stack, 'DemoWorkSpace', {
    alias: 'demo-workspace',
    alertManagerDefinition: `
alertmanager_config: |
  route:
    receiver: 'default'
  receivers:
    - name: 'default'
      sns_configs:
      - topic_arn: arn:aws:sns:us-east-2:123456789012:My-Topic
        sigv4:
          region: us-east-2
        attributes:
          key: key1
          value: value1`,
  });

  // we should have the Workspace
  Template.fromStack(stack).hasResourceProperties('AWS::APS::Workspace', {
    AlertManagerDefinition: "\nalertmanager_config: |\n  route:\n    receiver: 'default'\n  receivers:\n    - name: 'default'\n      sns_configs:\n      - topic_arn: arn:aws:sns:us-east-2:123456789012:My-Topic\n        sigv4:\n          region: us-east-2\n        attributes:\n          key: key1\n          value: value1",
    Alias: 'demo-workspace',
  });
});


test('import from workspace id', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');
  // WHEN
  const workspace = WorkSpace.fromWorkSpaceId(stack, 'ImportWorkSpace', 'example-workid');
  // THEN
  expect(workspace).toHaveProperty('workspaceId');
  expect(workspace).toHaveProperty('workspaceArn');
  expect(workspace).toHaveProperty('prometheusEndpoint');
});

test('import from WorkSpace attributes', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');
  // WHEN
  const workspace = WorkSpace.fromWorkSpaceAttributes(stack, 'ImportWorkSpace', {
    workspaceArn: 'mock',
    workspaceId: 'mock',
    prometheusEndpoint: 'mock',
  });
    // THEN
  expect(workspace).toHaveProperty('workspaceId');
  expect(workspace).toHaveProperty('workspaceArn');
  expect(workspace).toHaveProperty('prometheusEndpoint');
});