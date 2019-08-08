import { expect, haveResource } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
import { App, Stack } from '@aws-cdk/core';
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
      parameterName: 'FooParameter',
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
       new ssm.StringParameter(stack, 'Parameter', {
         allowedPattern: '^Bar$',
         stringValue: cdk.Lazy.stringValue({ produce: () => 'Foo!' }),
      });
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
      parameterName: 'FooParameter',
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
      stringListValue: ['Foo', cdk.Lazy.stringValue({ produce: () => 'Baz!' })],
    }));
    test.done();
  },

  'parameterArn is crafted correctly'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const param = new ssm.StringParameter(stack, 'Parameter', { stringValue: 'Foo' });

    // THEN
    test.deepEqual(stack.resolve(param.parameterArn), {
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

  'StringParameter.fromStringParameterName'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const param = ssm.StringParameter.fromStringParameterName(stack, 'MyParamName', 'MyParamName');

    // THEN
    test.deepEqual(stack.resolve(param.parameterArn), {
      'Fn::Join': [ '', [
        'arn:',
        { Ref: 'AWS::Partition' },
        ':ssm:',
        { Ref: 'AWS::Region' },
        ':',
        { Ref: 'AWS::AccountId' },
        ':parameterMyParamName' ] ]
    });
    test.deepEqual(stack.resolve(param.parameterName), 'MyParamName');
    test.deepEqual(stack.resolve(param.parameterType), 'String');
    test.deepEqual(stack.resolve(param.stringValue), { Ref: 'MyParamNameParameter' });
    expect(stack).toMatch({
      Parameters: {
        MyParamNameParameter: {
          Type: "AWS::SSM::Parameter::Value<String>",
          Default: "MyParamName"
        }
      }
    });
    test.done();
  },

  'StringParameter.fromStringParameterAttributes'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const param = ssm.StringParameter.fromStringParameterAttributes(stack, 'MyParamName', {
      parameterName: 'MyParamName',
      version: 2
    });

    // THEN
    test.deepEqual(stack.resolve(param.parameterArn), {
      'Fn::Join': [ '', [
        'arn:',
        { Ref: 'AWS::Partition' },
        ':ssm:',
        { Ref: 'AWS::Region' },
        ':',
        { Ref: 'AWS::AccountId' },
        ':parameterMyParamName' ] ]
    });
    test.deepEqual(stack.resolve(param.parameterName), 'MyParamName');
    test.deepEqual(stack.resolve(param.parameterType), 'String');
    test.deepEqual(stack.resolve(param.stringValue), '{{resolve:ssm:MyParamName:2}}');
    test.done();
  },

  'StringListParameter.fromName'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const param = ssm.StringListParameter.fromStringListParameterName(stack, 'MyParamName', 'MyParamName');

    // THEN
    test.deepEqual(stack.resolve(param.parameterArn), {
      'Fn::Join': [ '', [
        'arn:',
        { Ref: 'AWS::Partition' },
        ':ssm:',
        { Ref: 'AWS::Region' },
        ':',
        { Ref: 'AWS::AccountId' },
        ':parameterMyParamName' ] ]
    });
    test.deepEqual(stack.resolve(param.parameterName), 'MyParamName');
    test.deepEqual(stack.resolve(param.parameterType), 'StringList');
    test.deepEqual(stack.resolve(param.stringListValue), { 'Fn::Split': [ ',', '{{resolve:ssm:MyParamName}}' ] });
    test.done();
  },

  'fromLookup will use the SSM context provider to read value during synthesis'(test: Test) {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'my-staq', { env: { region: 'us-east-1', account: '12344' }});

    // WHEN
    const value = ssm.StringParameter.valueFromLookup(stack, 'my-param-name');

    // THEN
    test.deepEqual(value, 'dummy-value-for-my-param-name');
    test.deepEqual(app.synth().manifest.missing, [
      {
        key: 'ssm:account=12344:parameterName=my-param-name:region=us-east-1',
        props: {
          account: '12344',
          region: 'us-east-1',
          parameterName: 'my-param-name'
        },
        provider: 'ssm'
      }
    ]);
    test.done();
  },

  'valueForStringParameter': {

    'returns a token that represents the SSM parameter value'(test: Test) {
      // GIVEN
      const stack = new Stack();

      // WHEN
      const value = ssm.StringParameter.valueForStringParameter(stack, 'my-param-name');

      // THEN
      expect(stack).toMatch({
        Parameters: {
          SsmParameterValuemyparamnameC96584B6F00A464EAD1953AFF4B05118Parameter: {
            Type: "AWS::SSM::Parameter::Value<String>",
            Default: "my-param-name"
          }
        }
      });
      test.deepEqual(stack.resolve(value), { Ref: 'SsmParameterValuemyparamnameC96584B6F00A464EAD1953AFF4B05118Parameter' });
      test.done();
    },

    'de-dup based on parameter name'(test: Test) {
      // GIVEN
      const stack = new Stack();

      // WHEN
      ssm.StringParameter.valueForStringParameter(stack, 'my-param-name');
      ssm.StringParameter.valueForStringParameter(stack, 'my-param-name');
      ssm.StringParameter.valueForStringParameter(stack, 'my-param-name-2');
      ssm.StringParameter.valueForStringParameter(stack, 'my-param-name');

      // THEN
      expect(stack).toMatch({
        Parameters: {
          SsmParameterValuemyparamnameC96584B6F00A464EAD1953AFF4B05118Parameter: {
            Type: "AWS::SSM::Parameter::Value<String>",
            Default: "my-param-name"
          },
          SsmParameterValuemyparamname2C96584B6F00A464EAD1953AFF4B05118Parameter: {
            Type: "AWS::SSM::Parameter::Value<String>",
            Default: "my-param-name-2"
          }
        }
      });
      test.done();
    },

    'can query actual SSM Parameter Names, multiple times'(test: Test) {
      // GIVEN
      const stack = new Stack();

      // WHEN
      ssm.StringParameter.valueForStringParameter(stack, '/my/param/name');
      ssm.StringParameter.valueForStringParameter(stack, '/my/param/name');

      test.done();
    },
  }
};
