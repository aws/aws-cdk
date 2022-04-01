import { Template } from '@aws-cdk/assertions';
import { App, Stack } from '@aws-cdk/core';
import { DataflowEndpointGroup } from '../lib';

describe('Groundstation Endpoint Groups', () => {
  test('Endpoint Group is created', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');

    new DataflowEndpointGroup(stack, 'DataflowEndpointGroup_1', {
      endpointDetails: [{
        endpoint: {
          address: {
            name: '172.10.0.2',
            port: 44720,
          },
          mtu: 1500,
          name: 'DataflowEndpointGroup_1_Endpoint_1',
        },
        securityDetails: {
          subnetIds: ['subnet-12345678'],
          securityGroupIds: ['sg-87654321'],
        },
      }],
      dataflowEndpointGroupName: 'DataflowEndpointGroup_1',
    });

    Template.fromStack(stack).hasResource('AWS::GroundStation::DataflowEndpointGroup', {

    });
  });
});
