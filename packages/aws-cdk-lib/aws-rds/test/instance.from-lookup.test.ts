import { Construct } from 'constructs';
import * as cxschema from '../../cloud-assembly-schema';
import { ContextProvider, GetContextValueOptions, GetContextValueResult, Lazy, Stack } from '../../core';
import * as rds from '../lib';

describe('DatabaseInstanceBase from lookup', () => {
  test('return correct instance info', () => {
    const previous = mockDbInstanceContextProviderWith({
      instanceIdentifier: 'instance-1',
      instanceArn: 'arn:aws:rds:us-east-1:123456789012:db:instance-1',
      dbInstanceEndpointAddress: 'instance-1.testserver.us-east-1.rds.amazonaws.com',
      dbInstanceEndpointPort: 5432,
      instanceResourceId: 'db-ABCDEFGHI',
      dbSecurityGroupIds: [],
    }, options => {
      expect(options.instanceIdentifier).toEqual('instance-1');
    });

    const stack = new Stack(undefined, undefined, { env: { region: 'us-east-1', account: '123456789012' } });
    const instance = rds.DatabaseInstance.fromLookup(stack, 'MyInstance', {
      instanceIdentifier: 'instance-1',
    });

    expect(instance.instanceIdentifier).toEqual('instance-1');
    expect(instance.dbInstanceEndpointAddress).toEqual('instance-1.testserver.us-east-1.rds.amazonaws.com');
    expect(instance.dbInstanceEndpointPort).toEqual('5432');
    expect(instance.instanceResourceId).toEqual('db-ABCDEFGHI');

    restoreContextProvider(previous);
  });

  test('return correct instance with DBSG', () => {
    const previous = mockDbInstanceContextProviderWith({
      instanceIdentifier: 'instance-1',
      instanceArn: 'arn:aws:rds:us-east-1:123456789012:db:instance-1',
      dbInstanceEndpointAddress: 'instance-1.testserver.us-east-1.rds.amazonaws.com',
      dbInstanceEndpointPort: 5432,
      instanceResourceId: 'db-ABCDEFGHI',
      dbSecurityGroupIds: ['dbsg-1', 'dbsg-2'],
    }, options => {
      expect(options.instanceIdentifier).toEqual('instance-1');
    });

    const stack = new Stack(undefined, undefined, { env: { region: 'us-east-1', account: '123456789012' } });
    const instance = rds.DatabaseInstance.fromLookup(stack, 'MyInstance', {
      instanceIdentifier: 'instance-1',
    });

    expect(instance.instanceIdentifier).toEqual('instance-1');
    expect(instance.dbInstanceEndpointAddress).toEqual('instance-1.testserver.us-east-1.rds.amazonaws.com');
    expect(instance.dbInstanceEndpointPort).toEqual('5432');
    expect(instance.instanceResourceId).toEqual('db-ABCDEFGHI');
    expect(instance.connections.securityGroups.length).toEqual(2);

    restoreContextProvider(previous);
  });
});

interface MockDatabaseInstanceContextResponse {
  instanceIdentifier: string;
  instanceArn: string;
  dbInstanceEndpointAddress: string;
  dbInstanceEndpointPort: number;
  instanceResourceId?: string;
  dbSecurityGroupIds: string[];
}

function mockDbInstanceContextProviderWith(
  response: MockDatabaseInstanceContextResponse,
  paramValidator?: (options: cxschema.DatabaseInstanceContextQuery) => void) {

  const previous = ContextProvider.getValue;
  ContextProvider.getValue = (_scope: Construct, options: GetContextValueOptions) => {
    // do some basic sanity checks
    expect(options.provider).toEqual(cxschema.ContextProvider.RDS_DATABASE_INSTANCE_PROVIDER);

    if (paramValidator) {
      paramValidator(options.props as any);
    }

    return {
      value: {
        ...response,
      } as MockDatabaseInstanceContextResponse,
    };
  };
  return previous;
}

function restoreContextProvider(previous: (scope: Construct, options: GetContextValueOptions) => GetContextValueResult): void {
  ContextProvider.getValue = previous;
}
