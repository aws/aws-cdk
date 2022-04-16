import { Template } from '@aws-cdk/assertions';
import { testDeprecated } from '@aws-cdk/cdk-build-tools';
import { App, Stack } from '@aws-cdk/core';
import { Connections, IClientVpnEndpoint } from '../lib';
import { ClientVpnAuthorizationRule } from '../lib/client-vpn-authorization-rule';

let stack: Stack;
beforeEach(() => {
  const app = new App({
    context: {
      '@aws-cdk/core:newStyleStackSynthesis': false,
    },
  });
  stack = new Stack(app);
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
      applyRemovalPolicy: () => { },
    };
    new ClientVpnAuthorizationRule(stack, 'NormalRule', {
      cidr: '10.0.10.0/32',
      clientVpnEndpoint,
    });
    Template.fromStack(stack).resourceCountIs('AWS::EC2::ClientVpnAuthorizationRule', 1);
    expect(stack.node.children.length).toBe(1);
  });
  test('either clientVpnEndoint (deprecated, typo) or clientVpnEndpoint is required', () => {
    expect(() => {
      new ClientVpnAuthorizationRule(stack, 'RuleNoEndointNoEndpoint', {
        cidr: '10.0.10.0/32',
      });
    }).toThrow(
      new Error(
        'ClientVpnAuthorizationRule: either clientVpnEndpoint or clientVpnEndoint (deprecated) must be specified',
      ),
    );
  });
  testDeprecated('specifying both clientVpnEndoint (deprecated, typo) and clientVpnEndpoint is not allowed', () => {
    const clientVpnEndoint: IClientVpnEndpoint = {
      endpointId: 'typoTypo',
      targetNetworksAssociated: [],
      stack,
      env: { account: 'myAccount', region: 'us-east-1' },
      connections: new Connections(),
      node: stack.node,
      applyRemovalPolicy: () => { },
    };
    const clientVpnEndpoint: IClientVpnEndpoint = {
      endpointId: 'myClientVpnEndpoint',
      targetNetworksAssociated: [],
      stack,
      env: { account: 'myAccount', region: 'us-east-1' },
      connections: new Connections(),
      node: stack.node,
      applyRemovalPolicy: () => { },
    };
    expect(() => {
      new ClientVpnAuthorizationRule(stack, 'RuleBothEndointAndEndpoint', {
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
      new ClientVpnAuthorizationRule(stack, 'RuleNoEndointNoEndpoint', {
        cidr: '10.0.10.0/32',
      });
    }).toThrow();
    expect(stack.node.children.length).toBe(0);
  });
  testDeprecated('supplying clientVpnEndoint (deprecated due to typo) should still work', () => {
    const clientVpnEndoint: IClientVpnEndpoint = {
      endpointId: 'myClientVpnEndpoint',
      targetNetworksAssociated: [],
      stack,
      env: { account: 'myAccount', region: 'us-east-1' },
      connections: new Connections(),
      node: stack.node,
      applyRemovalPolicy: () => { },
    };
    new ClientVpnAuthorizationRule(stack, 'RuleWithEndointTypo', {
      cidr: '10.0.10.0/32',
      clientVpnEndoint,
    });
    Template.fromStack(stack).resourceCountIs('AWS::EC2::ClientVpnAuthorizationRule', 1);
    expect(stack.node.children.length).toBe(1);
  });
});
