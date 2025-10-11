import { Template } from '../../assertions';
import { App, Stack } from '../../core';
import { ConnectionGroup } from '../lib';

let app: App;
let stack: Stack;

beforeEach(() => {
  app = new App();
  stack = new Stack(app, 'Stack', {
    env: { account: '1234', region: 'testregion' },
  });
});

test('minimal example renders correctly', () => {
  const connectionGroup = new ConnectionGroup(stack, 'MyConnectionGroup');

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::ConnectionGroup', {
    Name: 'StackMyConnectionGroup',
    Enabled: true,
    Ipv6Enabled: true,
  });

  expect(connectionGroup.connectionGroupName).toBeDefined();
  expect(connectionGroup.routingEndpoint).toBeDefined();
  expect(connectionGroup.arn).toBeDefined();
  expect(connectionGroup.connectionGroupId).toBeDefined();
});

test('with custom name', () => {
  new ConnectionGroup(stack, 'MyConnectionGroup', {
    connectionGroupName: 'custom-connection-group',
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::ConnectionGroup', {
    Name: 'custom-connection-group',
  });
});

test('with all properties', () => {
  new ConnectionGroup(stack, 'MyConnectionGroup', {
    connectionGroupName: 'test-group',
    enabled: false,
    ipv6Enabled: false,
    anycastIpListId: 'test-ip-list-id',
    tags: [
      { key: 'Environment', value: 'test' },
      { key: 'Project', value: 'my-project' },
    ],
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::ConnectionGroup', {
    Name: 'test-group',
    Enabled: false,
    Ipv6Enabled: false,
    AnycastIpListId: 'test-ip-list-id',
    Tags: [
      { Key: 'Environment', Value: 'test' },
      { Key: 'Project', Value: 'my-project' },
    ],
  });
});

test('can import existing connection group', () => {
  const imported = ConnectionGroup.fromConnectionGroupAttributes(stack, 'ImportedGroup', {
    connectionGroupName: 'imported-group',
    routingEndpoint: 'd111111abcdef8.cloudfront.net',
    connectionGroupId: 'ABCDEF123456',
  });

  expect(imported.connectionGroupName).toEqual('imported-group');
  expect(imported.routingEndpoint).toEqual('d111111abcdef8.cloudfront.net');
  expect(imported.connectionGroupId).toEqual('ABCDEF123456');
  expect(imported.arn).toMatch(/arn:.*:cloudfront:.*:connection-group\/ABCDEF123456/);
});
