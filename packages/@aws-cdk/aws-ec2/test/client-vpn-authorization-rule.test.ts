import '@aws-cdk/assert-internal/jest';
import { Stack } from '@aws-cdk/core';
import { Connections, IClientVpnEndpoint } from '../lib';
import { ClientVpnAuthorizationRule } from '../lib/client-vpn-authorization-rule';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

describe('ClientVpnAuthorizationRule constructor', () => {
  test('normal usage', () => {
    const clientVpnEndpoint: IClientVpnEndpoint = {
      endpointId: 'myClientVpnEndpoint',
      targetNetworksAssociated: [],
      stack,
      env: { account: 'myAccount', region: 'us-east-1' },
      connections: new Connections(),
      node: stack.node,
    };
    new ClientVpnAuthorizationRule(stack, 'Rule', { cidr: '10.0.10.0/32', clientVpnEndpoint });
    expect(stack).toCountResources('AWS::EC2::ClientVpnAuthorizationRule', 1);
    expect(stack.node.children.length).toBe(1);
  });
  test('either clientVpnEndoint (deprecated, typo) or clientVpnEndpoint is required', () => {
    expect(() => {
      new ClientVpnAuthorizationRule(stack, 'Rule', { cidr: '10.0.10.0/32' });
    }).toThrow(
      new Error(
        'ClientVpnAuthorizationRule: either clientVpnEndpoint or clientVpnEndoint (deprecated) must be specified',
      ),
    );
  });
  test('specifying both clientVpnEndoint (deprecated, typo) and clientVpnEndpoint is not allowed', () => {
    const clientVpnEndoint: IClientVpnEndpoint = {
      endpointId: 'typoTypo',
      targetNetworksAssociated: [],
      stack,
      env: { account: 'myAccount', region: 'us-east-1' },
      connections: new Connections(),
      node: stack.node,
    };
    const clientVpnEndpoint: IClientVpnEndpoint = {
      endpointId: 'myClientVpnEndpoint',
      targetNetworksAssociated: [],
      stack,
      env: { account: 'myAccount', region: 'us-east-1' },
      connections: new Connections(),
      node: stack.node,
    };
    expect(() => {
      new ClientVpnAuthorizationRule(stack, 'Rule', {
        cidr: '10.0.10.0/32',
        clientVpnEndoint,
        clientVpnEndpoint,
      });
    }).toThrow(
      new Error(
        'ClientVpnAuthorizationRule: either clientVpnEndpoint or clientVpnEndoint (deprecated) must be specified' +
          ', but not both',
      ),
    );
  });
  test('invalid constructor calls should not add anything to the stack', () => {
    expect(() => {
      new ClientVpnAuthorizationRule(stack, 'InvalidRule', { cidr: '10.0.10.0/32' });
    }).toThrow();
    expect(stack.node.children.length).toBe(0);
  });
});
