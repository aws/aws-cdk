import { IdentitySource } from '../../lib';

describe('identity source', () => {
  test('blank amount', () => {
    expect(() => IdentitySource.context('')).toThrow(/empty/);
  });

  test('IdentitySource header', () => {
    const identitySource = IdentitySource.header('Authorization');
    expect(identitySource.toString()).toEqual('method.request.header.Authorization');
  });

  test('IdentitySource queryString', () => {
    const identitySource = IdentitySource.queryString('param');
    expect(identitySource.toString()).toEqual('method.request.querystring.param');
  });

  test('IdentitySource stageVariable', () => {
    const identitySource = IdentitySource.stageVariable('var1');
    expect(identitySource.toString()).toEqual('stageVariables.var1');
  });

  test('IdentitySource context', () => {
    const identitySource = IdentitySource.context('httpMethod');
    expect(identitySource.toString()).toEqual('context.httpMethod');
  });
});
