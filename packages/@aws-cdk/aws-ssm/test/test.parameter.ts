import { expect, haveResource } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import ssm = require('../lib');

export = {
  'creating a String SSM Parameter'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new ssm.StringParameter(stack, 'Parameter', {
      allowedPattern: '.*',
      description: 'The value Foo',
      name: 'FooParameter',
      value: 'Foo',
    });

    // THEN
    expect(stack).to(haveResource('AWS::SSM::Parameter', {
      AllowedPattern: '.*',
      Description: 'The value Foo',
      Name: 'FooParameter',
      Type: 'String',
      Value: 'Foo',
    }));
    test.done();
  },

  'String SSM Parameter rejects invalid values'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // THEN
    test.throws(() => new ssm.StringParameter(stack, 'Parameter', { allowedPattern: '^Bar$', value: 'FooBar' }),
                /does not match the specified allowedPattern/);
    test.done();
  },

  'String SSM Parameter allows unresolved tokens'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // THEN
    test.doesNotThrow(() => new ssm.StringParameter(stack, 'Parameter', { allowedPattern: '^Bar$', value: new cdk.Token(() => 'Foo!').toString() }));
    test.done();
  },

  'creating a StringList SSM Parameter'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new ssm.StringListParameter(stack, 'Parameter', {
      allowedPattern: '(Foo|Bar)',
      description: 'The values Foo and Bar',
      name: 'FooParameter',
      value: ['Foo', 'Bar'],
    });

    // THEN
    expect(stack).to(haveResource('AWS::SSM::Parameter', {
      AllowedPattern: '(Foo|Bar)',
      Description: 'The values Foo and Bar',
      Name: 'FooParameter',
      Type: 'StringList',
      Value: 'Foo,Bar',
    }));
    test.done();
  },

  'StringList SSM Parameter values cannot contain commas'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // THEN
    test.throws(() => new ssm.StringListParameter(stack, 'Parameter', { value: ['Foo,Bar'] }),
                /cannot contain the ',' character/);
    test.done();
  },

  'StringList SSM Parameter rejects invalid values'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // THEN
    test.throws(() => new ssm.StringListParameter(stack, 'Parameter', { allowedPattern: '^(Foo|Bar)$', value: ['Foo', 'FooBar'] }),
                /does not match the specified allowedPattern/);
    test.done();
  },

  'StringList SSM Parameter allows unresolved tokens'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // THEN
    test.doesNotThrow(() => new ssm.StringListParameter(stack, 'Parameter', {
      allowedPattern: '^(Foo|Bar)$',
      value: ['Foo', new cdk.Token(() => 'Baz!').toString()]
    }));
    test.done();
  },

  'parameterArn is crafted correctly'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const param = new ssm.StringParameter(stack, 'Parameter', { value: 'Foo' });

    // THEN
    test.deepEqual(param.node.resolve(param.parameterArn), {
      'Fn::Join': ['', [
        'arn:',
        { Ref: 'AWS::Partition' },
        ':ssm:',
        { Ref: 'AWS::Region' },
        ':',
        { Ref: 'AWS::AccountId' },
        ':parameter',
        { Ref: 'Parameter9E1B4FBA' }
      ]]
    });
    test.done();
  }
};
