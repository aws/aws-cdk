import * as cxschema from '../../cloud-assembly-schema';
import { CfnParameter, ContextProvider, Stack } from '../../core';
import * as rds from '../lib';

/* eslint-disable */
describe('DatabaseCluster from lookup', () => {
  test('return correct cluster info', () => {
    // GIVEN
    const resultObjs = [
      {
        'DBClusterArn': 'arn:aws:rds:us-east-1:123456789012:cluster:cluster-1',
        'Endpoint.Address': 'cluster-1.cluster-testserver.us-east-1.rds.amazonaws.com',
        'Endpoint.Port': '5432',
        'ReadEndpoint.Address': 'cluster-1.cluster-ro-testserver.us-east-1.rds.amazonaws.com',
        'DBClusterResourceId': 'cluster-ABCDEFGHI',
        'VpcSecurityGroupIds': [],
        'Identifier': 'cluster-1',
      },
    ];
    const value = {
      value: resultObjs,
    };
    const mock = jest.spyOn(ContextProvider, 'getValue').mockReturnValue(value);

    // WHEN
    const stack = new Stack(undefined, undefined, { env: { region: 'us-east-1', account: '123456789012' } });
    const cluster = rds.DatabaseCluster.fromLookup(stack, 'MyCluster', {
      clusterIdentifier: 'cluster-1',
    });

    // THEN
    expect(cluster.clusterIdentifier).toEqual('cluster-1');
    expect(cluster.clusterEndpoint.hostname).toEqual('cluster-1.cluster-testserver.us-east-1.rds.amazonaws.com');
    expect(cluster.clusterEndpoint.port).toEqual(5432);
    expect(cluster.clusterReadEndpoint.hostname).toEqual('cluster-1.cluster-ro-testserver.us-east-1.rds.amazonaws.com');
    expect(cluster.clusterResourceIdentifier).toEqual('cluster-ABCDEFGHI');
    expect(cluster.connections.securityGroups.length).toEqual(0);

    expect(mock).toHaveBeenCalledWith(stack, {
      provider: cxschema.ContextProvider.CC_API_PROVIDER,
        props: {
          typeName: 'AWS::RDS::DBCluster',
          exactIdentifier: 'cluster-1',
          propertiesToReturn: [
            'DBClusterArn',
            'Endpoint.Address',
            'Endpoint.Port',
            'ReadEndpoint.Address',
            'DBClusterResourceId',
            'VpcSecurityGroupIds',
            'EnableHttpEndpoint',
          ],
        },
        dummyValue: [
          {
            'Identifier': 'TEST',
            'DBClusterArn': 'TESTARN',
            'Endpoint.Address': 'TESTADDRESS',
            'Endpoint.Port': '5432',
            'ReadEndpoint.Address': 'TESTREADERADDRESS',
            'DBClusterResourceId': 'TESTID',
            'VpcSecurityGroupIds': [],
            'EnableHttpEndpoint': true,
          },
        ],
    });

    mock.mockRestore();
  });
});

describe('DatabaseCluster from lookup with security groups', () => {
  test('return correct cluster info with security groups', () => {
    // GIVEN
    const resultObjs = [
      {
        'DBClusterArn': 'arn:aws:rds:us-east-1:123456789012:cluster:cluster-1',
        'Endpoint.Address': 'cluster-1.cluster-testserver.us-east-1.rds.amazonaws.com',
        'Endpoint.Port': '5432',
        'ReadEndpoint.Address': 'cluster-1.cluster-ro-testserver.us-east-1.rds.amazonaws.com',
        'DBClusterResourceId': 'cluster-ABCDEFGHI',
        'VpcSecurityGroupIds': ['sg-1', 'sg-2'],
        'Identifier': 'cluster-1',
      },
    ];
    const value = {
      value: resultObjs,
    };
    const mock = jest.spyOn(ContextProvider, 'getValue').mockReturnValue(value);

    // WHEN
    const stack = new Stack(undefined, undefined, { env: { region: 'us-east-1', account: '123456789012' } });
    const cluster = rds.DatabaseCluster.fromLookup(stack, 'MyCluster', {
      clusterIdentifier: 'cluster-1',
    });

    // THEN
    expect(cluster.clusterIdentifier).toEqual('cluster-1');
    expect(cluster.clusterEndpoint.hostname).toEqual('cluster-1.cluster-testserver.us-east-1.rds.amazonaws.com');
    expect(cluster.clusterEndpoint.port).toEqual(5432);
    expect(cluster.clusterReadEndpoint.hostname).toEqual('cluster-1.cluster-ro-testserver.us-east-1.rds.amazonaws.com');
    expect(cluster.clusterResourceIdentifier).toEqual('cluster-ABCDEFGHI');
    expect(cluster.connections.securityGroups.length).toEqual(2);
    expect(cluster.connections.securityGroups[0].securityGroupId).toEqual('sg-1');
    expect(cluster.connections.securityGroups[1].securityGroupId).toEqual('sg-2');

    expect(mock).toHaveBeenCalledWith(stack, {
      provider: cxschema.ContextProvider.CC_API_PROVIDER,
        props: {
          typeName: 'AWS::RDS::DBCluster',
          exactIdentifier: 'cluster-1',
          propertiesToReturn: [
            'DBClusterArn',
            'Endpoint.Address',
            'Endpoint.Port',
            'ReadEndpoint.Address',
            'DBClusterResourceId',
            'VpcSecurityGroupIds',
            'EnableHttpEndpoint',
          ],
        },
        dummyValue: [
          {
            'Identifier': 'TEST',
            'DBClusterArn': 'TESTARN',
            'Endpoint.Address': 'TESTADDRESS',
            'Endpoint.Port': '5432',
            'ReadEndpoint.Address': 'TESTREADERADDRESS',
            'DBClusterResourceId': 'TESTID',
            'VpcSecurityGroupIds': [],
            'EnableHttpEndpoint': true,
          },
        ],
    });

    mock.mockRestore();
  });
});
/* eslint-enable */

describe('Validation test', () => {
  test('throw error if cluster identifier is a token', () => {
    // GIVEN
    const stack = new Stack(undefined, undefined, { env: { region: 'us-east-1', account: '123456789012' } });
    const tokenClusterIdentifier = new CfnParameter(stack, 'ClusterIdentifier');

    expect(() => rds.DatabaseCluster.fromLookup(stack, 'MyCluster', {
      clusterIdentifier: tokenClusterIdentifier.valueAsString,
    })).toThrow('Cannot look up a cluster with a tokenized cluster identifier.');
  });
});
