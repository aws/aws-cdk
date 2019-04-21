import { expect, haveResource } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import ssm = require('../lib');
import { Stack } from '@aws-cdk/cdk';

export = {
  'creating a String SSM Parameter'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new ssm.StringParameter(stack, 'Parameter', {
      allowedPattern: '.*',
      description: 'The value Foo',
      name: 'FooParameter',
      stringValue: 'Foo',
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
    test.throws(() => new ssm.StringParameter(stack, 'Parameter', { allowedPattern: '^Bar$', stringValue: 'FooBar' }),
                /does not match the specified allowedPattern/);
    test.done();
  },

  'String SSM Parameter allows unresolved tokens'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // THEN
    test.doesNotThrow(() => {
       new ssm.StringParameter(stack, 'Parameter', { allowedPattern: '^Bar$', stringValue: new cdk.Token(() => 'Foo!').toString() });
    });
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
      stringListValue: ['Foo', 'Bar'],
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
    test.throws(() => new ssm.StringListParameter(stack, 'Parameter', { stringListValue: ['Foo,Bar'] }),
                /cannot contain the ',' character/);
    test.done();
  },

  'StringList SSM Parameter rejects invalid values'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // THEN
    test.throws(() => new ssm.StringListParameter(stack, 'Parameter', { allowedPattern: '^(Foo|Bar)$', stringListValue: ['Foo', 'FooBar'] }),
                /does not match the specified allowedPattern/);
    test.done();
  },

  'StringList SSM Parameter allows unresolved tokens'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // THEN
    test.doesNotThrow(() => new ssm.StringListParameter(stack, 'Parameter', {
      allowedPattern: '^(Foo|Bar)$',
      stringListValue: ['Foo', new cdk.Token(() => 'Baz!').toString()]
    }));
    test.done();
  },

  'parameterArn is crafted correctly'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const param = new ssm.StringParameter(stack, 'Parameter', { stringValue: 'Foo' });

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
  },

  'StringParameter.fromName'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const param = ssm.StringParameter.fromName(stack, 'MyParamName');

    // THEN
    test.deepEqual(stack.node.resolve(param.parameterArn), {
      'Fn::Join': [ '', [
        'arn:',
        { Ref: 'AWS::Partition' },
        ':ssm:',
        { Ref: 'AWS::Region' },
        ':',
        { Ref: 'AWS::AccountId' },
        ':parameterMyParamName' ] ]
    });
    test.deepEqual(stack.node.resolve(param.parameterName), 'MyParamName');
    test.deepEqual(stack.node.resolve(param.parameterType), 'String');
    test.deepEqual(stack.node.resolve(param.stringValue), '{{resolve:ssm:MyParamName}}');
    test.done();
  },

  'StringListParameter.fromName'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const param = ssm.StringListParameter.fromName(stack, 'MyParamName');

    // THEN
    test.deepEqual(stack.node.resolve(param.parameterArn), {
      'Fn::Join': [ '', [
        'arn:',
        { Ref: 'AWS::Partition' },
        ':ssm:',
        { Ref: 'AWS::Region' },
        ':',
        { Ref: 'AWS::AccountId' },
        ':parameterMyParamName' ] ]
    });
    test.deepEqual(stack.node.resolve(param.parameterName), 'MyParamName');
    test.deepEqual(stack.node.resolve(param.parameterType), 'StringList');
    test.deepEqual(stack.node.resolve(param.stringListValue), { 'Fn::Split': [ ',', '{{resolve:ssm:MyParamName}}' ] });
    test.done();
  }
};
