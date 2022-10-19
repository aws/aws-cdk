/* eslint-disable max-len */

import { Template } from '@aws-cdk/assertions';
import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import { testDeprecated } from '@aws-cdk/cdk-build-tools';
import * as cdk from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import * as ssm from '../lib';
import { ParameterType, ParameterValueType } from '../lib';

test('creating a String SSM Parameter', () => {
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
  Template.fromStack(stack).hasResourceProperties('AWS::SSM::Parameter', {
    AllowedPattern: '.*',
    Description: 'The value Foo',
    Name: 'FooParameter',
    Type: 'String',
    Value: 'Foo',
  });
});

testDeprecated('type cannot be specified as AWS_EC2_IMAGE_ID', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // THEN
  expect(() => new ssm.StringParameter(stack, 'myParam', {
    stringValue: 'myValue',
    type: ssm.ParameterType.AWS_EC2_IMAGE_ID,
  })).toThrow('The type must either be ParameterType.STRING or ParameterType.STRING_LIST. Did you mean to set dataType: ParameterDataType.AWS_EC2_IMAGE instead?');
});

test('dataType can be specified', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  new ssm.StringParameter(stack, 'myParam', {
    stringValue: 'myValue',
    dataType: ssm.ParameterDataType.AWS_EC2_IMAGE,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::SSM::Parameter', {
    Value: 'myValue',
    DataType: 'aws:ec2:image',
  });
});

test('expect String SSM Parameter to have tier properly set', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  new ssm.StringParameter(stack, 'Parameter', {
    allowedPattern: '.*',
    description: 'The value Foo',
    parameterName: 'FooParameter',
    stringValue: 'Foo',
    tier: ssm.ParameterTier.ADVANCED,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::SSM::Parameter', {
    Tier: 'Advanced',
  });
});

test('String SSM Parameter rejects invalid values', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // THEN
  expect(() => new ssm.StringParameter(stack, 'Parameter', { allowedPattern: '^Bar$', stringValue: 'FooBar' })).toThrow(
    /does not match the specified allowedPattern/);
});

test('String SSM Parameter allows unresolved tokens', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // THEN
  expect(() => {
    new ssm.StringParameter(stack, 'Parameter', {
      allowedPattern: '^Bar$',
      stringValue: cdk.Lazy.string({ produce: () => 'Foo!' }),
    });
  }).not.toThrow();
});

test('creating a StringList SSM Parameter', () => {
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
  Template.fromStack(stack).hasResourceProperties('AWS::SSM::Parameter', {
    AllowedPattern: '(Foo|Bar)',
    Description: 'The values Foo and Bar',
    Name: 'FooParameter',
    Type: 'StringList',
    Value: 'Foo,Bar',
  });
});

test('String SSM Parameter throws on long descriptions', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // THEN
  expect(() => {
    new ssm.StringParameter(stack, 'Parameter', {
      stringValue: 'Foo',
      description: '1024+ character long description: Lorem ipsum dolor sit amet, consectetuer adipiscing elit. \
      Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, \
      nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat \
      massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, \
      imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. \
      Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, \
      eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus \
      varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. \
      Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing \
      sem neque sed ipsum.',
    });
  }).toThrow(/Description cannot be longer than 1024 characters./);
});

test('String SSM Parameter throws on long names', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // THEN
  expect(() => {
    new ssm.StringParameter(stack, 'Parameter', {
      stringValue: 'Foo',
      parameterName: '2048+ character long name: Lorem ipsum dolor sit amet, consectetuer adipiscing elit. \
      Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, \
      nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat \
      massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, \
      imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. \
      Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, \
      eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus \
      varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. \
      Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing \
      sem neque sed ipsum. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. \
      Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, \
      nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat \
      massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, \
      imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. \
      Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, \
      eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus \
      varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. \
      Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing \
      sem neque sed ipsum.',
    });
  }).toThrow(/name cannot be longer than 2048 characters./);
});

test.each([
  '/parameter/with spaces',
  'charactersOtherThan^allowed',
  'trying;this',
])('String SSM Parameter throws on invalid name %s', (parameterName) => {
  // GIVEN
  const stack = new cdk.Stack();

  // THEN
  expect(() => {
    new ssm.StringParameter(stack, 'Parameter', { stringValue: 'Foo', parameterName });
  }).toThrow(/name must only contain letters, numbers, and the following 4 symbols.*/);
});

test('StringList SSM Parameter throws on long descriptions', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // THEN
  expect(() => {
    new ssm.StringListParameter(stack, 'Parameter', {
      stringListValue: ['Foo', 'Bar'],
      description: '1024+ character long description: Lorem ipsum dolor sit amet, consectetuer adipiscing elit. \
      Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, \
      nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat \
      massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, \
      imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. \
      Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, \
      eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus \
      varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. \
      Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing \
      sem neque sed ipsum.',
    });
  }).toThrow(/Description cannot be longer than 1024 characters./);
});

test('StringList SSM Parameter throws on long names', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // THEN
  expect(() => {
    new ssm.StringListParameter(stack, 'Parameter', {
      stringListValue: ['Foo', 'Bar'],
      parameterName: '2048+ character long name: Lorem ipsum dolor sit amet, consectetuer adipiscing elit. \
      Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, \
      nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat \
      massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, \
      imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. \
      Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, \
      eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus \
      varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. \
      Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing \
      sem neque sed ipsum. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. \
      Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, \
      nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat \
      massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, \
      imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. \
      Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, \
      eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus \
      varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. \
      Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing \
      sem neque sed ipsum.',
    });
  }).toThrow(/name cannot be longer than 2048 characters./);
});

test.each([
  '/parameter/with spaces',
  'charactersOtherThan^allowed',
  'trying;this',
])('StringList SSM Parameter throws on invalid name %s', (parameterName) => {
  // GIVEN
  const stack = new cdk.Stack();

  // THEN
  expect(() => {
    new ssm.StringListParameter(stack, 'Parameter', { stringListValue: ['Foo'], parameterName });
  }).toThrow(/name must only contain letters, numbers, and the following 4 symbols.*/);
});

test('StringList SSM Parameter values cannot contain commas', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // THEN
  expect(() => new ssm.StringListParameter(stack, 'Parameter', { stringListValue: ['Foo,Bar'] })).toThrow(
    /cannot contain the ',' character/);
});

test('StringList SSM Parameter rejects invalid values', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // THEN
  expect(() => new ssm.StringListParameter(stack, 'Parameter', { allowedPattern: '^(Foo|Bar)$', stringListValue: ['Foo', 'FooBar'] })).toThrow(
    /does not match the specified allowedPattern/);
});

test('StringList SSM Parameter allows unresolved tokens', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // THEN
  expect(() => new ssm.StringListParameter(stack, 'Parameter', {
    allowedPattern: '^(Foo|Bar)$',
    stringListValue: ['Foo', cdk.Lazy.string({ produce: () => 'Baz!' })],
  })).not.toThrow();
});

test('parameterArn is crafted correctly', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const param = new ssm.StringParameter(stack, 'Parameter', { stringValue: 'Foo' });

  // THEN
  expect(stack.resolve(param.parameterArn)).toEqual({
    'Fn::Join': ['', [
      'arn:',
      { Ref: 'AWS::Partition' },
      ':ssm:',
      { Ref: 'AWS::Region' },
      ':',
      { Ref: 'AWS::AccountId' },
      ':parameter/',
      { Ref: 'Parameter9E1B4FBA' },
    ]],
  });
});

test('parameterName that includes a "/" must be fully qualified (i.e. begin with "/") as well', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // THEN
  expect(() => new ssm.StringParameter(stack, 'myParam', {
    stringValue: 'myValue',
    parameterName: 'path/to/parameter',
  })).toThrow(/Parameter names must be fully qualified/);

  expect(() => new ssm.StringListParameter(stack, 'myParam2', {
    stringListValue: ['foo', 'bar'],
    parameterName: 'path/to/parameter2',
  })).toThrow(/Parameter names must be fully qualified \(if they include \"\/\" they must also begin with a \"\/\"\)\: path\/to\/parameter2/);
});

test('StringParameter.fromStringParameterName', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  const param = ssm.StringParameter.fromStringParameterName(stack, 'MyParamName', 'MyParamName');

  // THEN
  expect(stack.resolve(param.parameterArn)).toEqual({
    'Fn::Join': ['', [
      'arn:',
      { Ref: 'AWS::Partition' },
      ':ssm:',
      { Ref: 'AWS::Region' },
      ':',
      { Ref: 'AWS::AccountId' },
      ':parameter/MyParamName',
    ]],
  });
  expect(stack.resolve(param.parameterName)).toEqual('MyParamName');
  expect(stack.resolve(param.parameterType)).toEqual('String');
  expect(stack.resolve(param.stringValue)).toEqual({ Ref: 'MyParamNameParameter' });
  Template.fromStack(stack).templateMatches({
    Parameters: {
      MyParamNameParameter: {
        Type: 'AWS::SSM::Parameter::Value<String>',
        Default: 'MyParamName',
      },
    },
  });
});

test('StringParameter.fromStringParameterAttributes', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  const param = ssm.StringParameter.fromStringParameterAttributes(stack, 'MyParamName', {
    parameterName: 'MyParamName',
    version: 2,
  });

  // THEN
  expect(stack.resolve(param.parameterArn)).toEqual({
    'Fn::Join': ['', [
      'arn:',
      { Ref: 'AWS::Partition' },
      ':ssm:',
      { Ref: 'AWS::Region' },
      ':',
      { Ref: 'AWS::AccountId' },
      ':parameter/MyParamName',
    ]],
  });
  expect(stack.resolve(param.parameterName)).toEqual('MyParamName');
  expect(stack.resolve(param.parameterType)).toEqual('String');
  expect(stack.resolve(param.stringValue)).toEqual('{{resolve:ssm:MyParamName:2}}');
});

test('StringParameter.fromStringParameterAttributes with version from token', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  const param = ssm.StringParameter.fromStringParameterAttributes(stack, 'MyParamName', {
    parameterName: 'MyParamName',
    version: cdk.Token.asNumber({ Ref: 'version' }),
  });

  // THEN
  expect(stack.resolve(param.parameterArn)).toEqual({
    'Fn::Join': ['', [
      'arn:',
      { Ref: 'AWS::Partition' },
      ':ssm:',
      { Ref: 'AWS::Region' },
      ':',
      { Ref: 'AWS::AccountId' },
      ':parameter/MyParamName',
    ]],
  });
  expect(stack.resolve(param.parameterName)).toEqual('MyParamName');
  expect(stack.resolve(param.parameterType)).toEqual('String');
  expect(stack.resolve(param.stringValue)).toEqual({
    'Fn::Join': ['', [
      '{{resolve:ssm:MyParamName:',
      { Ref: 'version' },
      '}}',
    ]],
  });
});

test('StringParameter.fromSecureStringParameterAttributes', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  const param = ssm.StringParameter.fromSecureStringParameterAttributes(stack, 'MyParamName', {
    parameterName: 'MyParamName',
    version: 2,
  });

  // THEN
  expect(stack.resolve(param.parameterArn)).toEqual({
    'Fn::Join': ['', [
      'arn:',
      { Ref: 'AWS::Partition' },
      ':ssm:',
      { Ref: 'AWS::Region' },
      ':',
      { Ref: 'AWS::AccountId' },
      ':parameter/MyParamName',
    ]],
  });
  expect(stack.resolve(param.parameterName)).toEqual('MyParamName');
  expect(stack.resolve(param.parameterType)).toEqual('SecureString');
  expect(stack.resolve(param.stringValue)).toEqual('{{resolve:ssm-secure:MyParamName:2}}');
});

test('StringParameter.fromSecureStringParameterAttributes with version from token', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  const param = ssm.StringParameter.fromSecureStringParameterAttributes(stack, 'MyParamName', {
    parameterName: 'MyParamName',
    version: cdk.Token.asNumber({ Ref: 'version' }),
  });

  // THEN
  expect(stack.resolve(param.parameterArn)).toEqual({
    'Fn::Join': ['', [
      'arn:',
      { Ref: 'AWS::Partition' },
      ':ssm:',
      { Ref: 'AWS::Region' },
      ':',
      { Ref: 'AWS::AccountId' },
      ':parameter/MyParamName',
    ]],
  });
  expect(stack.resolve(param.parameterName)).toEqual('MyParamName');
  expect(stack.resolve(param.parameterType)).toEqual('SecureString');
  expect(stack.resolve(param.stringValue)).toEqual({
    'Fn::Join': ['', [
      '{{resolve:ssm-secure:MyParamName:',
      { Ref: 'version' },
      '}}',
    ]],
  });
});

test('StringParameter.fromSecureStringParameterAttributes with encryption key creates the correct policy for grantRead', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const key = kms.Key.fromKeyArn(stack, 'CustomKey', 'arn:aws:kms:us-east-1:123456789012:key/xyz');
  const role = new iam.Role(stack, 'Role', {
    assumedBy: new iam.AccountRootPrincipal(),
  });

  // WHEN
  const param = ssm.StringParameter.fromSecureStringParameterAttributes(stack, 'MyParamName', {
    parameterName: 'MyParamName',
    version: 2,
    encryptionKey: key,
  });
  param.grantRead(role);

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'kms:Decrypt',
          Effect: 'Allow',
          Resource: 'arn:aws:kms:us-east-1:123456789012:key/xyz',
        },
        {
          Action: [
            'ssm:DescribeParameters',
            'ssm:GetParameters',
            'ssm:GetParameter',
            'ssm:GetParameterHistory',
          ],
          Effect: 'Allow',
          Resource: {
            'Fn::Join': [
              '',
              [
                'arn:',
                {
                  Ref: 'AWS::Partition',
                },
                ':ssm:',
                {
                  Ref: 'AWS::Region',
                },
                ':',
                {
                  Ref: 'AWS::AccountId',
                },
                ':parameter/MyParamName',
              ],
            ],
          },
        },
      ],
      Version: '2012-10-17',
    },
  });
});

test('StringParameter.fromSecureStringParameterAttributes with encryption key creates the correct policy for grantWrite', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const key = kms.Key.fromKeyArn(stack, 'CustomKey', 'arn:aws:kms:us-east-1:123456789012:key/xyz');
  const role = new iam.Role(stack, 'Role', {
    assumedBy: new iam.AccountRootPrincipal(),
  });

  // WHEN
  const param = ssm.StringParameter.fromSecureStringParameterAttributes(stack, 'MyParamName', {
    parameterName: 'MyParamName',
    version: 2,
    encryptionKey: key,
  });
  param.grantWrite(role);

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: [
            'kms:Encrypt',
            'kms:ReEncrypt*',
            'kms:GenerateDataKey*',
          ],
          Effect: 'Allow',
          Resource: 'arn:aws:kms:us-east-1:123456789012:key/xyz',
        },
        {
          Action: 'ssm:PutParameter',
          Effect: 'Allow',
          Resource: {
            'Fn::Join': [
              '',
              [
                'arn:',
                {
                  Ref: 'AWS::Partition',
                },
                ':ssm:',
                {
                  Ref: 'AWS::Region',
                },
                ':',
                {
                  Ref: 'AWS::AccountId',
                },
                ':parameter/MyParamName',
              ],
            ],
          },
        },
      ],
      Version: '2012-10-17',
    },
  });
});

test('StringParameter.fromSecureStringParameterAttributes without version', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  const param = ssm.StringParameter.fromSecureStringParameterAttributes(stack, 'MyParamName', {
    parameterName: 'MyParamName',
  });

  // THEN
  expect(stack.resolve(param.stringValue)).toEqual('{{resolve:ssm-secure:MyParamName:}}');
});

test('StringListParameter.fromName', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  const param = ssm.StringListParameter.fromStringListParameterName(stack, 'MyParamName', 'MyParamName');

  // THEN
  expect(stack.resolve(param.parameterArn)).toEqual({
    'Fn::Join': ['', [
      'arn:',
      { Ref: 'AWS::Partition' },
      ':ssm:',
      { Ref: 'AWS::Region' },
      ':',
      { Ref: 'AWS::AccountId' },
      ':parameter/MyParamName',
    ]],
  });
  expect(stack.resolve(param.parameterName)).toEqual('MyParamName');
  expect(stack.resolve(param.parameterType)).toEqual('StringList');
  expect(stack.resolve(param.stringListValue)).toEqual({ 'Fn::Split': [',', '{{resolve:ssm:MyParamName}}'] });
});

test('fromLookup will use the SSM context provider to read value during synthesis', () => {
  // GIVEN
  const app = new cdk.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
  const stack = new cdk.Stack(app, 'my-staq', { env: { region: 'us-east-1', account: '12344' } });

  // WHEN
  const value = ssm.StringParameter.valueFromLookup(stack, 'my-param-name');

  // THEN
  expect(value).toEqual('dummy-value-for-my-param-name');
  expect(app.synth().manifest.missing).toEqual([
    {
      key: 'ssm:account=12344:parameterName=my-param-name:region=us-east-1',
      props: {
        account: '12344',
        region: 'us-east-1',
        parameterName: 'my-param-name',
      },
      provider: 'ssm',
    },
  ]);
});

describe('from string list parameter', () => {
  testDeprecated('valueForTypedStringParameter list type throws error', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // THEN
    expect(() => {
      ssm.StringParameter.valueForTypedStringParameter(stack, 'my-param-name', ParameterType.STRING_LIST);
    }).toThrow(/use valueForTypedListParameter instead/);
  });

  testDeprecated('fromStringParameterAttributes list type throws error', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // THEN
    expect(() => {
      ssm.StringParameter.fromStringParameterAttributes(stack, 'my-param-name', {
        parameterName: 'my-param-name',
        type: ParameterType.STRING_LIST,
      });
    }).toThrow(/fromStringParameterAttributes does not support StringList/);
  });

  testDeprecated('fromStringParameterAttributes returns correct value', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    ssm.StringParameter.fromStringParameterAttributes(stack, 'my-param-name', {
      parameterName: 'my-param-name',
      type: ParameterType.STRING,
    });

    // THEN
    Template.fromStack(stack).templateMatches({
      Parameters: {
        myparamnameParameter: {
          Type: 'AWS::SSM::Parameter::Value<String>',
          Default: 'my-param-name',
        },
      },
    });
  });

  test('fromStringParameterAttributes returns correct value with valueType', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    ssm.StringParameter.fromStringParameterAttributes(stack, 'my-param-name', {
      parameterName: 'my-param-name',
      valueType: ParameterValueType.STRING,
    });

    // THEN
    Template.fromStack(stack).templateMatches({
      Parameters: {
        myparamnameParameter: {
          Type: 'AWS::SSM::Parameter::Value<String>',
          Default: 'my-param-name',
        },
      },
    });
  });

  test('valueForTypedListParameter returns correct value', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    ssm.StringListParameter.valueForTypedListParameter(stack, 'my-param-name');

    // THEN
    Template.fromStack(stack).templateMatches({
      Parameters: {
        SsmParameterValuemyparamnameC96584B6F00A464EAD1953AFF4B05118Parameter: {
          Type: 'AWS::SSM::Parameter::Value<List<String>>',
          Default: 'my-param-name',
        },
      },
    });
  });

  test('valueForTypedListParameter returns correct value with type', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    ssm.StringListParameter.valueForTypedListParameter(stack, 'my-param-name', ParameterValueType.AWS_EC2_INSTANCE_ID);

    // THEN
    Template.fromStack(stack).templateMatches({
      Parameters: {
        SsmParameterValuemyparamnameC96584B6F00A464EAD1953AFF4B05118Parameter: {
          Type: 'AWS::SSM::Parameter::Value<List<AWS::EC2::Instance::Id>>',
          Default: 'my-param-name',
        },
      },
    });
  });

  test('fromStringListParameterAttributes returns correct value', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    ssm.StringListParameter.fromListParameterAttributes(stack, 'my-param-name', {
      parameterName: 'my-param-name',
    });

    // THEN
    Template.fromStack(stack).templateMatches({
      Parameters: {
        myparamnameParameter: {
          Type: 'AWS::SSM::Parameter::Value<List<String>>',
          Default: 'my-param-name',
        },
      },
    });
  });

  testDeprecated('string type returns correct value', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    ssm.StringParameter.valueForTypedStringParameter(stack, 'my-param-name', ParameterType.STRING);

    // THEN
    Template.fromStack(stack).templateMatches({
      Parameters: {
        SsmParameterValuemyparamnameC96584B6F00A464EAD1953AFF4B05118Parameter: {
          Type: 'AWS::SSM::Parameter::Value<String>',
          Default: 'my-param-name',
        },
      },
    });
  });

  test('string valueType returns correct value', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    ssm.StringParameter.valueForTypedStringParameterV2(stack, 'my-param-name', ParameterValueType.AWS_EC2_IMAGE_ID);

    // THEN
    Template.fromStack(stack).templateMatches({
      Parameters: {
        SsmParameterValuemyparamnameC96584B6F00A464EAD1953AFF4B05118Parameter: {
          Type: 'AWS::SSM::Parameter::Value<AWS::EC2::Image::Id>',
          Default: 'my-param-name',
        },
      },
    });
  });

});

describe('valueForStringParameter', () => {
  test('returns a token that represents the SSM parameter value', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const value = ssm.StringParameter.valueForStringParameter(stack, 'my-param-name');

    // THEN
    Template.fromStack(stack).templateMatches({
      Parameters: {
        SsmParameterValuemyparamnameC96584B6F00A464EAD1953AFF4B05118Parameter: {
          Type: 'AWS::SSM::Parameter::Value<String>',
          Default: 'my-param-name',
        },
      },
    });
    expect(stack.resolve(value)).toEqual({ Ref: 'SsmParameterValuemyparamnameC96584B6F00A464EAD1953AFF4B05118Parameter' });
  });

  test('de-dup based on parameter name', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    ssm.StringParameter.valueForStringParameter(stack, 'my-param-name');
    ssm.StringParameter.valueForStringParameter(stack, 'my-param-name');
    ssm.StringParameter.valueForStringParameter(stack, 'my-param-name-2');
    ssm.StringParameter.valueForStringParameter(stack, 'my-param-name');

    // THEN
    Template.fromStack(stack).templateMatches({
      Parameters: {
        SsmParameterValuemyparamnameC96584B6F00A464EAD1953AFF4B05118Parameter: {
          Type: 'AWS::SSM::Parameter::Value<String>',
          Default: 'my-param-name',
        },
        SsmParameterValuemyparamname2C96584B6F00A464EAD1953AFF4B05118Parameter: {
          Type: 'AWS::SSM::Parameter::Value<String>',
          Default: 'my-param-name-2',
        },
      },
    });
  });

  test('can query actual SSM Parameter Names, multiple times', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    ssm.StringParameter.valueForStringParameter(stack, '/my/param/name');
    ssm.StringParameter.valueForStringParameter(stack, '/my/param/name');
  });
});

test('rendering of parameter arns', () => {
  const stack = new cdk.Stack();
  const param = new cdk.CfnParameter(stack, 'param');
  const expectedA = { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':ssm:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':parameter/bam']] };
  const expectedB = { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':ssm:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':parameter/', { Ref: 'param' }]] };
  const expectedC = { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':ssm:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':parameter', { Ref: 'param' }]] };
  let i = 0;

  // WHEN
  const case1 = ssm.StringParameter.fromStringParameterName(stack, `p${i++}`, 'bam');
  const case2 = ssm.StringParameter.fromStringParameterName(stack, `p${i++}`, '/bam');
  const case4 = ssm.StringParameter.fromStringParameterAttributes(stack, `p${i++}`, { parameterName: 'bam' });
  const case5 = ssm.StringParameter.fromStringParameterAttributes(stack, `p${i++}`, { parameterName: '/bam' });
  const case6 = ssm.StringParameter.fromStringParameterAttributes(stack, `p${i++}`, { parameterName: param.valueAsString, simpleName: true });
  const case7 = ssm.StringParameter.fromSecureStringParameterAttributes(stack, `p${i++}`, { parameterName: 'bam', version: 10 });
  const case8 = ssm.StringParameter.fromSecureStringParameterAttributes(stack, `p${i++}`, { parameterName: '/bam', version: 10 });
  const case9 = ssm.StringParameter.fromSecureStringParameterAttributes(stack, `p${i++}`, { parameterName: param.valueAsString, version: 10, simpleName: false });

  // auto-generated name is always generated as a "simple name" (not/a/path)
  const case10 = new ssm.StringParameter(stack, `p${i++}`, { stringValue: 'value' });

  // explicitly named physical name gives us a hint on how to render the ARN
  const case11 = new ssm.StringParameter(stack, `p${i++}`, { parameterName: '/foo/bar', stringValue: 'hello' });
  const case12 = new ssm.StringParameter(stack, `p${i++}`, { parameterName: 'simple-name', stringValue: 'hello' });

  const case13 = new ssm.StringListParameter(stack, `p${i++}`, { stringListValue: ['hello', 'world'] });
  const case14 = new ssm.StringListParameter(stack, `p${i++}`, { parameterName: '/not/simple', stringListValue: ['hello', 'world'] });
  const case15 = new ssm.StringListParameter(stack, `p${i++}`, { parameterName: 'simple', stringListValue: ['hello', 'world'] });

  // THEN
  expect(stack.resolve(case1.parameterArn)).toEqual(expectedA);
  expect(stack.resolve(case2.parameterArn)).toEqual(expectedA);
  expect(stack.resolve(case4.parameterArn)).toEqual(expectedA);
  expect(stack.resolve(case5.parameterArn)).toEqual(expectedA);
  expect(stack.resolve(case6.parameterArn)).toEqual(expectedB);
  expect(stack.resolve(case7.parameterArn)).toEqual(expectedA);
  expect(stack.resolve(case8.parameterArn)).toEqual(expectedA);
  expect(stack.resolve(case9.parameterArn)).toEqual(expectedC);

  // new ssm.Parameters determine if "/" is needed based on the posture of `parameterName`.
  expect(stack.resolve(case10.parameterArn)).toEqual({ 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':ssm:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':parameter/', { Ref: 'p81BB0F6FE' }]] });
  expect(stack.resolve(case11.parameterArn)).toEqual({ 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':ssm:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':parameter', { Ref: 'p97A508212' }]] });
  expect(stack.resolve(case12.parameterArn)).toEqual({ 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':ssm:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':parameter/', { Ref: 'p107D6B8AB0' }]] });
  expect(stack.resolve(case13.parameterArn)).toEqual({ 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':ssm:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':parameter/', { Ref: 'p118A9CB02C' }]] });
  expect(stack.resolve(case14.parameterArn)).toEqual({ 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':ssm:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':parameter', { Ref: 'p129BE4CE91' }]] });
  expect(stack.resolve(case15.parameterArn)).toEqual({ 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':ssm:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':parameter/', { Ref: 'p1326A2AEC4' }]] });
});

test('if parameterName is a token separator must be specified', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const param = new cdk.CfnParameter(stack, 'param');
  let i = 0;

  // WHEN
  const p1 = new ssm.StringParameter(stack, `p${i++}`, { parameterName: param.valueAsString, stringValue: 'foo', simpleName: true });
  const p2 = new ssm.StringParameter(stack, `p${i++}`, { parameterName: param.valueAsString, stringValue: 'foo', simpleName: false });
  const p3 = new ssm.StringListParameter(stack, `p${i++}`, { parameterName: param.valueAsString, stringListValue: ['foo'], simpleName: false });

  // THEN
  expect(stack.resolve(p1.parameterArn)).toEqual({ 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':ssm:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':parameter/', { Ref: 'p0B02A8F65' }]] });
  expect(stack.resolve(p2.parameterArn)).toEqual({ 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':ssm:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':parameter', { Ref: 'p1E43AD5AC' }]] });
  expect(stack.resolve(p3.parameterArn)).toEqual({ 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':ssm:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':parameter', { Ref: 'p2C1903AEB' }]] });
});

test('fails if name is a token and no explicit separator', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const param = new cdk.CfnParameter(stack, 'param');
  let i = 0;

  // THEN
  const expected = /Unable to determine ARN separator for SSM parameter since the parameter name is an unresolved token. Use "fromAttributes" and specify "simpleName" explicitly/;
  expect(() => ssm.StringParameter.fromStringParameterName(stack, `p${i++}`, param.valueAsString)).toThrow(expected);
  expect(() => ssm.StringParameter.fromSecureStringParameterAttributes(stack, `p${i++}`, { parameterName: param.valueAsString, version: 1 })).toThrow(expected);
  expect(() => new ssm.StringParameter(stack, `p${i++}`, { parameterName: param.valueAsString, stringValue: 'foo' })).toThrow(expected);
  expect(() => new ssm.StringParameter(stack, `p${i++}`, { parameterName: param.valueAsString, stringValue: 'foo' })).toThrow(expected);
});

test('fails if simpleName is wrong based on a concrete physical name', () => {
  // GIVEN
  const stack = new cdk.Stack();
  let i = 0;

  // THEN
  expect(() => ssm.StringParameter.fromStringParameterAttributes(stack, `p${i++}`, { parameterName: 'simple', simpleName: false })).toThrow(/Parameter name "simple" is a simple name, but "simpleName" was explicitly set to false. Either omit it or set it to true/);
  expect(() => ssm.StringParameter.fromStringParameterAttributes(stack, `p${i++}`, { parameterName: '/foo/bar', simpleName: true })).toThrow(/Parameter name "\/foo\/bar" is not a simple name, but "simpleName" was explicitly set to true. Either omit it or set it to false/);
});

test('fails if parameterName is undefined and simpleName is "false"', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // THEN
  expect(() => new ssm.StringParameter(stack, 'p', { simpleName: false, stringValue: 'foo' })).toThrow(/If "parameterName" is not explicitly defined, "simpleName" must be "true" or undefined since auto-generated parameter names always have simple names/);
});
