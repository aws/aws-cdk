//import { Template, Match } from '@aws-cdk/assertions';
//import { Template } from '@aws-cdk/assertions';
//import * as cdk from '@aws-cdk/core';
import * as NetFW from '../lib';

test('Default properties 5Tuple Rule', () => {
  // GIVEN
  // WHEN
  const stateful5TupleRule = new NetFW.Stateful5TupleRule({
    action: NetFW.StatefulStandardAction.DROP,
  });

  expect(stateful5TupleRule.resource).toStrictEqual({
    action: 'DROP',
    header: {
      destination: 'ANY',
      destinationPort: 'ANY',
      direction: 'ANY',
      protocol: 'IP',
      source: 'ANY',
      sourcePort: 'ANY',
    },
    ruleOptions: [],
  });
});

test('Given properties 5Tuple Rule', () => {
  // GIVEN
  // WHEN
  const stateful5TupleRule = new NetFW.Stateful5TupleRule({
    action: NetFW.StatefulStandardAction.DROP,
    destinationPort: '80',
    destination: '$HOME_NET',
    protocol: 'TCP',
    sourcePort: '0-65535',
    source: '10.0.0.0/16, 10.10.0.0/16',
    ruleOptions: [
      {
        keyword: 'HOME_NET',
        settings: ['10.0.0.0/16', '10.10.0.0/16'],
      },
      {
        keyword: 'INTERNET_NET',
        settings: ['!$HOME_NET'],
      },
    ],
    direction: NetFW.Stateful5TupleDirection.FORWARD,
  });

  expect(stateful5TupleRule.resource).toStrictEqual({
    action: 'DROP',
    header: {
      destination: '$HOME_NET',
      destinationPort: '80',
      direction: 'FORWARD',
      protocol: 'TCP',
      source: '10.0.0.0/16, 10.10.0.0/16',
      sourcePort: '0-65535',
    },
    ruleOptions: [
      {
        keyword: 'HOME_NET',
        settings: ['10.0.0.0/16', '10.10.0.0/16'],
      },
      {
        keyword: 'INTERNET_NET',
        settings: ['!$HOME_NET'],
      },
    ],
  });
});


test('Default properties Domain List', () => {
  // GIVEN
  // WHEN
  const statefulDomainListRule = new NetFW.StatefulDomainListRule({
    type: NetFW.StatefulDomainListType.DENYLIST,
    targets: [],
    targetTypes: [],
  });

  expect(statefulDomainListRule.resource).toStrictEqual({
    generatedRulesType: 'DENYLIST',
    targets: [],
    targetTypes: [],
  });
});

test('Given properties Domain List', () => {
  // GIVEN
  // WHEN
  const statefulDomainListRule = new NetFW.StatefulDomainListRule({
    type: NetFW.StatefulDomainListType.ALLOWLIST,
    targets: ['*.example.com', 'example.com'],
    targetTypes: [
      NetFW.StatefulDomainListTargetType.TLS_SNI,
      NetFW.StatefulDomainListTargetType.HTTP_HOST,
    ],
  });

  expect(statefulDomainListRule.resource).toStrictEqual({
    generatedRulesType: 'ALLOWLIST',
    targets: ['*.example.com', 'example.com'],
    targetTypes: ['TLS_SNI', 'HTTP_HOST'],
  });
});
