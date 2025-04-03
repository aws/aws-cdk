import { mock } from 'sinon';
import * as cxschema from '../../cloud-assembly-schema';
import { App, CfnParameter, ContextProvider, Stack, Token } from '../../core';
import * as iam from '../lib';

/* eslint-disable */
describe('Role from lookup', () => {
  test('return correct role info', () => {
    // GIVEN
    const resultObjs = [
      {
        'Arn': 'arn:aws:iam::123456789012:role/MyExistingRole', 
      },
    ];
    const value = {
      value: resultObjs,
    };
    const mock = jest.spyOn(ContextProvider, 'getValue').mockReturnValue(value);

    // WHEN
    const stack = new Stack(undefined, undefined, { env: { region: 'us-east-1', account: '123456789012' } });
    const role = iam.Role.fromLookup(stack, 'MyRole', {
      roleName: 'MyExistingRole',
    });

    // THEN
    expect(role.roleArn).toEqual('arn:aws:iam::123456789012:role/MyExistingRole');

    expect(mock).toHaveBeenCalledWith(stack, {
      provider: cxschema.ContextProvider.CC_API_PROVIDER,
        props: {
          typeName: 'AWS::IAM::Role',
          exactIdentifier: 'MyExistingRole',
          propertiesToReturn: [
            'Arn',
          ],
        } as cxschema.CcApiContextQuery,
        dummyValue: [
          {
            'Arn': 'arn:aws:iam::123456789012:role/DUMMY_ARN',
          },
        ],
    });

    mock.mockRestore();
  });

  test('return dummy role info', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'MyStack', { env: { region: 'us-east-1', account: '123456789012' } });
    const role = iam.Role.fromLookup(stack, 'MyRole', {
      roleName: 'DummyRole',
      mustExist: false,
    });

    // THEN
    expect(role.roleArn).toEqual(iam.Role.DEFAULT_DUMMY_ROLE_ARN);

    expect(app.synth().manifest.missing).toEqual([
      {
        key: 'cc-api-provider:account=123456789012:exactIdentifier=DummyRole:propertiesToReturn.0=Arn:region=us-east-1:typeName=AWS$:$:IAM$:$:Role',
        props: {
          account: '123456789012',
          typeName: 'AWS::IAM::Role',
          ignoreErrorOnMissingContext: true,
          lookupRoleArn: 'arn:${AWS::Partition}:iam::123456789012:role/cdk-hnb659fds-lookup-role-123456789012-us-east-1',
          propertiesToReturn: [
            'Arn',
          ],
          exactIdentifier: 'DummyRole',
          dummyValue: [{
            Arn: 'arn:aws:iam::123456789012:role/DUMMY_ARN',
          }],
          region: 'us-east-1',
        },
        provider: cxschema.ContextProvider.CC_API_PROVIDER,
      },
    ]);
  });

  test('throw error if role name is a token', () => {
    // GIVEN
    const stack = new Stack(undefined, undefined, { env: { region: 'us-east-1', account: '123456789012' } });
    const param = new CfnParameter(stack, 'MyParam', {
      type: 'String',
      default: 'MyExistingRole',
    });

    expect(() => iam.Role.fromLookup(stack, 'MyRole', {
      roleName: param.valueAsString,
    })).toThrow(/All arguments to look up a role must be concrete \(no Tokens\)/);
  });
});

describe('isLookupDummy method', () => {
  test('return false if the lookup role is not a dummy role', () => {
    // GIVEN
    const resultObjs = [
      {
        'Arn': 'arn:aws:iam::123456789012:role/MyExistingRole', 
      },
    ];
    const value = {
      value: resultObjs,
    };
    const mock = jest.spyOn(ContextProvider, 'getValue').mockReturnValue(value);

    // WHEN
    const stack = new Stack(undefined, undefined, { env: { region: 'us-east-1', account: '123456789012' } });
    const role = iam.Role.fromLookup(stack, 'MyRole', {
      roleName: 'MyExistingRole',
    });

    // THEN
    expect(iam.Role.isLookupDummy(role)).toEqual(false);

    mock.mockRestore();
  });

  test('return true if the lookup role is a dummy role', () => {
    // WHEN
    const stack = new Stack(undefined, undefined, { env: { region: 'us-east-1', account: '123456789012' } });
    const role = iam.Role.fromLookup(stack, 'MyRole', {
      roleName: 'DummyRole',
    });

    // THEN
    expect(iam.Role.isLookupDummy(role)).toEqual(true);
  });
});
/* eslint-enable */
