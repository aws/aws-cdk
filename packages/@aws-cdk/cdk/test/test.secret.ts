import { Test } from 'nodeunit';
import { Secret, SecretParameter, Stack } from '../lib';

export = {
  'Secret is merely a token'(test: Test) {
    const stack = new Stack();
    const foo = new Secret('Foo');
    const bar = new Secret(() => 'Bar');

    test.deepEqual(stack.node.resolve(foo), 'Foo');
    test.deepEqual(stack.node.resolve(bar), 'Bar');
    test.done();
  },

  'SecretParameter can be used to define values resolved from SSM parameter store during deployment'(test: Test) {
    const stack = new Stack();

    const mySecret = new SecretParameter(stack, 'MySecret', { ssmParameter: '/my/secret/param' });

    new SecretParameter(stack, 'Boom', {
      ssmParameter: 'Boom',
      description: 'description',
      constraintDescription: 'constraintDescription',
      minLength: -100,
      maxLength: 2000,
      allowedPattern: 'allowed-pattern',
      allowedValues: [ 'allowed', 'values' ],
    });

    test.deepEqual(stack._toCloudFormation(), { Parameters:
      { MySecretParameterBB81DE58:
         { Type: 'AWS::SSM::Parameter::Value<String>',
         Default: '/my/secret/param',
         NoEcho: true },
        BoomParameterB3EB3942:
         { Type: 'AWS::SSM::Parameter::Value<String>',
         Default: 'Boom',
         AllowedPattern: 'allowed-pattern',
         AllowedValues: [ 'allowed', 'values' ],
         ConstraintDescription: 'constraintDescription',
         Description: 'description',
         MaxLength: 2000,
         MinLength: -100,
         NoEcho: true } } });

    // value resolves to a "Ref"
    test.deepEqual(stack.node.resolve(mySecret.value), { Ref: 'MySecretParameterBB81DE58' });

    test.done();
  }
};
