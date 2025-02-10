import { Construct } from 'constructs';
import * as cxschema from '../../cloud-assembly-schema';
import { ContextProvider, GetContextValueOptions, GetContextValueResult, Lazy, Stack } from '../../core';
import * as rds from '../lib';

/* eslint-disable */
describe('DatabaseInstanceBase from lookup', () => {
  test('return correct instance info', () => {
    // GIVEN
    const resultObjs = [
      {
        'DBInstanceArn': 'arn:aws:rds:us-east-1:123456789012:db:instance-1',
        'Endpoint.Address': 'instance-1.testserver.us-east-1.rds.amazonaws.com',
        'Endpoint.Port': '5432',
        'DbiResourceId': 'db-ABCDEFGHI',
        'DBSecurityGroups': [],
        'Identifier': 'instance-1',
      },
    ];

    const previous = mockDbInstanceContextProviderWith(resultObjs, options => {
      expect(options.exactIdentifier).toEqual('instance-1');
    });

    // WHEN
    const stack = new Stack(undefined, undefined, { env: { region: 'us-east-1', account: '123456789012' } });
    const instance = rds.DatabaseInstance.fromLookup(stack, 'MyInstance', {
      instanceIdentifier: 'instance-1',
    });

    expect(instance.instanceIdentifier).toEqual('instance-1');
    expect(instance.dbInstanceEndpointAddress).toEqual('instance-1.testserver.us-east-1.rds.amazonaws.com');
    expect(instance.dbInstanceEndpointPort).toEqual('5432');
    expect(instance.instanceResourceId).toEqual('db-ABCDEFGHI');

    // restoreContextProvider(previous);
  });
});

describe('DatabaseInstanceBase from lookup with DBSG', () => {
  test('return correct instance info', () => {
    const resultObjs = [
      {
        'DBInstanceArn': 'arn:aws:rds:us-east-1:123456789012:db:instance-1',
        'Endpoint.Address': 'instance-1.testserver.us-east-1.rds.amazonaws.com',
        'Endpoint.Port': '5432',
        'DbiResourceId': 'db-ABCDEFGHI',
        'DBSecurityGroups': ['dbsg-1', 'dbsg-2'],
        'Identifier': 'instance-1',
      },
    ];

    const previous = mockDbInstanceContextProviderWith(resultObjs, options => {
      expect(options.exactIdentifier).toEqual('instance-1');
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
/* eslint-enable */

function mockDbInstanceContextProviderWith(response: Object, paramValidator?: (options: cxschema.CcApiContextQuery) => void) {
  const previous = ContextProvider.getValue;
  ContextProvider.getValue = (_scope: Construct, options: GetContextValueOptions) => {
    // do some basic sanity checks
    expect(options.provider).toEqual(cxschema.ContextProvider.CC_API_PROVIDER);

    if (paramValidator) {
      paramValidator(options.props as any);
    }

    return {
      value: {
        ...response,
      } as Map<string, Map<string, any>>,
    };
  };
  return previous;
}

function restoreContextProvider(previous: (scope: any, options: GetContextValueOptions) => GetContextValueResult): void {
  ContextProvider.getValue = previous;
}
