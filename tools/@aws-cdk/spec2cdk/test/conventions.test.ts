import { camelcasedResourceName } from '../lib/naming';

test('test the ref-naminification of OIDCProvider', () => {
  const name = camelcasedResourceName({
    name: 'OIDCProvider',
    cloudFormationType: 'AWS::IAM::OIDCProvider',
    attributes: {},
    properties: {},
    $id: '',
  });

  expect(name).toEqual('oidcProvider');
});
