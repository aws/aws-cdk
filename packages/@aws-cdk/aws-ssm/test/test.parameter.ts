/* eslint-disable max-len */

import { expect, haveResource } from '@aws-cdk/assert-internal';
import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as ssm from '../lib';

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

  'expect String SSM Parameter to have tier properly set'(test: Test) {
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
    expect(stack).to(haveResource('AWS::SSM::Parameter', {
      Tier: 'Advanced',
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
        stringValue: cdk.Lazy.string({ produce: () => 'Foo!' }),
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

  'String SSM Parameter throws on long descriptions'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // THEN
    test.throws(() => {
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
    }, /Description cannot be longer than 1024 characters./);

    test.done();
  },

  'String SSM Parameter throws on long names'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // THEN
    test.throws(() => {
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
    }, /Name cannot be longer than 2048 characters./);

    test.done();
  },

  'StringList SSM Parameter throws on long descriptions'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // THEN
    test.throws(() => {
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
    }, /Description cannot be longer than 1024 characters./);

    test.done();
  },

  'StringList SSM Parameter throws on long names'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // THEN
    test.throws(() => {
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
    }, /Name cannot be longer than 2048 characters./);

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
      stringListValue: ['Foo', cdk.Lazy.string({ produce: () => 'Baz!' })],
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
        ':parameter/',
        { Ref: 'Parameter9E1B4FBA' },
      ]],
    });
    test.done();
  },

  'parameterName that includes a "/" must be fully qualified (i.e. begin with "/") as well'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // THEN
    test.throws(() => new ssm.StringParameter(stack, 'myParam', {
      stringValue: 'myValue',
      parameterName: 'path/to/parameter',
    }), /Parameter names must be fully qualified/);

    test.throws(() => new ssm.StringListParameter(stack, 'myParam2', {
      stringListValue: ['foo', 'bar'],
      parameterName: 'path/to/parameter2',
    }), /Parameter names must be fully qualified \(if they include \"\/\" they must also begin with a \"\/\"\)\: path\/to\/parameter2/);

    test.done();
  },

  'StringParameter.fromStringParameterName'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const param = ssm.StringParameter.fromStringParameterName(stack, 'MyParamName', 'MyParamName');

    // THEN
    test.deepEqual(stack.resolve(param.parameterArn), {
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
    test.deepEqual(stack.resolve(param.parameterName), 'MyParamName');
    test.deepEqual(stack.resolve(param.parameterType), 'String');
    test.deepEqual(stack.resolve(param.stringValue), { Ref: 'MyParamNameParameter' });
    expect(stack).toMatch({
      Parameters: {
        MyParamNameParameter: {
          Type: 'AWS::SSM::Parameter::Value<String>',
          Default: 'MyParamName',
        },
      },
    });
    test.done();
  },

  'StringParameter.fromStringParameterAttributes'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const param = ssm.StringParameter.fromStringParameterAttributes(stack, 'MyParamName', {
      parameterName: 'MyParamName',
      version: 2,
    });

    // THEN
    test.deepEqual(stack.resolve(param.parameterArn), {
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
    test.deepEqual(stack.resolve(param.parameterName), 'MyParamName');
    test.deepEqual(stack.resolve(param.parameterType), 'String');
    test.deepEqual(stack.resolve(param.stringValue), '{{resolve:ssm:MyParamName:2}}');
    test.done();
  },

  'StringParameter.fromSecureStringParameterAttributes'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const param = ssm.StringParameter.fromSecureStringParameterAttributes(stack, 'MyParamName', {
      parameterName: 'MyParamName',
      version: 2,
    });

    // THEN
    test.deepEqual(stack.resolve(param.parameterArn), {
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
    test.deepEqual(stack.resolve(param.parameterName), 'MyParamName');
    test.deepEqual(stack.resolve(param.parameterType), 'SecureString');
    test.deepEqual(stack.resolve(param.stringValue), '{{resolve:ssm-secure:MyParamName:2}}');
    test.done();
  },

  'StringParameter.fromSecureStringParameterAttributes with encryption key creates the correct policy for grantRead'(test: Test) {
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
    expect(stack).to(haveResource('AWS::IAM::Policy', {
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
    }));

    test.done();
  },

  'StringParameter.fromSecureStringParameterAttributes with encryption key creates the correct policy for grantWrite'(test: Test) {
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
    expect(stack).to(haveResource('AWS::IAM::Policy', {
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
    }));

    test.done();
  },

  'StringListParameter.fromName'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const param = ssm.StringListParameter.fromStringListParameterName(stack, 'MyParamName', 'MyParamName');

    // THEN
    test.deepEqual(stack.resolve(param.parameterArn), {
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
    test.deepEqual(stack.resolve(param.parameterName), 'MyParamName');
    test.deepEqual(stack.resolve(param.parameterType), 'StringList');
    test.deepEqual(stack.resolve(param.stringListValue), { 'Fn::Split': [',', '{{resolve:ssm:MyParamName}}'] });
    test.done();
  },

  'fromLookup will use the SSM context provider to read value during synthesis'(test: Test) {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'my-staq', { env: { region: 'us-east-1', account: '12344' } });

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
          parameterName: 'my-param-name',
        },
        provider: 'ssm',
      },
    ]);
    test.done();
  },

  valueForStringParameter: {

    'returns a token that represents the SSM parameter value'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      const value = ssm.StringParameter.valueForStringParameter(stack, 'my-param-name');

      // THEN
      expect(stack).toMatch({
        Parameters: {
          SsmParameterValuemyparamnameC96584B6F00A464EAD1953AFF4B05118Parameter: {
            Type: 'AWS::SSM::Parameter::Value<String>',
            Default: 'my-param-name',
          },
        },
      });
      test.deepEqual(stack.resolve(value), { Ref: 'SsmParameterValuemyparamnameC96584B6F00A464EAD1953AFF4B05118Parameter' });
      test.done();
    },

    'de-dup based on parameter name'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      ssm.StringParameter.valueForStringParameter(stack, 'my-param-name');
      ssm.StringParameter.valueForStringParameter(stack, 'my-param-name');
      ssm.StringParameter.valueForStringParameter(stack, 'my-param-name-2');
      ssm.StringParameter.valueForStringParameter(stack, 'my-param-name');

      // THEN
      expect(stack).toMatch({
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
      test.done();
    },

    'can query actual SSM Parameter Names, multiple times'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      ssm.StringParameter.valueForStringParameter(stack, '/my/param/name');
      ssm.StringParameter.valueForStringParameter(stack, '/my/param/name');

      test.done();
    },
  },

  'rendering of parameter arns'(test: Test) {
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
    test.deepEqual(stack.resolve(case1.parameterArn), expectedA);
    test.deepEqual(stack.resolve(case2.parameterArn), expectedA);
    test.deepEqual(stack.resolve(case4.parameterArn), expectedA);
    test.deepEqual(stack.resolve(case5.parameterArn), expectedA);
    test.deepEqual(stack.resolve(case6.parameterArn), expectedB);
    test.deepEqual(stack.resolve(case7.parameterArn), expectedA);
    test.deepEqual(stack.resolve(case8.parameterArn), expectedA);
    test.deepEqual(stack.resolve(case9.parameterArn), expectedC);

    // new ssm.Parameters determine if "/" is needed based on the posture of `parameterName`.
    test.deepEqual(stack.resolve(case10.parameterArn), { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':ssm:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':parameter/', { Ref: 'p81BB0F6FE' }]] });
    test.deepEqual(stack.resolve(case11.parameterArn), { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':ssm:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':parameter', { Ref: 'p97A508212' }]] });
    test.deepEqual(stack.resolve(case12.parameterArn), { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':ssm:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':parameter/', { Ref: 'p107D6B8AB0' }]] });
    test.deepEqual(stack.resolve(case13.parameterArn), { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':ssm:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':parameter/', { Ref: 'p118A9CB02C' }]] });
    test.deepEqual(stack.resolve(case14.parameterArn), { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':ssm:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':parameter', { Ref: 'p129BE4CE91' }]] });
    test.deepEqual(stack.resolve(case15.parameterArn), { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':ssm:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':parameter/', { Ref: 'p1326A2AEC4' }]] });

    test.done();
  },

  'if parameterName is a token separator must be specified'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const param = new cdk.CfnParameter(stack, 'param');
    let i = 0;

    // WHEN
    const p1 = new ssm.StringParameter(stack, `p${i++}`, { parameterName: param.valueAsString, stringValue: 'foo', simpleName: true });
    const p2 = new ssm.StringParameter(stack, `p${i++}`, { parameterName: param.valueAsString, stringValue: 'foo', simpleName: false });
    const p3 = new ssm.StringListParameter(stack, `p${i++}`, { parameterName: param.valueAsString, stringListValue: ['foo'], simpleName: false });

    // THEN
    test.deepEqual(stack.resolve(p1.parameterArn), { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':ssm:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':parameter/', { Ref: 'p0B02A8F65' }]] });
    test.deepEqual(stack.resolve(p2.parameterArn), { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':ssm:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':parameter', { Ref: 'p1E43AD5AC' }]] });
    test.deepEqual(stack.resolve(p3.parameterArn), { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':ssm:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':parameter', { Ref: 'p2C1903AEB' }]] });

    test.done();
  },

  'fails if name is a token and no explicit separator'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const param = new cdk.CfnParameter(stack, 'param');
    let i = 0;

    // THEN
    const expected = /Unable to determine ARN separator for SSM parameter since the parameter name is an unresolved token. Use "fromAttributes" and specify "simpleName" explicitly/;
    test.throws(() => ssm.StringParameter.fromStringParameterName(stack, `p${i++}`, param.valueAsString), expected);
    test.throws(() => ssm.StringParameter.fromSecureStringParameterAttributes(stack, `p${i++}`, { parameterName: param.valueAsString, version: 1 }), expected);
    test.throws(() => new ssm.StringParameter(stack, `p${i++}`, { parameterName: param.valueAsString, stringValue: 'foo' }), expected);
    test.throws(() => new ssm.StringParameter(stack, `p${i++}`, { parameterName: param.valueAsString, stringValue: 'foo' }), expected);
    test.done();
  },

  'fails if simpleName is wrong based on a concrete physical name'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    let i = 0;

    // THEN
    test.throws(() => ssm.StringParameter.fromStringParameterAttributes(stack, `p${i++}`, { parameterName: 'simple', simpleName: false }), /Parameter name "simple" is a simple name, but "simpleName" was explicitly set to false. Either omit it or set it to true/);
    test.throws(() => ssm.StringParameter.fromStringParameterAttributes(stack, `p${i++}`, { parameterName: '/foo/bar', simpleName: true }), /Parameter name "\/foo\/bar" is not a simple name, but "simpleName" was explicitly set to true. Either omit it or set it to false/);
    test.done();
  },

  'fails if parameterName is undefined and simpleName is "false"'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // THEN
    test.throws(() => new ssm.StringParameter(stack, 'p', { simpleName: false, stringValue: 'foo' }), /If "parameterName" is not explicitly defined, "simpleName" must be "true" or undefined since auto-generated parameter names always have simple names/);
    test.done();
  },
};
