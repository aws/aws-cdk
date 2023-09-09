/* eslint-disable no-console */
import { Route53ResolverClient, ListFirewallDomainListsCommand } from '@aws-sdk/client-route53resolver';
import { mockClient } from 'aws-sdk-client-mock';
import 'aws-sdk-client-mock-jest' ;
import { handler } from '../../lib/managed-domain-list-handler/index';

console.log = jest.fn();

const route53resolverMock = mockClient(Route53ResolverClient);

beforeEach(() => {
  route53resolverMock.reset();
});

test('found the domain list', async () => {
  // GIVEN
  const event: Partial<AWSLambda.CloudFormationCustomResourceCreateEvent> = {
    RequestType: 'Create',
    ResourceProperties: {
      ServiceToken: 'Foo',
      DefaultSecurityGroupId: 'sg-abc123',
      Account: '12345678912',
      DomainListName: 'AWSManagedDomainsAggregateThreatList',
    },
  };

  route53resolverMock.on(ListFirewallDomainListsCommand).resolves({
    FirewallDomainLists: [
      {
        Arn: 'arn:aws:route53resolver:11111',
        Id: 'rslvr-11111',
        ManagedOwnerName: 'Route 53 Resolver DNS Firewall',
        Name: 'AWSManagedDomainsAmazonGuardDutyThreatList',
      },
      {
        Arn: 'arn:aws:route53resolver:22222',
        Id: 'rslvr-22222',
        Name: 'AWSManagedDomainsAggregateThreatList',
      },
      {
        Arn: 'arn:aws:route53resolver:33333',
        Id: 'rslvr-33333',
        ManagedOwnerName: 'Route 53 Resolver DNS Firewall',
        Name: 'AWSManagedDomainsAggregateThreatList',
      },
    ],
  });

  // WHEN
  const result = await invokeHandler(event);

  // THEN
  expect(result.Data?.DomainListId).toBe('rslvr-33333');
  expect(route53resolverMock).toHaveReceivedCommandTimes(ListFirewallDomainListsCommand, 1);
});

test('could not find the domain list', async () => {
  // GIVEN
  const event: Partial<AWSLambda.CloudFormationCustomResourceCreateEvent> = {
    RequestType: 'Create',
    ResourceProperties: {
      ServiceToken: 'Foo',
      DefaultSecurityGroupId: 'sg-abc123',
      Account: '12345678912',
      DomainListName: 'AWSManagedDomainsAggregateThreatList',
    },
  };

  route53resolverMock.on(ListFirewallDomainListsCommand).resolves({
    FirewallDomainLists: [
      {
        Arn: 'arn:aws:route53resolver:11111',
        Id: 'rslvr-11111',
        ManagedOwnerName: 'Route 53 Resolver DNS Firewall',
        Name: 'AWSManagedDomainsAmazonGuardDutyThreatList',
      },
      {
        Arn: 'arn:aws:route53resolver:22222',
        Id: 'rslvr-22222',
        Name: 'AWSManagedDomainsAggregateThreatList',
      },
    ],
  });

  // WHEN
  const result = await invokeHandler(event);

  // THEN
  expect(result.Status).toBe('FAILED');
  expect(route53resolverMock).toHaveReceivedCommandTimes(ListFirewallDomainListsCommand, 1);
});

test('error are thrown by sdk', async () => {
  // GIVEN
  const event: Partial<AWSLambda.CloudFormationCustomResourceCreateEvent> = {
    RequestType: 'Create',
    ResourceProperties: {
      ServiceToken: 'Foo',
      DefaultSecurityGroupId: 'sg-abc123',
      Account: '12345678912',
      DomainListName: 'AWSManagedDomainsAggregateThreatList',
    },
  };

  route53resolverMock.on(ListFirewallDomainListsCommand).rejects();

  // WHEN
  const result = await invokeHandler(event);

  // THEN
  expect(result.Status).toBe('FAILED');
  expect(route53resolverMock).toHaveReceivedCommandTimes(ListFirewallDomainListsCommand, 1);
});

// helper function to get around TypeScript expecting a complete event object,
// even though our tests only need some of the fields
async function invokeHandler(event: Partial<AWSLambda.CloudFormationCustomResourceEvent>) {
  return handler(event as AWSLambda.CloudFormationCustomResourceEvent);
}
