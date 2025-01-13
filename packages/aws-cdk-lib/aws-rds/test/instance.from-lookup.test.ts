import { Construct } from 'constructs';
import * as cxschema from '../../cloud-assembly-schema';
import { ContextProvider, GetContextValueOptions, GetContextValueResult, Lazy, Stack } from '../../core';
import * as rds from '../lib';

describe('DatabaseInstanceBase from lookup', () => {
  test('return correct instance info', () => {
    const dataObj = {};
    Object.assign(dataObj, { ['DBInstanceArn']: 'arn:aws:rds:us-east-1:123456789012:db:instance-1' });
    Object.assign(dataObj, { ['Endpoint.Address']: 'instance-1.testserver.us-east-1.rds.amazonaws.com' });
    Object.assign(dataObj, { ['Endpoint.Port']: '5432' });
    Object.assign(dataObj, { ['DbiResourceId']: 'db-ABCDEFGHI' });
    Object.assign(dataObj, { ['DBSecurityGroups']: [] });
    const resultObj = {};
    Object.assign(resultObj, { ['instance-1']: dataObj });

    const previous = mockDbInstanceContextProviderWith(resultObj, options => {
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

    restoreContextProvider(previous);
  });
});

describe('DatabaseInstanceBase from lookup with DBSG', () => {
  test('return correct instance info', () => {
    const dataObj = {};
    Object.assign(dataObj, { ['DBInstanceArn']: 'arn:aws:rds:us-east-1:123456789012:db:instance-1' });
    Object.assign(dataObj, { ['Endpoint.Address']: 'instance-1.testserver.us-east-1.rds.amazonaws.com' });
    Object.assign(dataObj, { ['Endpoint.Port']: '5432' });
    Object.assign(dataObj, { ['DbiResourceId']: 'db-ABCDEFGHI' });
    Object.assign(dataObj, { ['DBSecurityGroups']: ['dbsg-1', 'dbsg-2'] });
    const resultObj = {};
    Object.assign(resultObj, { ['instance-1']: dataObj });

    const previous = mockDbInstanceContextProviderWith(resultObj, options => {
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

function mockDbInstanceContextProviderWith(
  response: Object,
  paramValidator?: (options: cxschema.CcApiContextQuery) => void) {

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
