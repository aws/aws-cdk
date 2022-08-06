//import { Template, Match } from '@aws-cdk/assertions';
//import { Template } from '@aws-cdk/assertions';
//import * as cdk from '@aws-cdk/core';
import * as NetFW from '../lib';

test('Default properties', () => {
  // GIVEN
  // WHEN
  const statelessrule = new NetFW.StatelessRule({
    actions: [NetFW.StatelessStandardAction.DROP],
  });
  // THEN
  expect(statelessrule.resource).toStrictEqual({
    matchAttributes: {
      destinationPorts: undefined,
      destinations: [],
      protocols: undefined,
      sourcePorts: undefined,
      sources: [],
      tcpFlags: undefined,
    },
    actions: ['aws:drop'],
  });
  expect(statelessrule.calculateCapacity()).toBe(1);
});

test('Given properties', () => {
  // GIVEN
  // WHEN
  const statelessrule = new NetFW.StatelessRule({
    actions: [NetFW.StatelessStandardAction.DROP, 'customAction'],
    destinationPorts: [
      {
        fromPort: 80,
        toPort: 80,
      },
      {
        fromPort: 443,
        toPort: 443,
      },
    ],
    destinations: ['10.0.0.0/16, 10.10.0.0/16'],
    sourcePorts: [{
      fromPort: 0,
      toPort: 65535,
    }],
    sources: ['10.0.0.0/16', '10.10.0.0/16'],
    protocols: [10, 11],
    tcpFlags: [{ flags: ['ECE', 'SYN'], masks: ['SYN', 'ECE'] }],
  });
  // THEN
  expect(statelessrule.resource).toStrictEqual({
    matchAttributes: {
      destinationPorts: [
        {
          fromPort: 80,
          toPort: 80,
        },
        {
          fromPort: 443,
          toPort: 443,
        },
      ],
      destinations: [
        { addressDefinition: '10.0.0.0/16, 10.10.0.0/16' },
      ],
      sourcePorts: [{
        fromPort: 0,
        toPort: 65535,
      }],
      sources: [
        { addressDefinition: '10.0.0.0/16' },
        { addressDefinition: '10.10.0.0/16' },
      ],
      protocols: [10, 11],
      tcpFlags: [{ flags: ['ECE', 'SYN'], masks: ['SYN', 'ECE'] }],
    },
    actions: ['aws:drop', 'customAction'],
  });

  expect(statelessrule.calculateCapacity()).toBe(16);
});
