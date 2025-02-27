import * as cxschema from '../../cloud-assembly-schema';
import { ContextProvider, Stack, Token } from '../../core';
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

  test('throw error if role name is a token', () => {
    // GIVEN
    const tokenName = Token.asString('MyExistingRole');
    const stack = new Stack(undefined, undefined, { env: { region: 'us-east-1', account: '123456789012' } });
    expect(() => iam.Role.fromLookup(stack, 'MyRole', {
      roleName: tokenName,
    })).toThrow(/All arguments to look up a role must be concrete \(no Tokens\)/);
  });
});
/* eslint-enable */
