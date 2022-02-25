import { Template } from '@aws-cdk/assertions';
import { SamlMetadataDocument, SamlProvider } from '@aws-cdk/aws-iam';
import { testDeprecated } from '@aws-cdk/cdk-build-tools';
import { App, Stack } from '@aws-cdk/core';
import * as ec2 from '../lib';
import {
  ClientVpnRoute,
  ClientVpnRouteTarget,
  ClientVpnUserBasedAuthentication,
} from '../lib';

let stack: Stack;
let vpc: ec2.IVpc;
beforeEach(() => {
  const app = new App({
    context: {
      '@aws-cdk/core:newStyleStackSynthesis': false,
    },
  });
  stack = new Stack(app);
  vpc = new ec2.Vpc(stack, 'Vpc');
});

describe('ClientVpnRoute constructor', () => {
  test('normal usage', () => {
    const samlProvider = new SamlProvider(stack, 'Provider', {
      metadataDocument: SamlMetadataDocument.fromXml('xml'),
    });
    const clientVpnEndpoint = vpc.addClientVpnEndpoint('Endpoint', {
      cidr: '10.100.0.0/16',
      serverCertificateArn: 'server-certificate-arn',
      clientCertificateArn: 'client-certificate-arn',
      clientConnectionHandler: {
        functionArn: 'function-arn',
        functionName: 'AWSClientVPN-function-name',
      },
      dnsServers: ['8.8.8.8', '8.8.4.4'],
      userBasedAuthentication: ClientVpnUserBasedAuthentication.federated(samlProvider),
    });
    new ClientVpnRoute(stack, 'NormalRoute', {
      clientVpnEndpoint,
      cidr: '0.0.0.0/0',
      target: ClientVpnRouteTarget.local(),
    });
    Template.fromStack(stack).resourceCountIs('AWS::EC2::VPC', 1);
    Template.fromStack(stack).resourceCountIs('AWS::EC2::ClientVpnEndpoint', 1);
    Template.fromStack(stack).resourceCountIs('AWS::EC2::ClientVpnRoute', 1);
    expect(stack.node.children.length).toBe(3);
  });
  testDeprecated('either clientVpnEndoint (deprecated, typo) or clientVpnEndpoint is required', () => {
    expect(() => {
      new ClientVpnRoute(stack, 'RouteNoEndointOrEndpoint', {
        cidr: '0.0.0.0/0',
        target: ClientVpnRouteTarget.local(),
      });
    }).toThrow(
      new Error(
        'ClientVpnRoute: either clientVpnEndpoint or clientVpnEndoint (deprecated) must be specified',
      ),
    );
  });
  testDeprecated('specifying both clientVpnEndoint (deprecated, typo) and clientVpnEndpoint is not allowed', () => {
    const samlProvider = new SamlProvider(stack, 'Provider', {
      metadataDocument: SamlMetadataDocument.fromXml('xml'),
    });
    const clientVpnEndpoint = vpc.addClientVpnEndpoint('Endpoint', {
      cidr: '10.100.0.0/16',
      serverCertificateArn: 'server-certificate-arn',
      clientCertificateArn: 'client-certificate-arn',
      clientConnectionHandler: {
        functionArn: 'function-arn',
        functionName: 'AWSClientVPN-function-name',
      },
      dnsServers: ['8.8.8.8', '8.8.4.4'],
      userBasedAuthentication: ClientVpnUserBasedAuthentication.federated(samlProvider),
    });
    const clientVpnEndoint = clientVpnEndpoint;
    expect(() => {
      new ClientVpnRoute(stack, 'RouteBothEndointAndEndpoint', {
        clientVpnEndoint,
        clientVpnEndpoint,
        cidr: '0.0.0.0/0',
        target: ClientVpnRouteTarget.local(),
      });
    }).toThrow(
      new Error(
        'ClientVpnRoute: either clientVpnEndpoint or clientVpnEndoint (deprecated) must be specified' +
          ', but not both',
      ),
    );
  });
  test('invalid constructor calls should not add anything to the stack', () => {
    expect(() => {
      new ClientVpnRoute(stack, 'RouteNoEndointOrEndpoint', {
        cidr: '0.0.0.0/0',
        target: ClientVpnRouteTarget.local(),
      });
    }).toThrow();
    Template.fromStack(stack).resourceCountIs('AWS::EC2::VPC', 1);
    expect(stack.node.children.length).toBe(1);
  });
  testDeprecated('supplying clientVpnEndoint (deprecated due to typo) should still work', () => {
    const samlProvider = new SamlProvider(stack, 'Provider', {
      metadataDocument: SamlMetadataDocument.fromXml('xml'),
    });
    const clientVpnEndoint = vpc.addClientVpnEndpoint('Endpoint', {
      cidr: '10.100.0.0/16',
      serverCertificateArn: 'server-certificate-arn',
      clientCertificateArn: 'client-certificate-arn',
      clientConnectionHandler: {
        functionArn: 'function-arn',
        functionName: 'AWSClientVPN-function-name',
      },
      dnsServers: ['8.8.8.8', '8.8.4.4'],
      userBasedAuthentication: ClientVpnUserBasedAuthentication.federated(samlProvider),
    });
    new ClientVpnRoute(stack, 'RouteWithEndointTypo', {
      clientVpnEndoint,
      cidr: '0.0.0.0/0',
      target: ClientVpnRouteTarget.local(),
    });
    Template.fromStack(stack).resourceCountIs('AWS::EC2::VPC', 1);
    Template.fromStack(stack).resourceCountIs('AWS::EC2::ClientVpnEndpoint', 1);
    Template.fromStack(stack).resourceCountIs('AWS::EC2::ClientVpnRoute', 1);
    expect(stack.node.children.length).toBe(3);
  });
});
