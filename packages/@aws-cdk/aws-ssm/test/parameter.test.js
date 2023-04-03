"use strict";
/* eslint-disable max-len */
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const iam = require("@aws-cdk/aws-iam");
const kms = require("@aws-cdk/aws-kms");
const cdk_build_tools_1 = require("@aws-cdk/cdk-build-tools");
const cdk = require("@aws-cdk/core");
const cxapi = require("@aws-cdk/cx-api");
const ssm = require("../lib");
const lib_1 = require("../lib");
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
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SSM::Parameter', {
        AllowedPattern: '.*',
        Description: 'The value Foo',
        Name: 'FooParameter',
        Type: 'String',
        Value: 'Foo',
    });
});
(0, cdk_build_tools_1.testDeprecated)('type cannot be specified as AWS_EC2_IMAGE_ID', () => {
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
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SSM::Parameter', {
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
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SSM::Parameter', {
        Tier: 'Advanced',
    });
});
test('String SSM Parameter rejects invalid values', () => {
    // GIVEN
    const stack = new cdk.Stack();
    // THEN
    expect(() => new ssm.StringParameter(stack, 'Parameter', { allowedPattern: '^Bar$', stringValue: 'FooBar' })).toThrow(/does not match the specified allowedPattern/);
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
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SSM::Parameter', {
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
    expect(() => new ssm.StringListParameter(stack, 'Parameter', { stringListValue: ['Foo,Bar'] })).toThrow(/cannot contain the ',' character/);
});
test('StringList SSM Parameter rejects invalid values', () => {
    // GIVEN
    const stack = new cdk.Stack();
    // THEN
    expect(() => new ssm.StringListParameter(stack, 'Parameter', { allowedPattern: '^(Foo|Bar)$', stringListValue: ['Foo', 'FooBar'] })).toThrow(/does not match the specified allowedPattern/);
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
    assertions_1.Template.fromStack(stack).templateMatches({
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
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
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
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
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
    expect(stack.resolve(param.stringValue)).toEqual('{{resolve:ssm-secure:MyParamName}}');
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
    (0, cdk_build_tools_1.testDeprecated)('valueForTypedStringParameter list type throws error', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // THEN
        expect(() => {
            ssm.StringParameter.valueForTypedStringParameter(stack, 'my-param-name', lib_1.ParameterType.STRING_LIST);
        }).toThrow(/use valueForTypedListParameter instead/);
    });
    (0, cdk_build_tools_1.testDeprecated)('fromStringParameterAttributes list type throws error', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // THEN
        expect(() => {
            ssm.StringParameter.fromStringParameterAttributes(stack, 'my-param-name', {
                parameterName: 'my-param-name',
                type: lib_1.ParameterType.STRING_LIST,
            });
        }).toThrow(/fromStringParameterAttributes does not support StringList/);
    });
    (0, cdk_build_tools_1.testDeprecated)('fromStringParameterAttributes returns correct value', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        ssm.StringParameter.fromStringParameterAttributes(stack, 'my-param-name', {
            parameterName: 'my-param-name',
            type: lib_1.ParameterType.STRING,
        });
        // THEN
        assertions_1.Template.fromStack(stack).templateMatches({
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
            valueType: lib_1.ParameterValueType.STRING,
        });
        // THEN
        assertions_1.Template.fromStack(stack).templateMatches({
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
        assertions_1.Template.fromStack(stack).templateMatches({
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
        ssm.StringListParameter.valueForTypedListParameter(stack, 'my-param-name', lib_1.ParameterValueType.AWS_EC2_INSTANCE_ID);
        // THEN
        assertions_1.Template.fromStack(stack).templateMatches({
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
        assertions_1.Template.fromStack(stack).templateMatches({
            Parameters: {
                myparamnameParameter: {
                    Type: 'AWS::SSM::Parameter::Value<List<String>>',
                    Default: 'my-param-name',
                },
            },
        });
    });
    (0, cdk_build_tools_1.testDeprecated)('string type returns correct value', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        ssm.StringParameter.valueForTypedStringParameter(stack, 'my-param-name', lib_1.ParameterType.STRING);
        // THEN
        assertions_1.Template.fromStack(stack).templateMatches({
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
        ssm.StringParameter.valueForTypedStringParameterV2(stack, 'my-param-name', lib_1.ParameterValueType.AWS_EC2_IMAGE_ID);
        // THEN
        assertions_1.Template.fromStack(stack).templateMatches({
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
        assertions_1.Template.fromStack(stack).templateMatches({
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
        assertions_1.Template.fromStack(stack).templateMatches({
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyYW1ldGVyLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwYXJhbWV0ZXIudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsNEJBQTRCOztBQUU1QixvREFBK0M7QUFDL0Msd0NBQXdDO0FBQ3hDLHdDQUF3QztBQUN4Qyw4REFBMEQ7QUFDMUQscUNBQXFDO0FBQ3JDLHlDQUF5QztBQUN6Qyw4QkFBOEI7QUFDOUIsZ0NBQTJEO0FBRTNELElBQUksQ0FBQyxpQ0FBaUMsRUFBRSxHQUFHLEVBQUU7SUFDM0MsUUFBUTtJQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBRTlCLE9BQU87SUFDUCxJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRTtRQUMxQyxjQUFjLEVBQUUsSUFBSTtRQUNwQixXQUFXLEVBQUUsZUFBZTtRQUM1QixhQUFhLEVBQUUsY0FBYztRQUM3QixXQUFXLEVBQUUsS0FBSztLQUNuQixDQUFDLENBQUM7SUFFSCxPQUFPO0lBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMscUJBQXFCLEVBQUU7UUFDckUsY0FBYyxFQUFFLElBQUk7UUFDcEIsV0FBVyxFQUFFLGVBQWU7UUFDNUIsSUFBSSxFQUFFLGNBQWM7UUFDcEIsSUFBSSxFQUFFLFFBQVE7UUFDZCxLQUFLLEVBQUUsS0FBSztLQUNiLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBQSxnQ0FBYyxFQUFDLDhDQUE4QyxFQUFFLEdBQUcsRUFBRTtJQUNsRSxRQUFRO0lBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7SUFFOUIsT0FBTztJQUNQLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRTtRQUNyRCxX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RUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsMEhBQTBILENBQUMsQ0FBQztJQUN0USxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyw2QkFBNkIsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsYUFBYSxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxrSUFBa0ksQ0FBQyxDQUFDO0FBQ2pSLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLCtEQUErRCxFQUFFLEdBQUcsRUFBRTtJQUN6RSxRQUFRO0lBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7SUFFOUIsT0FBTztJQUNQLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsc0pBQXNKLENBQUMsQ0FBQztBQUMvUCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIG1heC1sZW4gKi9cblxuaW1wb3J0IHsgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGttcyBmcm9tICdAYXdzLWNkay9hd3Mta21zJztcbmltcG9ydCB7IHRlc3REZXByZWNhdGVkIH0gZnJvbSAnQGF3cy1jZGsvY2RrLWJ1aWxkLXRvb2xzJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGN4YXBpIGZyb20gJ0Bhd3MtY2RrL2N4LWFwaSc7XG5pbXBvcnQgKiBhcyBzc20gZnJvbSAnLi4vbGliJztcbmltcG9ydCB7IFBhcmFtZXRlclR5cGUsIFBhcmFtZXRlclZhbHVlVHlwZSB9IGZyb20gJy4uL2xpYic7XG5cbnRlc3QoJ2NyZWF0aW5nIGEgU3RyaW5nIFNTTSBQYXJhbWV0ZXInLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gIC8vIFdIRU5cbiAgbmV3IHNzbS5TdHJpbmdQYXJhbWV0ZXIoc3RhY2ssICdQYXJhbWV0ZXInLCB7XG4gICAgYWxsb3dlZFBhdHRlcm46ICcuKicsXG4gICAgZGVzY3JpcHRpb246ICdUaGUgdmFsdWUgRm9vJyxcbiAgICBwYXJhbWV0ZXJOYW1lOiAnRm9vUGFyYW1ldGVyJyxcbiAgICBzdHJpbmdWYWx1ZTogJ0ZvbycsXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6U1NNOjpQYXJhbWV0ZXInLCB7XG4gICAgQWxsb3dlZFBhdHRlcm46ICcuKicsXG4gICAgRGVzY3JpcHRpb246ICdUaGUgdmFsdWUgRm9vJyxcbiAgICBOYW1lOiAnRm9vUGFyYW1ldGVyJyxcbiAgICBUeXBlOiAnU3RyaW5nJyxcbiAgICBWYWx1ZTogJ0ZvbycsXG4gIH0pO1xufSk7XG5cbnRlc3REZXByZWNhdGVkKCd0eXBlIGNhbm5vdCBiZSBzcGVjaWZpZWQgYXMgQVdTX0VDMl9JTUFHRV9JRCcsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgLy8gVEhFTlxuICBleHBlY3QoKCkgPT4gbmV3IHNzbS5TdHJpbmdQYXJhbWV0ZXIoc3RhY2ssICdteVBhcmFtJywge1xuICAgIHN0cmluZ1ZhbHVlOiAnbXlWYWx1ZScsXG4gICAgdHlwZTogc3NtLlBhcmFtZXRlclR5cGUuQVdTX0VDMl9JTUFHRV9JRCxcbiAgfSkpLnRvVGhyb3coJ1RoZSB0eXBlIG11c3QgZWl0aGVyIGJlIFBhcmFtZXRlclR5cGUuU1RSSU5HIG9yIFBhcmFtZXRlclR5cGUuU1RSSU5HX0xJU1QuIERpZCB5b3UgbWVhbiB0byBzZXQgZGF0YVR5cGU6IFBhcmFtZXRlckRhdGFUeXBlLkFXU19FQzJfSU1BR0UgaW5zdGVhZD8nKTtcbn0pO1xuXG50ZXN0KCdkYXRhVHlwZSBjYW4gYmUgc3BlY2lmaWVkJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAvLyBXSEVOXG4gIG5ldyBzc20uU3RyaW5nUGFyYW1ldGVyKHN0YWNrLCAnbXlQYXJhbScsIHtcbiAgICBzdHJpbmdWYWx1ZTogJ215VmFsdWUnLFxuICAgIGRhdGFUeXBlOiBzc20uUGFyYW1ldGVyRGF0YVR5cGUuQVdTX0VDMl9JTUFHRSxcbiAgfSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTU006OlBhcmFtZXRlcicsIHtcbiAgICBWYWx1ZTogJ215VmFsdWUnLFxuICAgIERhdGFUeXBlOiAnYXdzOmVjMjppbWFnZScsXG4gIH0pO1xufSk7XG5cbnRlc3QoJ2V4cGVjdCBTdHJpbmcgU1NNIFBhcmFtZXRlciB0byBoYXZlIHRpZXIgcHJvcGVybHkgc2V0JywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAvLyBXSEVOXG4gIG5ldyBzc20uU3RyaW5nUGFyYW1ldGVyKHN0YWNrLCAnUGFyYW1ldGVyJywge1xuICAgIGFsbG93ZWRQYXR0ZXJuOiAnLionLFxuICAgIGRlc2NyaXB0aW9uOiAnVGhlIHZhbHVlIEZvbycsXG4gICAgcGFyYW1ldGVyTmFtZTogJ0Zvb1BhcmFtZXRlcicsXG4gICAgc3RyaW5nVmFsdWU6ICdGb28nLFxuICAgIHRpZXI6IHNzbS5QYXJhbWV0ZXJUaWVyLkFEVkFOQ0VELFxuICB9KTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlNTTTo6UGFyYW1ldGVyJywge1xuICAgIFRpZXI6ICdBZHZhbmNlZCcsXG4gIH0pO1xufSk7XG5cbnRlc3QoJ1N0cmluZyBTU00gUGFyYW1ldGVyIHJlamVjdHMgaW52YWxpZCB2YWx1ZXMnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gIC8vIFRIRU5cbiAgZXhwZWN0KCgpID0+IG5ldyBzc20uU3RyaW5nUGFyYW1ldGVyKHN0YWNrLCAnUGFyYW1ldGVyJywgeyBhbGxvd2VkUGF0dGVybjogJ15CYXIkJywgc3RyaW5nVmFsdWU6ICdGb29CYXInIH0pKS50b1Rocm93KFxuICAgIC9kb2VzIG5vdCBtYXRjaCB0aGUgc3BlY2lmaWVkIGFsbG93ZWRQYXR0ZXJuLyk7XG59KTtcblxudGVzdCgnU3RyaW5nIFNTTSBQYXJhbWV0ZXIgYWxsb3dzIHVucmVzb2x2ZWQgdG9rZW5zJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAvLyBUSEVOXG4gIGV4cGVjdCgoKSA9PiB7XG4gICAgbmV3IHNzbS5TdHJpbmdQYXJhbWV0ZXIoc3RhY2ssICdQYXJhbWV0ZXInLCB7XG4gICAgICBhbGxvd2VkUGF0dGVybjogJ15CYXIkJyxcbiAgICAgIHN0cmluZ1ZhbHVlOiBjZGsuTGF6eS5zdHJpbmcoeyBwcm9kdWNlOiAoKSA9PiAnRm9vIScgfSksXG4gICAgfSk7XG4gIH0pLm5vdC50b1Rocm93KCk7XG59KTtcblxudGVzdCgnY3JlYXRpbmcgYSBTdHJpbmdMaXN0IFNTTSBQYXJhbWV0ZXInLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gIC8vIFdIRU5cbiAgbmV3IHNzbS5TdHJpbmdMaXN0UGFyYW1ldGVyKHN0YWNrLCAnUGFyYW1ldGVyJywge1xuICAgIGFsbG93ZWRQYXR0ZXJuOiAnKEZvb3xCYXIpJyxcbiAgICBkZXNjcmlwdGlvbjogJ1RoZSB2YWx1ZXMgRm9vIGFuZCBCYXInLFxuICAgIHBhcmFtZXRlck5hbWU6ICdGb29QYXJhbWV0ZXInLFxuICAgIHN0cmluZ0xpc3RWYWx1ZTogWydGb28nLCAnQmFyJ10sXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6U1NNOjpQYXJhbWV0ZXInLCB7XG4gICAgQWxsb3dlZFBhdHRlcm46ICcoRm9vfEJhciknLFxuICAgIERlc2NyaXB0aW9uOiAnVGhlIHZhbHVlcyBGb28gYW5kIEJhcicsXG4gICAgTmFtZTogJ0Zvb1BhcmFtZXRlcicsXG4gICAgVHlwZTogJ1N0cmluZ0xpc3QnLFxuICAgIFZhbHVlOiAnRm9vLEJhcicsXG4gIH0pO1xufSk7XG5cbnRlc3QoJ1N0cmluZyBTU00gUGFyYW1ldGVyIHRocm93cyBvbiBsb25nIGRlc2NyaXB0aW9ucycsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgLy8gVEhFTlxuICBleHBlY3QoKCkgPT4ge1xuICAgIG5ldyBzc20uU3RyaW5nUGFyYW1ldGVyKHN0YWNrLCAnUGFyYW1ldGVyJywge1xuICAgICAgc3RyaW5nVmFsdWU6ICdGb28nLFxuICAgICAgZGVzY3JpcHRpb246ICcxMDI0KyBjaGFyYWN0ZXIgbG9uZyBkZXNjcmlwdGlvbjogTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVlciBhZGlwaXNjaW5nIGVsaXQuIFxcXG4gICAgICBBZW5lYW4gY29tbW9kbyBsaWd1bGEgZWdldCBkb2xvci4gQWVuZWFuIG1hc3NhLiBDdW0gc29jaWlzIG5hdG9xdWUgcGVuYXRpYnVzIGV0IG1hZ25pcyBkaXMgcGFydHVyaWVudCBtb250ZXMsIFxcXG4gICAgICBuYXNjZXR1ciByaWRpY3VsdXMgbXVzLiBEb25lYyBxdWFtIGZlbGlzLCB1bHRyaWNpZXMgbmVjLCBwZWxsZW50ZXNxdWUgZXUsIHByZXRpdW0gcXVpcywgc2VtLiBOdWxsYSBjb25zZXF1YXQgXFxcbiAgICAgIG1hc3NhIHF1aXMgZW5pbS4gRG9uZWMgcGVkZSBqdXN0bywgZnJpbmdpbGxhIHZlbCwgYWxpcXVldCBuZWMsIHZ1bHB1dGF0ZSBlZ2V0LCBhcmN1LiBJbiBlbmltIGp1c3RvLCByaG9uY3VzIHV0LCBcXFxuICAgICAgaW1wZXJkaWV0IGEsIHZlbmVuYXRpcyB2aXRhZSwganVzdG8uIE51bGxhbSBkaWN0dW0gZmVsaXMgZXUgcGVkZSBtb2xsaXMgcHJldGl1bS4gSW50ZWdlciB0aW5jaWR1bnQuIENyYXMgZGFwaWJ1cy4gXFxcbiAgICAgIFZpdmFtdXMgZWxlbWVudHVtIHNlbXBlciBuaXNpLiBBZW5lYW4gdnVscHV0YXRlIGVsZWlmZW5kIHRlbGx1cy4gQWVuZWFuIGxlbyBsaWd1bGEsIHBvcnR0aXRvciBldSwgY29uc2VxdWF0IHZpdGFlLCBcXFxuICAgICAgZWxlaWZlbmQgYWMsIGVuaW0uIEFsaXF1YW0gbG9yZW0gYW50ZSwgZGFwaWJ1cyBpbiwgdml2ZXJyYSBxdWlzLCBmZXVnaWF0IGEsIHRlbGx1cy4gUGhhc2VsbHVzIHZpdmVycmEgbnVsbGEgdXQgbWV0dXMgXFxcbiAgICAgIHZhcml1cyBsYW9yZWV0LiBRdWlzcXVlIHJ1dHJ1bS4gQWVuZWFuIGltcGVyZGlldC4gRXRpYW0gdWx0cmljaWVzIG5pc2kgdmVsIGF1Z3VlLiBDdXJhYml0dXIgdWxsYW1jb3JwZXIgdWx0cmljaWVzIG5pc2kuIFxcXG4gICAgICBOYW0gZWdldCBkdWkuIEV0aWFtIHJob25jdXMuIE1hZWNlbmFzIHRlbXB1cywgdGVsbHVzIGVnZXQgY29uZGltZW50dW0gcmhvbmN1cywgc2VtIHF1YW0gc2VtcGVyIGxpYmVybywgc2l0IGFtZXQgYWRpcGlzY2luZyBcXFxuICAgICAgc2VtIG5lcXVlIHNlZCBpcHN1bS4nLFxuICAgIH0pO1xuICB9KS50b1Rocm93KC9EZXNjcmlwdGlvbiBjYW5ub3QgYmUgbG9uZ2VyIHRoYW4gMTAyNCBjaGFyYWN0ZXJzLi8pO1xufSk7XG5cbnRlc3QoJ1N0cmluZyBTU00gUGFyYW1ldGVyIHRocm93cyBvbiBsb25nIG5hbWVzJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAvLyBUSEVOXG4gIGV4cGVjdCgoKSA9PiB7XG4gICAgbmV3IHNzbS5TdHJpbmdQYXJhbWV0ZXIoc3RhY2ssICdQYXJhbWV0ZXInLCB7XG4gICAgICBzdHJpbmdWYWx1ZTogJ0ZvbycsXG4gICAgICBwYXJhbWV0ZXJOYW1lOiAnMjA0OCsgY2hhcmFjdGVyIGxvbmcgbmFtZTogTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVlciBhZGlwaXNjaW5nIGVsaXQuIFxcXG4gICAgICBBZW5lYW4gY29tbW9kbyBsaWd1bGEgZWdldCBkb2xvci4gQWVuZWFuIG1hc3NhLiBDdW0gc29jaWlzIG5hdG9xdWUgcGVuYXRpYnVzIGV0IG1hZ25pcyBkaXMgcGFydHVyaWVudCBtb250ZXMsIFxcXG4gICAgICBuYXNjZXR1ciByaWRpY3VsdXMgbXVzLiBEb25lYyBxdWFtIGZlbGlzLCB1bHRyaWNpZXMgbmVjLCBwZWxsZW50ZXNxdWUgZXUsIHByZXRpdW0gcXVpcywgc2VtLiBOdWxsYSBjb25zZXF1YXQgXFxcbiAgICAgIG1hc3NhIHF1aXMgZW5pbS4gRG9uZWMgcGVkZSBqdXN0bywgZnJpbmdpbGxhIHZlbCwgYWxpcXVldCBuZWMsIHZ1bHB1dGF0ZSBlZ2V0LCBhcmN1LiBJbiBlbmltIGp1c3RvLCByaG9uY3VzIHV0LCBcXFxuICAgICAgaW1wZXJkaWV0IGEsIHZlbmVuYXRpcyB2aXRhZSwganVzdG8uIE51bGxhbSBkaWN0dW0gZmVsaXMgZXUgcGVkZSBtb2xsaXMgcHJldGl1bS4gSW50ZWdlciB0aW5jaWR1bnQuIENyYXMgZGFwaWJ1cy4gXFxcbiAgICAgIFZpdmFtdXMgZWxlbWVudHVtIHNlbXBlciBuaXNpLiBBZW5lYW4gdnVscHV0YXRlIGVsZWlmZW5kIHRlbGx1cy4gQWVuZWFuIGxlbyBsaWd1bGEsIHBvcnR0aXRvciBldSwgY29uc2VxdWF0IHZpdGFlLCBcXFxuICAgICAgZWxlaWZlbmQgYWMsIGVuaW0uIEFsaXF1YW0gbG9yZW0gYW50ZSwgZGFwaWJ1cyBpbiwgdml2ZXJyYSBxdWlzLCBmZXVnaWF0IGEsIHRlbGx1cy4gUGhhc2VsbHVzIHZpdmVycmEgbnVsbGEgdXQgbWV0dXMgXFxcbiAgICAgIHZhcml1cyBsYW9yZWV0LiBRdWlzcXVlIHJ1dHJ1bS4gQWVuZWFuIGltcGVyZGlldC4gRXRpYW0gdWx0cmljaWVzIG5pc2kgdmVsIGF1Z3VlLiBDdXJhYml0dXIgdWxsYW1jb3JwZXIgdWx0cmljaWVzIG5pc2kuIFxcXG4gICAgICBOYW0gZWdldCBkdWkuIEV0aWFtIHJob25jdXMuIE1hZWNlbmFzIHRlbXB1cywgdGVsbHVzIGVnZXQgY29uZGltZW50dW0gcmhvbmN1cywgc2VtIHF1YW0gc2VtcGVyIGxpYmVybywgc2l0IGFtZXQgYWRpcGlzY2luZyBcXFxuICAgICAgc2VtIG5lcXVlIHNlZCBpcHN1bS4gTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVlciBhZGlwaXNjaW5nIGVsaXQuIFxcXG4gICAgICBBZW5lYW4gY29tbW9kbyBsaWd1bGEgZWdldCBkb2xvci4gQWVuZWFuIG1hc3NhLiBDdW0gc29jaWlzIG5hdG9xdWUgcGVuYXRpYnVzIGV0IG1hZ25pcyBkaXMgcGFydHVyaWVudCBtb250ZXMsIFxcXG4gICAgICBuYXNjZXR1ciByaWRpY3VsdXMgbXVzLiBEb25lYyBxdWFtIGZlbGlzLCB1bHRyaWNpZXMgbmVjLCBwZWxsZW50ZXNxdWUgZXUsIHByZXRpdW0gcXVpcywgc2VtLiBOdWxsYSBjb25zZXF1YXQgXFxcbiAgICAgIG1hc3NhIHF1aXMgZW5pbS4gRG9uZWMgcGVkZSBqdXN0bywgZnJpbmdpbGxhIHZlbCwgYWxpcXVldCBuZWMsIHZ1bHB1dGF0ZSBlZ2V0LCBhcmN1LiBJbiBlbmltIGp1c3RvLCByaG9uY3VzIHV0LCBcXFxuICAgICAgaW1wZXJkaWV0IGEsIHZlbmVuYXRpcyB2aXRhZSwganVzdG8uIE51bGxhbSBkaWN0dW0gZmVsaXMgZXUgcGVkZSBtb2xsaXMgcHJldGl1bS4gSW50ZWdlciB0aW5jaWR1bnQuIENyYXMgZGFwaWJ1cy4gXFxcbiAgICAgIFZpdmFtdXMgZWxlbWVudHVtIHNlbXBlciBuaXNpLiBBZW5lYW4gdnVscHV0YXRlIGVsZWlmZW5kIHRlbGx1cy4gQWVuZWFuIGxlbyBsaWd1bGEsIHBvcnR0aXRvciBldSwgY29uc2VxdWF0IHZpdGFlLCBcXFxuICAgICAgZWxlaWZlbmQgYWMsIGVuaW0uIEFsaXF1YW0gbG9yZW0gYW50ZSwgZGFwaWJ1cyBpbiwgdml2ZXJyYSBxdWlzLCBmZXVnaWF0IGEsIHRlbGx1cy4gUGhhc2VsbHVzIHZpdmVycmEgbnVsbGEgdXQgbWV0dXMgXFxcbiAgICAgIHZhcml1cyBsYW9yZWV0LiBRdWlzcXVlIHJ1dHJ1bS4gQWVuZWFuIGltcGVyZGlldC4gRXRpYW0gdWx0cmljaWVzIG5pc2kgdmVsIGF1Z3VlLiBDdXJhYml0dXIgdWxsYW1jb3JwZXIgdWx0cmljaWVzIG5pc2kuIFxcXG4gICAgICBOYW0gZWdldCBkdWkuIEV0aWFtIHJob25jdXMuIE1hZWNlbmFzIHRlbXB1cywgdGVsbHVzIGVnZXQgY29uZGltZW50dW0gcmhvbmN1cywgc2VtIHF1YW0gc2VtcGVyIGxpYmVybywgc2l0IGFtZXQgYWRpcGlzY2luZyBcXFxuICAgICAgc2VtIG5lcXVlIHNlZCBpcHN1bS4nLFxuICAgIH0pO1xuICB9KS50b1Rocm93KC9uYW1lIGNhbm5vdCBiZSBsb25nZXIgdGhhbiAyMDQ4IGNoYXJhY3RlcnMuLyk7XG59KTtcblxudGVzdC5lYWNoKFtcbiAgJy9wYXJhbWV0ZXIvd2l0aCBzcGFjZXMnLFxuICAnY2hhcmFjdGVyc090aGVyVGhhbl5hbGxvd2VkJyxcbiAgJ3RyeWluZzt0aGlzJyxcbl0pKCdTdHJpbmcgU1NNIFBhcmFtZXRlciB0aHJvd3Mgb24gaW52YWxpZCBuYW1lICVzJywgKHBhcmFtZXRlck5hbWUpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgLy8gVEhFTlxuICBleHBlY3QoKCkgPT4ge1xuICAgIG5ldyBzc20uU3RyaW5nUGFyYW1ldGVyKHN0YWNrLCAnUGFyYW1ldGVyJywgeyBzdHJpbmdWYWx1ZTogJ0ZvbycsIHBhcmFtZXRlck5hbWUgfSk7XG4gIH0pLnRvVGhyb3coL25hbWUgbXVzdCBvbmx5IGNvbnRhaW4gbGV0dGVycywgbnVtYmVycywgYW5kIHRoZSBmb2xsb3dpbmcgNCBzeW1ib2xzLiovKTtcbn0pO1xuXG50ZXN0KCdTdHJpbmdMaXN0IFNTTSBQYXJhbWV0ZXIgdGhyb3dzIG9uIGxvbmcgZGVzY3JpcHRpb25zJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAvLyBUSEVOXG4gIGV4cGVjdCgoKSA9PiB7XG4gICAgbmV3IHNzbS5TdHJpbmdMaXN0UGFyYW1ldGVyKHN0YWNrLCAnUGFyYW1ldGVyJywge1xuICAgICAgc3RyaW5nTGlzdFZhbHVlOiBbJ0ZvbycsICdCYXInXSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnMTAyNCsgY2hhcmFjdGVyIGxvbmcgZGVzY3JpcHRpb246IExvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0LCBjb25zZWN0ZXR1ZXIgYWRpcGlzY2luZyBlbGl0LiBcXFxuICAgICAgQWVuZWFuIGNvbW1vZG8gbGlndWxhIGVnZXQgZG9sb3IuIEFlbmVhbiBtYXNzYS4gQ3VtIHNvY2lpcyBuYXRvcXVlIHBlbmF0aWJ1cyBldCBtYWduaXMgZGlzIHBhcnR1cmllbnQgbW9udGVzLCBcXFxuICAgICAgbmFzY2V0dXIgcmlkaWN1bHVzIG11cy4gRG9uZWMgcXVhbSBmZWxpcywgdWx0cmljaWVzIG5lYywgcGVsbGVudGVzcXVlIGV1LCBwcmV0aXVtIHF1aXMsIHNlbS4gTnVsbGEgY29uc2VxdWF0IFxcXG4gICAgICBtYXNzYSBxdWlzIGVuaW0uIERvbmVjIHBlZGUganVzdG8sIGZyaW5naWxsYSB2ZWwsIGFsaXF1ZXQgbmVjLCB2dWxwdXRhdGUgZWdldCwgYXJjdS4gSW4gZW5pbSBqdXN0bywgcmhvbmN1cyB1dCwgXFxcbiAgICAgIGltcGVyZGlldCBhLCB2ZW5lbmF0aXMgdml0YWUsIGp1c3RvLiBOdWxsYW0gZGljdHVtIGZlbGlzIGV1IHBlZGUgbW9sbGlzIHByZXRpdW0uIEludGVnZXIgdGluY2lkdW50LiBDcmFzIGRhcGlidXMuIFxcXG4gICAgICBWaXZhbXVzIGVsZW1lbnR1bSBzZW1wZXIgbmlzaS4gQWVuZWFuIHZ1bHB1dGF0ZSBlbGVpZmVuZCB0ZWxsdXMuIEFlbmVhbiBsZW8gbGlndWxhLCBwb3J0dGl0b3IgZXUsIGNvbnNlcXVhdCB2aXRhZSwgXFxcbiAgICAgIGVsZWlmZW5kIGFjLCBlbmltLiBBbGlxdWFtIGxvcmVtIGFudGUsIGRhcGlidXMgaW4sIHZpdmVycmEgcXVpcywgZmV1Z2lhdCBhLCB0ZWxsdXMuIFBoYXNlbGx1cyB2aXZlcnJhIG51bGxhIHV0IG1ldHVzIFxcXG4gICAgICB2YXJpdXMgbGFvcmVldC4gUXVpc3F1ZSBydXRydW0uIEFlbmVhbiBpbXBlcmRpZXQuIEV0aWFtIHVsdHJpY2llcyBuaXNpIHZlbCBhdWd1ZS4gQ3VyYWJpdHVyIHVsbGFtY29ycGVyIHVsdHJpY2llcyBuaXNpLiBcXFxuICAgICAgTmFtIGVnZXQgZHVpLiBFdGlhbSByaG9uY3VzLiBNYWVjZW5hcyB0ZW1wdXMsIHRlbGx1cyBlZ2V0IGNvbmRpbWVudHVtIHJob25jdXMsIHNlbSBxdWFtIHNlbXBlciBsaWJlcm8sIHNpdCBhbWV0IGFkaXBpc2NpbmcgXFxcbiAgICAgIHNlbSBuZXF1ZSBzZWQgaXBzdW0uJyxcbiAgICB9KTtcbiAgfSkudG9UaHJvdygvRGVzY3JpcHRpb24gY2Fubm90IGJlIGxvbmdlciB0aGFuIDEwMjQgY2hhcmFjdGVycy4vKTtcbn0pO1xuXG50ZXN0KCdTdHJpbmdMaXN0IFNTTSBQYXJhbWV0ZXIgdGhyb3dzIG9uIGxvbmcgbmFtZXMnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gIC8vIFRIRU5cbiAgZXhwZWN0KCgpID0+IHtcbiAgICBuZXcgc3NtLlN0cmluZ0xpc3RQYXJhbWV0ZXIoc3RhY2ssICdQYXJhbWV0ZXInLCB7XG4gICAgICBzdHJpbmdMaXN0VmFsdWU6IFsnRm9vJywgJ0JhciddLFxuICAgICAgcGFyYW1ldGVyTmFtZTogJzIwNDgrIGNoYXJhY3RlciBsb25nIG5hbWU6IExvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0LCBjb25zZWN0ZXR1ZXIgYWRpcGlzY2luZyBlbGl0LiBcXFxuICAgICAgQWVuZWFuIGNvbW1vZG8gbGlndWxhIGVnZXQgZG9sb3IuIEFlbmVhbiBtYXNzYS4gQ3VtIHNvY2lpcyBuYXRvcXVlIHBlbmF0aWJ1cyBldCBtYWduaXMgZGlzIHBhcnR1cmllbnQgbW9udGVzLCBcXFxuICAgICAgbmFzY2V0dXIgcmlkaWN1bHVzIG11cy4gRG9uZWMgcXVhbSBmZWxpcywgdWx0cmljaWVzIG5lYywgcGVsbGVudGVzcXVlIGV1LCBwcmV0aXVtIHF1aXMsIHNlbS4gTnVsbGEgY29uc2VxdWF0IFxcXG4gICAgICBtYXNzYSBxdWlzIGVuaW0uIERvbmVjIHBlZGUganVzdG8sIGZyaW5naWxsYSB2ZWwsIGFsaXF1ZXQgbmVjLCB2dWxwdXRhdGUgZWdldCwgYXJjdS4gSW4gZW5pbSBqdXN0bywgcmhvbmN1cyB1dCwgXFxcbiAgICAgIGltcGVyZGlldCBhLCB2ZW5lbmF0aXMgdml0YWUsIGp1c3RvLiBOdWxsYW0gZGljdHVtIGZlbGlzIGV1IHBlZGUgbW9sbGlzIHByZXRpdW0uIEludGVnZXIgdGluY2lkdW50LiBDcmFzIGRhcGlidXMuIFxcXG4gICAgICBWaXZhbXVzIGVsZW1lbnR1bSBzZW1wZXIgbmlzaS4gQWVuZWFuIHZ1bHB1dGF0ZSBlbGVpZmVuZCB0ZWxsdXMuIEFlbmVhbiBsZW8gbGlndWxhLCBwb3J0dGl0b3IgZXUsIGNvbnNlcXVhdCB2aXRhZSwgXFxcbiAgICAgIGVsZWlmZW5kIGFjLCBlbmltLiBBbGlxdWFtIGxvcmVtIGFudGUsIGRhcGlidXMgaW4sIHZpdmVycmEgcXVpcywgZmV1Z2lhdCBhLCB0ZWxsdXMuIFBoYXNlbGx1cyB2aXZlcnJhIG51bGxhIHV0IG1ldHVzIFxcXG4gICAgICB2YXJpdXMgbGFvcmVldC4gUXVpc3F1ZSBydXRydW0uIEFlbmVhbiBpbXBlcmRpZXQuIEV0aWFtIHVsdHJpY2llcyBuaXNpIHZlbCBhdWd1ZS4gQ3VyYWJpdHVyIHVsbGFtY29ycGVyIHVsdHJpY2llcyBuaXNpLiBcXFxuICAgICAgTmFtIGVnZXQgZHVpLiBFdGlhbSByaG9uY3VzLiBNYWVjZW5hcyB0ZW1wdXMsIHRlbGx1cyBlZ2V0IGNvbmRpbWVudHVtIHJob25jdXMsIHNlbSBxdWFtIHNlbXBlciBsaWJlcm8sIHNpdCBhbWV0IGFkaXBpc2NpbmcgXFxcbiAgICAgIHNlbSBuZXF1ZSBzZWQgaXBzdW0uIExvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0LCBjb25zZWN0ZXR1ZXIgYWRpcGlzY2luZyBlbGl0LiBcXFxuICAgICAgQWVuZWFuIGNvbW1vZG8gbGlndWxhIGVnZXQgZG9sb3IuIEFlbmVhbiBtYXNzYS4gQ3VtIHNvY2lpcyBuYXRvcXVlIHBlbmF0aWJ1cyBldCBtYWduaXMgZGlzIHBhcnR1cmllbnQgbW9udGVzLCBcXFxuICAgICAgbmFzY2V0dXIgcmlkaWN1bHVzIG11cy4gRG9uZWMgcXVhbSBmZWxpcywgdWx0cmljaWVzIG5lYywgcGVsbGVudGVzcXVlIGV1LCBwcmV0aXVtIHF1aXMsIHNlbS4gTnVsbGEgY29uc2VxdWF0IFxcXG4gICAgICBtYXNzYSBxdWlzIGVuaW0uIERvbmVjIHBlZGUganVzdG8sIGZyaW5naWxsYSB2ZWwsIGFsaXF1ZXQgbmVjLCB2dWxwdXRhdGUgZWdldCwgYXJjdS4gSW4gZW5pbSBqdXN0bywgcmhvbmN1cyB1dCwgXFxcbiAgICAgIGltcGVyZGlldCBhLCB2ZW5lbmF0aXMgdml0YWUsIGp1c3RvLiBOdWxsYW0gZGljdHVtIGZlbGlzIGV1IHBlZGUgbW9sbGlzIHByZXRpdW0uIEludGVnZXIgdGluY2lkdW50LiBDcmFzIGRhcGlidXMuIFxcXG4gICAgICBWaXZhbXVzIGVsZW1lbnR1bSBzZW1wZXIgbmlzaS4gQWVuZWFuIHZ1bHB1dGF0ZSBlbGVpZmVuZCB0ZWxsdXMuIEFlbmVhbiBsZW8gbGlndWxhLCBwb3J0dGl0b3IgZXUsIGNvbnNlcXVhdCB2aXRhZSwgXFxcbiAgICAgIGVsZWlmZW5kIGFjLCBlbmltLiBBbGlxdWFtIGxvcmVtIGFudGUsIGRhcGlidXMgaW4sIHZpdmVycmEgcXVpcywgZmV1Z2lhdCBhLCB0ZWxsdXMuIFBoYXNlbGx1cyB2aXZlcnJhIG51bGxhIHV0IG1ldHVzIFxcXG4gICAgICB2YXJpdXMgbGFvcmVldC4gUXVpc3F1ZSBydXRydW0uIEFlbmVhbiBpbXBlcmRpZXQuIEV0aWFtIHVsdHJpY2llcyBuaXNpIHZlbCBhdWd1ZS4gQ3VyYWJpdHVyIHVsbGFtY29ycGVyIHVsdHJpY2llcyBuaXNpLiBcXFxuICAgICAgTmFtIGVnZXQgZHVpLiBFdGlhbSByaG9uY3VzLiBNYWVjZW5hcyB0ZW1wdXMsIHRlbGx1cyBlZ2V0IGNvbmRpbWVudHVtIHJob25jdXMsIHNlbSBxdWFtIHNlbXBlciBsaWJlcm8sIHNpdCBhbWV0IGFkaXBpc2NpbmcgXFxcbiAgICAgIHNlbSBuZXF1ZSBzZWQgaXBzdW0uJyxcbiAgICB9KTtcbiAgfSkudG9UaHJvdygvbmFtZSBjYW5ub3QgYmUgbG9uZ2VyIHRoYW4gMjA0OCBjaGFyYWN0ZXJzLi8pO1xufSk7XG5cbnRlc3QuZWFjaChbXG4gICcvcGFyYW1ldGVyL3dpdGggc3BhY2VzJyxcbiAgJ2NoYXJhY3RlcnNPdGhlclRoYW5eYWxsb3dlZCcsXG4gICd0cnlpbmc7dGhpcycsXG5dKSgnU3RyaW5nTGlzdCBTU00gUGFyYW1ldGVyIHRocm93cyBvbiBpbnZhbGlkIG5hbWUgJXMnLCAocGFyYW1ldGVyTmFtZSkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAvLyBUSEVOXG4gIGV4cGVjdCgoKSA9PiB7XG4gICAgbmV3IHNzbS5TdHJpbmdMaXN0UGFyYW1ldGVyKHN0YWNrLCAnUGFyYW1ldGVyJywgeyBzdHJpbmdMaXN0VmFsdWU6IFsnRm9vJ10sIHBhcmFtZXRlck5hbWUgfSk7XG4gIH0pLnRvVGhyb3coL25hbWUgbXVzdCBvbmx5IGNvbnRhaW4gbGV0dGVycywgbnVtYmVycywgYW5kIHRoZSBmb2xsb3dpbmcgNCBzeW1ib2xzLiovKTtcbn0pO1xuXG50ZXN0KCdTdHJpbmdMaXN0IFNTTSBQYXJhbWV0ZXIgdmFsdWVzIGNhbm5vdCBjb250YWluIGNvbW1hcycsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgLy8gVEhFTlxuICBleHBlY3QoKCkgPT4gbmV3IHNzbS5TdHJpbmdMaXN0UGFyYW1ldGVyKHN0YWNrLCAnUGFyYW1ldGVyJywgeyBzdHJpbmdMaXN0VmFsdWU6IFsnRm9vLEJhciddIH0pKS50b1Rocm93KFxuICAgIC9jYW5ub3QgY29udGFpbiB0aGUgJywnIGNoYXJhY3Rlci8pO1xufSk7XG5cbnRlc3QoJ1N0cmluZ0xpc3QgU1NNIFBhcmFtZXRlciByZWplY3RzIGludmFsaWQgdmFsdWVzJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAvLyBUSEVOXG4gIGV4cGVjdCgoKSA9PiBuZXcgc3NtLlN0cmluZ0xpc3RQYXJhbWV0ZXIoc3RhY2ssICdQYXJhbWV0ZXInLCB7IGFsbG93ZWRQYXR0ZXJuOiAnXihGb298QmFyKSQnLCBzdHJpbmdMaXN0VmFsdWU6IFsnRm9vJywgJ0Zvb0JhciddIH0pKS50b1Rocm93KFxuICAgIC9kb2VzIG5vdCBtYXRjaCB0aGUgc3BlY2lmaWVkIGFsbG93ZWRQYXR0ZXJuLyk7XG59KTtcblxudGVzdCgnU3RyaW5nTGlzdCBTU00gUGFyYW1ldGVyIGFsbG93cyB1bnJlc29sdmVkIHRva2VucycsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgLy8gVEhFTlxuICBleHBlY3QoKCkgPT4gbmV3IHNzbS5TdHJpbmdMaXN0UGFyYW1ldGVyKHN0YWNrLCAnUGFyYW1ldGVyJywge1xuICAgIGFsbG93ZWRQYXR0ZXJuOiAnXihGb298QmFyKSQnLFxuICAgIHN0cmluZ0xpc3RWYWx1ZTogWydGb28nLCBjZGsuTGF6eS5zdHJpbmcoeyBwcm9kdWNlOiAoKSA9PiAnQmF6IScgfSldLFxuICB9KSkubm90LnRvVGhyb3coKTtcbn0pO1xuXG50ZXN0KCdwYXJhbWV0ZXJBcm4gaXMgY3JhZnRlZCBjb3JyZWN0bHknLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICBjb25zdCBwYXJhbSA9IG5ldyBzc20uU3RyaW5nUGFyYW1ldGVyKHN0YWNrLCAnUGFyYW1ldGVyJywgeyBzdHJpbmdWYWx1ZTogJ0ZvbycgfSk7XG5cbiAgLy8gVEhFTlxuICBleHBlY3Qoc3RhY2sucmVzb2x2ZShwYXJhbS5wYXJhbWV0ZXJBcm4pKS50b0VxdWFsKHtcbiAgICAnRm46OkpvaW4nOiBbJycsIFtcbiAgICAgICdhcm46JyxcbiAgICAgIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sXG4gICAgICAnOnNzbTonLFxuICAgICAgeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICc6JyxcbiAgICAgIHsgUmVmOiAnQVdTOjpBY2NvdW50SWQnIH0sXG4gICAgICAnOnBhcmFtZXRlci8nLFxuICAgICAgeyBSZWY6ICdQYXJhbWV0ZXI5RTFCNEZCQScgfSxcbiAgICBdXSxcbiAgfSk7XG59KTtcblxudGVzdCgncGFyYW1ldGVyTmFtZSB0aGF0IGluY2x1ZGVzIGEgXCIvXCIgbXVzdCBiZSBmdWxseSBxdWFsaWZpZWQgKGkuZS4gYmVnaW4gd2l0aCBcIi9cIikgYXMgd2VsbCcsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgLy8gVEhFTlxuICBleHBlY3QoKCkgPT4gbmV3IHNzbS5TdHJpbmdQYXJhbWV0ZXIoc3RhY2ssICdteVBhcmFtJywge1xuICAgIHN0cmluZ1ZhbHVlOiAnbXlWYWx1ZScsXG4gICAgcGFyYW1ldGVyTmFtZTogJ3BhdGgvdG8vcGFyYW1ldGVyJyxcbiAgfSkpLnRvVGhyb3coL1BhcmFtZXRlciBuYW1lcyBtdXN0IGJlIGZ1bGx5IHF1YWxpZmllZC8pO1xuXG4gIGV4cGVjdCgoKSA9PiBuZXcgc3NtLlN0cmluZ0xpc3RQYXJhbWV0ZXIoc3RhY2ssICdteVBhcmFtMicsIHtcbiAgICBzdHJpbmdMaXN0VmFsdWU6IFsnZm9vJywgJ2JhciddLFxuICAgIHBhcmFtZXRlck5hbWU6ICdwYXRoL3RvL3BhcmFtZXRlcjInLFxuICB9KSkudG9UaHJvdygvUGFyYW1ldGVyIG5hbWVzIG11c3QgYmUgZnVsbHkgcXVhbGlmaWVkIFxcKGlmIHRoZXkgaW5jbHVkZSBcXFwiXFwvXFxcIiB0aGV5IG11c3QgYWxzbyBiZWdpbiB3aXRoIGEgXFxcIlxcL1xcXCJcXClcXDogcGF0aFxcL3RvXFwvcGFyYW1ldGVyMi8pO1xufSk7XG5cbnRlc3QoJ1N0cmluZ1BhcmFtZXRlci5mcm9tU3RyaW5nUGFyYW1ldGVyTmFtZScsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgLy8gV0hFTlxuICBjb25zdCBwYXJhbSA9IHNzbS5TdHJpbmdQYXJhbWV0ZXIuZnJvbVN0cmluZ1BhcmFtZXRlck5hbWUoc3RhY2ssICdNeVBhcmFtTmFtZScsICdNeVBhcmFtTmFtZScpO1xuXG4gIC8vIFRIRU5cbiAgZXhwZWN0KHN0YWNrLnJlc29sdmUocGFyYW0ucGFyYW1ldGVyQXJuKSkudG9FcXVhbCh7XG4gICAgJ0ZuOjpKb2luJzogWycnLCBbXG4gICAgICAnYXJuOicsXG4gICAgICB7IFJlZjogJ0FXUzo6UGFydGl0aW9uJyB9LFxuICAgICAgJzpzc206JyxcbiAgICAgIHsgUmVmOiAnQVdTOjpSZWdpb24nIH0sXG4gICAgICAnOicsXG4gICAgICB7IFJlZjogJ0FXUzo6QWNjb3VudElkJyB9LFxuICAgICAgJzpwYXJhbWV0ZXIvTXlQYXJhbU5hbWUnLFxuICAgIF1dLFxuICB9KTtcbiAgZXhwZWN0KHN0YWNrLnJlc29sdmUocGFyYW0ucGFyYW1ldGVyTmFtZSkpLnRvRXF1YWwoJ015UGFyYW1OYW1lJyk7XG4gIGV4cGVjdChzdGFjay5yZXNvbHZlKHBhcmFtLnBhcmFtZXRlclR5cGUpKS50b0VxdWFsKCdTdHJpbmcnKTtcbiAgZXhwZWN0KHN0YWNrLnJlc29sdmUocGFyYW0uc3RyaW5nVmFsdWUpKS50b0VxdWFsKHsgUmVmOiAnTXlQYXJhbU5hbWVQYXJhbWV0ZXInIH0pO1xuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgUGFyYW1ldGVyczoge1xuICAgICAgTXlQYXJhbU5hbWVQYXJhbWV0ZXI6IHtcbiAgICAgICAgVHlwZTogJ0FXUzo6U1NNOjpQYXJhbWV0ZXI6OlZhbHVlPFN0cmluZz4nLFxuICAgICAgICBEZWZhdWx0OiAnTXlQYXJhbU5hbWUnLFxuICAgICAgfSxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG50ZXN0KCdTdHJpbmdQYXJhbWV0ZXIuZnJvbVN0cmluZ1BhcmFtZXRlckF0dHJpYnV0ZXMnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gIC8vIFdIRU5cbiAgY29uc3QgcGFyYW0gPSBzc20uU3RyaW5nUGFyYW1ldGVyLmZyb21TdHJpbmdQYXJhbWV0ZXJBdHRyaWJ1dGVzKHN0YWNrLCAnTXlQYXJhbU5hbWUnLCB7XG4gICAgcGFyYW1ldGVyTmFtZTogJ015UGFyYW1OYW1lJyxcbiAgICB2ZXJzaW9uOiAyLFxuICB9KTtcblxuICAvLyBUSEVOXG4gIGV4cGVjdChzdGFjay5yZXNvbHZlKHBhcmFtLnBhcmFtZXRlckFybikpLnRvRXF1YWwoe1xuICAgICdGbjo6Sm9pbic6IFsnJywgW1xuICAgICAgJ2FybjonLFxuICAgICAgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSxcbiAgICAgICc6c3NtOicsXG4gICAgICB7IFJlZjogJ0FXUzo6UmVnaW9uJyB9LFxuICAgICAgJzonLFxuICAgICAgeyBSZWY6ICdBV1M6OkFjY291bnRJZCcgfSxcbiAgICAgICc6cGFyYW1ldGVyL015UGFyYW1OYW1lJyxcbiAgICBdXSxcbiAgfSk7XG4gIGV4cGVjdChzdGFjay5yZXNvbHZlKHBhcmFtLnBhcmFtZXRlck5hbWUpKS50b0VxdWFsKCdNeVBhcmFtTmFtZScpO1xuICBleHBlY3Qoc3RhY2sucmVzb2x2ZShwYXJhbS5wYXJhbWV0ZXJUeXBlKSkudG9FcXVhbCgnU3RyaW5nJyk7XG4gIGV4cGVjdChzdGFjay5yZXNvbHZlKHBhcmFtLnN0cmluZ1ZhbHVlKSkudG9FcXVhbCgne3tyZXNvbHZlOnNzbTpNeVBhcmFtTmFtZToyfX0nKTtcbn0pO1xuXG50ZXN0KCdTdHJpbmdQYXJhbWV0ZXIuZnJvbVN0cmluZ1BhcmFtZXRlckF0dHJpYnV0ZXMgd2l0aCB2ZXJzaW9uIGZyb20gdG9rZW4nLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gIC8vIFdIRU5cbiAgY29uc3QgcGFyYW0gPSBzc20uU3RyaW5nUGFyYW1ldGVyLmZyb21TdHJpbmdQYXJhbWV0ZXJBdHRyaWJ1dGVzKHN0YWNrLCAnTXlQYXJhbU5hbWUnLCB7XG4gICAgcGFyYW1ldGVyTmFtZTogJ015UGFyYW1OYW1lJyxcbiAgICB2ZXJzaW9uOiBjZGsuVG9rZW4uYXNOdW1iZXIoeyBSZWY6ICd2ZXJzaW9uJyB9KSxcbiAgfSk7XG5cbiAgLy8gVEhFTlxuICBleHBlY3Qoc3RhY2sucmVzb2x2ZShwYXJhbS5wYXJhbWV0ZXJBcm4pKS50b0VxdWFsKHtcbiAgICAnRm46OkpvaW4nOiBbJycsIFtcbiAgICAgICdhcm46JyxcbiAgICAgIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sXG4gICAgICAnOnNzbTonLFxuICAgICAgeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICc6JyxcbiAgICAgIHsgUmVmOiAnQVdTOjpBY2NvdW50SWQnIH0sXG4gICAgICAnOnBhcmFtZXRlci9NeVBhcmFtTmFtZScsXG4gICAgXV0sXG4gIH0pO1xuICBleHBlY3Qoc3RhY2sucmVzb2x2ZShwYXJhbS5wYXJhbWV0ZXJOYW1lKSkudG9FcXVhbCgnTXlQYXJhbU5hbWUnKTtcbiAgZXhwZWN0KHN0YWNrLnJlc29sdmUocGFyYW0ucGFyYW1ldGVyVHlwZSkpLnRvRXF1YWwoJ1N0cmluZycpO1xuICBleHBlY3Qoc3RhY2sucmVzb2x2ZShwYXJhbS5zdHJpbmdWYWx1ZSkpLnRvRXF1YWwoe1xuICAgICdGbjo6Sm9pbic6IFsnJywgW1xuICAgICAgJ3t7cmVzb2x2ZTpzc206TXlQYXJhbU5hbWU6JyxcbiAgICAgIHsgUmVmOiAndmVyc2lvbicgfSxcbiAgICAgICd9fScsXG4gICAgXV0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ1N0cmluZ1BhcmFtZXRlci5mcm9tU2VjdXJlU3RyaW5nUGFyYW1ldGVyQXR0cmlidXRlcycsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgLy8gV0hFTlxuICBjb25zdCBwYXJhbSA9IHNzbS5TdHJpbmdQYXJhbWV0ZXIuZnJvbVNlY3VyZVN0cmluZ1BhcmFtZXRlckF0dHJpYnV0ZXMoc3RhY2ssICdNeVBhcmFtTmFtZScsIHtcbiAgICBwYXJhbWV0ZXJOYW1lOiAnTXlQYXJhbU5hbWUnLFxuICAgIHZlcnNpb246IDIsXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgZXhwZWN0KHN0YWNrLnJlc29sdmUocGFyYW0ucGFyYW1ldGVyQXJuKSkudG9FcXVhbCh7XG4gICAgJ0ZuOjpKb2luJzogWycnLCBbXG4gICAgICAnYXJuOicsXG4gICAgICB7IFJlZjogJ0FXUzo6UGFydGl0aW9uJyB9LFxuICAgICAgJzpzc206JyxcbiAgICAgIHsgUmVmOiAnQVdTOjpSZWdpb24nIH0sXG4gICAgICAnOicsXG4gICAgICB7IFJlZjogJ0FXUzo6QWNjb3VudElkJyB9LFxuICAgICAgJzpwYXJhbWV0ZXIvTXlQYXJhbU5hbWUnLFxuICAgIF1dLFxuICB9KTtcbiAgZXhwZWN0KHN0YWNrLnJlc29sdmUocGFyYW0ucGFyYW1ldGVyTmFtZSkpLnRvRXF1YWwoJ015UGFyYW1OYW1lJyk7XG4gIGV4cGVjdChzdGFjay5yZXNvbHZlKHBhcmFtLnBhcmFtZXRlclR5cGUpKS50b0VxdWFsKCdTZWN1cmVTdHJpbmcnKTtcbiAgZXhwZWN0KHN0YWNrLnJlc29sdmUocGFyYW0uc3RyaW5nVmFsdWUpKS50b0VxdWFsKCd7e3Jlc29sdmU6c3NtLXNlY3VyZTpNeVBhcmFtTmFtZToyfX0nKTtcbn0pO1xuXG50ZXN0KCdTdHJpbmdQYXJhbWV0ZXIuZnJvbVNlY3VyZVN0cmluZ1BhcmFtZXRlckF0dHJpYnV0ZXMgd2l0aCB2ZXJzaW9uIGZyb20gdG9rZW4nLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gIC8vIFdIRU5cbiAgY29uc3QgcGFyYW0gPSBzc20uU3RyaW5nUGFyYW1ldGVyLmZyb21TZWN1cmVTdHJpbmdQYXJhbWV0ZXJBdHRyaWJ1dGVzKHN0YWNrLCAnTXlQYXJhbU5hbWUnLCB7XG4gICAgcGFyYW1ldGVyTmFtZTogJ015UGFyYW1OYW1lJyxcbiAgICB2ZXJzaW9uOiBjZGsuVG9rZW4uYXNOdW1iZXIoeyBSZWY6ICd2ZXJzaW9uJyB9KSxcbiAgfSk7XG5cbiAgLy8gVEhFTlxuICBleHBlY3Qoc3RhY2sucmVzb2x2ZShwYXJhbS5wYXJhbWV0ZXJBcm4pKS50b0VxdWFsKHtcbiAgICAnRm46OkpvaW4nOiBbJycsIFtcbiAgICAgICdhcm46JyxcbiAgICAgIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sXG4gICAgICAnOnNzbTonLFxuICAgICAgeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICc6JyxcbiAgICAgIHsgUmVmOiAnQVdTOjpBY2NvdW50SWQnIH0sXG4gICAgICAnOnBhcmFtZXRlci9NeVBhcmFtTmFtZScsXG4gICAgXV0sXG4gIH0pO1xuICBleHBlY3Qoc3RhY2sucmVzb2x2ZShwYXJhbS5wYXJhbWV0ZXJOYW1lKSkudG9FcXVhbCgnTXlQYXJhbU5hbWUnKTtcbiAgZXhwZWN0KHN0YWNrLnJlc29sdmUocGFyYW0ucGFyYW1ldGVyVHlwZSkpLnRvRXF1YWwoJ1NlY3VyZVN0cmluZycpO1xuICBleHBlY3Qoc3RhY2sucmVzb2x2ZShwYXJhbS5zdHJpbmdWYWx1ZSkpLnRvRXF1YWwoe1xuICAgICdGbjo6Sm9pbic6IFsnJywgW1xuICAgICAgJ3t7cmVzb2x2ZTpzc20tc2VjdXJlOk15UGFyYW1OYW1lOicsXG4gICAgICB7IFJlZjogJ3ZlcnNpb24nIH0sXG4gICAgICAnfX0nLFxuICAgIF1dLFxuICB9KTtcbn0pO1xuXG50ZXN0KCdTdHJpbmdQYXJhbWV0ZXIuZnJvbVNlY3VyZVN0cmluZ1BhcmFtZXRlckF0dHJpYnV0ZXMgd2l0aCBlbmNyeXB0aW9uIGtleSBjcmVhdGVzIHRoZSBjb3JyZWN0IHBvbGljeSBmb3IgZ3JhbnRSZWFkJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgY29uc3Qga2V5ID0ga21zLktleS5mcm9tS2V5QXJuKHN0YWNrLCAnQ3VzdG9tS2V5JywgJ2Fybjphd3M6a21zOnVzLWVhc3QtMToxMjM0NTY3ODkwMTI6a2V5L3h5eicpO1xuICBjb25zdCByb2xlID0gbmV3IGlhbS5Sb2xlKHN0YWNrLCAnUm9sZScsIHtcbiAgICBhc3N1bWVkQnk6IG5ldyBpYW0uQWNjb3VudFJvb3RQcmluY2lwYWwoKSxcbiAgfSk7XG5cbiAgLy8gV0hFTlxuICBjb25zdCBwYXJhbSA9IHNzbS5TdHJpbmdQYXJhbWV0ZXIuZnJvbVNlY3VyZVN0cmluZ1BhcmFtZXRlckF0dHJpYnV0ZXMoc3RhY2ssICdNeVBhcmFtTmFtZScsIHtcbiAgICBwYXJhbWV0ZXJOYW1lOiAnTXlQYXJhbU5hbWUnLFxuICAgIHZlcnNpb246IDIsXG4gICAgZW5jcnlwdGlvbktleToga2V5LFxuICB9KTtcbiAgcGFyYW0uZ3JhbnRSZWFkKHJvbGUpO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICB7XG4gICAgICAgICAgQWN0aW9uOiAna21zOkRlY3J5cHQnLFxuICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICBSZXNvdXJjZTogJ2Fybjphd3M6a21zOnVzLWVhc3QtMToxMjM0NTY3ODkwMTI6a2V5L3h5eicsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAgICdzc206RGVzY3JpYmVQYXJhbWV0ZXJzJyxcbiAgICAgICAgICAgICdzc206R2V0UGFyYW1ldGVycycsXG4gICAgICAgICAgICAnc3NtOkdldFBhcmFtZXRlcicsXG4gICAgICAgICAgICAnc3NtOkdldFBhcmFtZXRlckhpc3RvcnknLFxuICAgICAgICAgIF0sXG4gICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICc6c3NtOicsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpSZWdpb24nLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6QWNjb3VudElkJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICc6cGFyYW1ldGVyL015UGFyYW1OYW1lJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgfSxcbiAgfSk7XG59KTtcblxudGVzdCgnU3RyaW5nUGFyYW1ldGVyLmZyb21TZWN1cmVTdHJpbmdQYXJhbWV0ZXJBdHRyaWJ1dGVzIHdpdGggZW5jcnlwdGlvbiBrZXkgY3JlYXRlcyB0aGUgY29ycmVjdCBwb2xpY3kgZm9yIGdyYW50V3JpdGUnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICBjb25zdCBrZXkgPSBrbXMuS2V5LmZyb21LZXlBcm4oc3RhY2ssICdDdXN0b21LZXknLCAnYXJuOmF3czprbXM6dXMtZWFzdC0xOjEyMzQ1Njc4OTAxMjprZXkveHl6Jyk7XG4gIGNvbnN0IHJvbGUgPSBuZXcgaWFtLlJvbGUoc3RhY2ssICdSb2xlJywge1xuICAgIGFzc3VtZWRCeTogbmV3IGlhbS5BY2NvdW50Um9vdFByaW5jaXBhbCgpLFxuICB9KTtcblxuICAvLyBXSEVOXG4gIGNvbnN0IHBhcmFtID0gc3NtLlN0cmluZ1BhcmFtZXRlci5mcm9tU2VjdXJlU3RyaW5nUGFyYW1ldGVyQXR0cmlidXRlcyhzdGFjaywgJ015UGFyYW1OYW1lJywge1xuICAgIHBhcmFtZXRlck5hbWU6ICdNeVBhcmFtTmFtZScsXG4gICAgdmVyc2lvbjogMixcbiAgICBlbmNyeXB0aW9uS2V5OiBrZXksXG4gIH0pO1xuICBwYXJhbS5ncmFudFdyaXRlKHJvbGUpO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICB7XG4gICAgICAgICAgQWN0aW9uOiBbXG4gICAgICAgICAgICAna21zOkVuY3J5cHQnLFxuICAgICAgICAgICAgJ2ttczpSZUVuY3J5cHQqJyxcbiAgICAgICAgICAgICdrbXM6R2VuZXJhdGVEYXRhS2V5KicsXG4gICAgICAgICAgXSxcbiAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgUmVzb3VyY2U6ICdhcm46YXdzOmttczp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOmtleS94eXonLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgQWN0aW9uOiAnc3NtOlB1dFBhcmFtZXRlcicsXG4gICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICc6c3NtOicsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpSZWdpb24nLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6QWNjb3VudElkJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICc6cGFyYW1ldGVyL015UGFyYW1OYW1lJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgfSxcbiAgfSk7XG59KTtcblxudGVzdCgnU3RyaW5nUGFyYW1ldGVyLmZyb21TZWN1cmVTdHJpbmdQYXJhbWV0ZXJBdHRyaWJ1dGVzIHdpdGhvdXQgdmVyc2lvbicsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgLy8gV0hFTlxuICBjb25zdCBwYXJhbSA9IHNzbS5TdHJpbmdQYXJhbWV0ZXIuZnJvbVNlY3VyZVN0cmluZ1BhcmFtZXRlckF0dHJpYnV0ZXMoc3RhY2ssICdNeVBhcmFtTmFtZScsIHtcbiAgICBwYXJhbWV0ZXJOYW1lOiAnTXlQYXJhbU5hbWUnLFxuICB9KTtcblxuICAvLyBUSEVOXG4gIGV4cGVjdChzdGFjay5yZXNvbHZlKHBhcmFtLnN0cmluZ1ZhbHVlKSkudG9FcXVhbCgne3tyZXNvbHZlOnNzbS1zZWN1cmU6TXlQYXJhbU5hbWV9fScpO1xufSk7XG5cbnRlc3QoJ1N0cmluZ0xpc3RQYXJhbWV0ZXIuZnJvbU5hbWUnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gIC8vIFdIRU5cbiAgY29uc3QgcGFyYW0gPSBzc20uU3RyaW5nTGlzdFBhcmFtZXRlci5mcm9tU3RyaW5nTGlzdFBhcmFtZXRlck5hbWUoc3RhY2ssICdNeVBhcmFtTmFtZScsICdNeVBhcmFtTmFtZScpO1xuXG4gIC8vIFRIRU5cbiAgZXhwZWN0KHN0YWNrLnJlc29sdmUocGFyYW0ucGFyYW1ldGVyQXJuKSkudG9FcXVhbCh7XG4gICAgJ0ZuOjpKb2luJzogWycnLCBbXG4gICAgICAnYXJuOicsXG4gICAgICB7IFJlZjogJ0FXUzo6UGFydGl0aW9uJyB9LFxuICAgICAgJzpzc206JyxcbiAgICAgIHsgUmVmOiAnQVdTOjpSZWdpb24nIH0sXG4gICAgICAnOicsXG4gICAgICB7IFJlZjogJ0FXUzo6QWNjb3VudElkJyB9LFxuICAgICAgJzpwYXJhbWV0ZXIvTXlQYXJhbU5hbWUnLFxuICAgIF1dLFxuICB9KTtcbiAgZXhwZWN0KHN0YWNrLnJlc29sdmUocGFyYW0ucGFyYW1ldGVyTmFtZSkpLnRvRXF1YWwoJ015UGFyYW1OYW1lJyk7XG4gIGV4cGVjdChzdGFjay5yZXNvbHZlKHBhcmFtLnBhcmFtZXRlclR5cGUpKS50b0VxdWFsKCdTdHJpbmdMaXN0Jyk7XG4gIGV4cGVjdChzdGFjay5yZXNvbHZlKHBhcmFtLnN0cmluZ0xpc3RWYWx1ZSkpLnRvRXF1YWwoeyAnRm46OlNwbGl0JzogWycsJywgJ3t7cmVzb2x2ZTpzc206TXlQYXJhbU5hbWV9fSddIH0pO1xufSk7XG5cbnRlc3QoJ2Zyb21Mb29rdXAgd2lsbCB1c2UgdGhlIFNTTSBjb250ZXh0IHByb3ZpZGVyIHRvIHJlYWQgdmFsdWUgZHVyaW5nIHN5bnRoZXNpcycsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoeyBjb250ZXh0OiB7IFtjeGFwaS5ORVdfU1RZTEVfU1RBQ0tfU1lOVEhFU0lTX0NPTlRFWFRdOiBmYWxzZSB9IH0pO1xuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnbXktc3RhcScsIHsgZW52OiB7IHJlZ2lvbjogJ3VzLWVhc3QtMScsIGFjY291bnQ6ICcxMjM0NCcgfSB9KTtcblxuICAvLyBXSEVOXG4gIGNvbnN0IHZhbHVlID0gc3NtLlN0cmluZ1BhcmFtZXRlci52YWx1ZUZyb21Mb29rdXAoc3RhY2ssICdteS1wYXJhbS1uYW1lJyk7XG5cbiAgLy8gVEhFTlxuICBleHBlY3QodmFsdWUpLnRvRXF1YWwoJ2R1bW15LXZhbHVlLWZvci1teS1wYXJhbS1uYW1lJyk7XG4gIGV4cGVjdChhcHAuc3ludGgoKS5tYW5pZmVzdC5taXNzaW5nKS50b0VxdWFsKFtcbiAgICB7XG4gICAgICBrZXk6ICdzc206YWNjb3VudD0xMjM0NDpwYXJhbWV0ZXJOYW1lPW15LXBhcmFtLW5hbWU6cmVnaW9uPXVzLWVhc3QtMScsXG4gICAgICBwcm9wczoge1xuICAgICAgICBhY2NvdW50OiAnMTIzNDQnLFxuICAgICAgICByZWdpb246ICd1cy1lYXN0LTEnLFxuICAgICAgICBwYXJhbWV0ZXJOYW1lOiAnbXktcGFyYW0tbmFtZScsXG4gICAgICB9LFxuICAgICAgcHJvdmlkZXI6ICdzc20nLFxuICAgIH0sXG4gIF0pO1xufSk7XG5cbmRlc2NyaWJlKCdmcm9tIHN0cmluZyBsaXN0IHBhcmFtZXRlcicsICgpID0+IHtcbiAgdGVzdERlcHJlY2F0ZWQoJ3ZhbHVlRm9yVHlwZWRTdHJpbmdQYXJhbWV0ZXIgbGlzdCB0eXBlIHRocm93cyBlcnJvcicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBzc20uU3RyaW5nUGFyYW1ldGVyLnZhbHVlRm9yVHlwZWRTdHJpbmdQYXJhbWV0ZXIoc3RhY2ssICdteS1wYXJhbS1uYW1lJywgUGFyYW1ldGVyVHlwZS5TVFJJTkdfTElTVCk7XG4gICAgfSkudG9UaHJvdygvdXNlIHZhbHVlRm9yVHlwZWRMaXN0UGFyYW1ldGVyIGluc3RlYWQvKTtcbiAgfSk7XG5cbiAgdGVzdERlcHJlY2F0ZWQoJ2Zyb21TdHJpbmdQYXJhbWV0ZXJBdHRyaWJ1dGVzIGxpc3QgdHlwZSB0aHJvd3MgZXJyb3InLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgc3NtLlN0cmluZ1BhcmFtZXRlci5mcm9tU3RyaW5nUGFyYW1ldGVyQXR0cmlidXRlcyhzdGFjaywgJ215LXBhcmFtLW5hbWUnLCB7XG4gICAgICAgIHBhcmFtZXRlck5hbWU6ICdteS1wYXJhbS1uYW1lJyxcbiAgICAgICAgdHlwZTogUGFyYW1ldGVyVHlwZS5TVFJJTkdfTElTVCxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coL2Zyb21TdHJpbmdQYXJhbWV0ZXJBdHRyaWJ1dGVzIGRvZXMgbm90IHN1cHBvcnQgU3RyaW5nTGlzdC8pO1xuICB9KTtcblxuICB0ZXN0RGVwcmVjYXRlZCgnZnJvbVN0cmluZ1BhcmFtZXRlckF0dHJpYnV0ZXMgcmV0dXJucyBjb3JyZWN0IHZhbHVlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgc3NtLlN0cmluZ1BhcmFtZXRlci5mcm9tU3RyaW5nUGFyYW1ldGVyQXR0cmlidXRlcyhzdGFjaywgJ215LXBhcmFtLW5hbWUnLCB7XG4gICAgICBwYXJhbWV0ZXJOYW1lOiAnbXktcGFyYW0tbmFtZScsXG4gICAgICB0eXBlOiBQYXJhbWV0ZXJUeXBlLlNUUklORyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICBQYXJhbWV0ZXJzOiB7XG4gICAgICAgIG15cGFyYW1uYW1lUGFyYW1ldGVyOiB7XG4gICAgICAgICAgVHlwZTogJ0FXUzo6U1NNOjpQYXJhbWV0ZXI6OlZhbHVlPFN0cmluZz4nLFxuICAgICAgICAgIERlZmF1bHQ6ICdteS1wYXJhbS1uYW1lJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2Zyb21TdHJpbmdQYXJhbWV0ZXJBdHRyaWJ1dGVzIHJldHVybnMgY29ycmVjdCB2YWx1ZSB3aXRoIHZhbHVlVHlwZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIHNzbS5TdHJpbmdQYXJhbWV0ZXIuZnJvbVN0cmluZ1BhcmFtZXRlckF0dHJpYnV0ZXMoc3RhY2ssICdteS1wYXJhbS1uYW1lJywge1xuICAgICAgcGFyYW1ldGVyTmFtZTogJ215LXBhcmFtLW5hbWUnLFxuICAgICAgdmFsdWVUeXBlOiBQYXJhbWV0ZXJWYWx1ZVR5cGUuU1RSSU5HLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAgIFBhcmFtZXRlcnM6IHtcbiAgICAgICAgbXlwYXJhbW5hbWVQYXJhbWV0ZXI6IHtcbiAgICAgICAgICBUeXBlOiAnQVdTOjpTU006OlBhcmFtZXRlcjo6VmFsdWU8U3RyaW5nPicsXG4gICAgICAgICAgRGVmYXVsdDogJ215LXBhcmFtLW5hbWUnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgndmFsdWVGb3JUeXBlZExpc3RQYXJhbWV0ZXIgcmV0dXJucyBjb3JyZWN0IHZhbHVlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgc3NtLlN0cmluZ0xpc3RQYXJhbWV0ZXIudmFsdWVGb3JUeXBlZExpc3RQYXJhbWV0ZXIoc3RhY2ssICdteS1wYXJhbS1uYW1lJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgUGFyYW1ldGVyczoge1xuICAgICAgICBTc21QYXJhbWV0ZXJWYWx1ZW15cGFyYW1uYW1lQzk2NTg0QjZGMDBBNDY0RUFEMTk1M0FGRjRCMDUxMThQYXJhbWV0ZXI6IHtcbiAgICAgICAgICBUeXBlOiAnQVdTOjpTU006OlBhcmFtZXRlcjo6VmFsdWU8TGlzdDxTdHJpbmc+PicsXG4gICAgICAgICAgRGVmYXVsdDogJ215LXBhcmFtLW5hbWUnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgndmFsdWVGb3JUeXBlZExpc3RQYXJhbWV0ZXIgcmV0dXJucyBjb3JyZWN0IHZhbHVlIHdpdGggdHlwZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIHNzbS5TdHJpbmdMaXN0UGFyYW1ldGVyLnZhbHVlRm9yVHlwZWRMaXN0UGFyYW1ldGVyKHN0YWNrLCAnbXktcGFyYW0tbmFtZScsIFBhcmFtZXRlclZhbHVlVHlwZS5BV1NfRUMyX0lOU1RBTkNFX0lEKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICBQYXJhbWV0ZXJzOiB7XG4gICAgICAgIFNzbVBhcmFtZXRlclZhbHVlbXlwYXJhbW5hbWVDOTY1ODRCNkYwMEE0NjRFQUQxOTUzQUZGNEIwNTExOFBhcmFtZXRlcjoge1xuICAgICAgICAgIFR5cGU6ICdBV1M6OlNTTTo6UGFyYW1ldGVyOjpWYWx1ZTxMaXN0PEFXUzo6RUMyOjpJbnN0YW5jZTo6SWQ+PicsXG4gICAgICAgICAgRGVmYXVsdDogJ215LXBhcmFtLW5hbWUnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZnJvbVN0cmluZ0xpc3RQYXJhbWV0ZXJBdHRyaWJ1dGVzIHJldHVybnMgY29ycmVjdCB2YWx1ZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIHNzbS5TdHJpbmdMaXN0UGFyYW1ldGVyLmZyb21MaXN0UGFyYW1ldGVyQXR0cmlidXRlcyhzdGFjaywgJ215LXBhcmFtLW5hbWUnLCB7XG4gICAgICBwYXJhbWV0ZXJOYW1lOiAnbXktcGFyYW0tbmFtZScsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgUGFyYW1ldGVyczoge1xuICAgICAgICBteXBhcmFtbmFtZVBhcmFtZXRlcjoge1xuICAgICAgICAgIFR5cGU6ICdBV1M6OlNTTTo6UGFyYW1ldGVyOjpWYWx1ZTxMaXN0PFN0cmluZz4+JyxcbiAgICAgICAgICBEZWZhdWx0OiAnbXktcGFyYW0tbmFtZScsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0RGVwcmVjYXRlZCgnc3RyaW5nIHR5cGUgcmV0dXJucyBjb3JyZWN0IHZhbHVlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgc3NtLlN0cmluZ1BhcmFtZXRlci52YWx1ZUZvclR5cGVkU3RyaW5nUGFyYW1ldGVyKHN0YWNrLCAnbXktcGFyYW0tbmFtZScsIFBhcmFtZXRlclR5cGUuU1RSSU5HKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICBQYXJhbWV0ZXJzOiB7XG4gICAgICAgIFNzbVBhcmFtZXRlclZhbHVlbXlwYXJhbW5hbWVDOTY1ODRCNkYwMEE0NjRFQUQxOTUzQUZGNEIwNTExOFBhcmFtZXRlcjoge1xuICAgICAgICAgIFR5cGU6ICdBV1M6OlNTTTo6UGFyYW1ldGVyOjpWYWx1ZTxTdHJpbmc+JyxcbiAgICAgICAgICBEZWZhdWx0OiAnbXktcGFyYW0tbmFtZScsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdzdHJpbmcgdmFsdWVUeXBlIHJldHVybnMgY29ycmVjdCB2YWx1ZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIHNzbS5TdHJpbmdQYXJhbWV0ZXIudmFsdWVGb3JUeXBlZFN0cmluZ1BhcmFtZXRlclYyKHN0YWNrLCAnbXktcGFyYW0tbmFtZScsIFBhcmFtZXRlclZhbHVlVHlwZS5BV1NfRUMyX0lNQUdFX0lEKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICBQYXJhbWV0ZXJzOiB7XG4gICAgICAgIFNzbVBhcmFtZXRlclZhbHVlbXlwYXJhbW5hbWVDOTY1ODRCNkYwMEE0NjRFQUQxOTUzQUZGNEIwNTExOFBhcmFtZXRlcjoge1xuICAgICAgICAgIFR5cGU6ICdBV1M6OlNTTTo6UGFyYW1ldGVyOjpWYWx1ZTxBV1M6OkVDMjo6SW1hZ2U6OklkPicsXG4gICAgICAgICAgRGVmYXVsdDogJ215LXBhcmFtLW5hbWUnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbn0pO1xuXG5kZXNjcmliZSgndmFsdWVGb3JTdHJpbmdQYXJhbWV0ZXInLCAoKSA9PiB7XG4gIHRlc3QoJ3JldHVybnMgYSB0b2tlbiB0aGF0IHJlcHJlc2VudHMgdGhlIFNTTSBwYXJhbWV0ZXIgdmFsdWUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCB2YWx1ZSA9IHNzbS5TdHJpbmdQYXJhbWV0ZXIudmFsdWVGb3JTdHJpbmdQYXJhbWV0ZXIoc3RhY2ssICdteS1wYXJhbS1uYW1lJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgUGFyYW1ldGVyczoge1xuICAgICAgICBTc21QYXJhbWV0ZXJWYWx1ZW15cGFyYW1uYW1lQzk2NTg0QjZGMDBBNDY0RUFEMTk1M0FGRjRCMDUxMThQYXJhbWV0ZXI6IHtcbiAgICAgICAgICBUeXBlOiAnQVdTOjpTU006OlBhcmFtZXRlcjo6VmFsdWU8U3RyaW5nPicsXG4gICAgICAgICAgRGVmYXVsdDogJ215LXBhcmFtLW5hbWUnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZSh2YWx1ZSkpLnRvRXF1YWwoeyBSZWY6ICdTc21QYXJhbWV0ZXJWYWx1ZW15cGFyYW1uYW1lQzk2NTg0QjZGMDBBNDY0RUFEMTk1M0FGRjRCMDUxMThQYXJhbWV0ZXInIH0pO1xuICB9KTtcblxuICB0ZXN0KCdkZS1kdXAgYmFzZWQgb24gcGFyYW1ldGVyIG5hbWUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBzc20uU3RyaW5nUGFyYW1ldGVyLnZhbHVlRm9yU3RyaW5nUGFyYW1ldGVyKHN0YWNrLCAnbXktcGFyYW0tbmFtZScpO1xuICAgIHNzbS5TdHJpbmdQYXJhbWV0ZXIudmFsdWVGb3JTdHJpbmdQYXJhbWV0ZXIoc3RhY2ssICdteS1wYXJhbS1uYW1lJyk7XG4gICAgc3NtLlN0cmluZ1BhcmFtZXRlci52YWx1ZUZvclN0cmluZ1BhcmFtZXRlcihzdGFjaywgJ215LXBhcmFtLW5hbWUtMicpO1xuICAgIHNzbS5TdHJpbmdQYXJhbWV0ZXIudmFsdWVGb3JTdHJpbmdQYXJhbWV0ZXIoc3RhY2ssICdteS1wYXJhbS1uYW1lJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgUGFyYW1ldGVyczoge1xuICAgICAgICBTc21QYXJhbWV0ZXJWYWx1ZW15cGFyYW1uYW1lQzk2NTg0QjZGMDBBNDY0RUFEMTk1M0FGRjRCMDUxMThQYXJhbWV0ZXI6IHtcbiAgICAgICAgICBUeXBlOiAnQVdTOjpTU006OlBhcmFtZXRlcjo6VmFsdWU8U3RyaW5nPicsXG4gICAgICAgICAgRGVmYXVsdDogJ215LXBhcmFtLW5hbWUnLFxuICAgICAgICB9LFxuICAgICAgICBTc21QYXJhbWV0ZXJWYWx1ZW15cGFyYW1uYW1lMkM5NjU4NEI2RjAwQTQ2NEVBRDE5NTNBRkY0QjA1MTE4UGFyYW1ldGVyOiB7XG4gICAgICAgICAgVHlwZTogJ0FXUzo6U1NNOjpQYXJhbWV0ZXI6OlZhbHVlPFN0cmluZz4nLFxuICAgICAgICAgIERlZmF1bHQ6ICdteS1wYXJhbS1uYW1lLTInLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIHF1ZXJ5IGFjdHVhbCBTU00gUGFyYW1ldGVyIE5hbWVzLCBtdWx0aXBsZSB0aW1lcycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIHNzbS5TdHJpbmdQYXJhbWV0ZXIudmFsdWVGb3JTdHJpbmdQYXJhbWV0ZXIoc3RhY2ssICcvbXkvcGFyYW0vbmFtZScpO1xuICAgIHNzbS5TdHJpbmdQYXJhbWV0ZXIudmFsdWVGb3JTdHJpbmdQYXJhbWV0ZXIoc3RhY2ssICcvbXkvcGFyYW0vbmFtZScpO1xuICB9KTtcbn0pO1xuXG50ZXN0KCdyZW5kZXJpbmcgb2YgcGFyYW1ldGVyIGFybnMnLCAoKSA9PiB7XG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICBjb25zdCBwYXJhbSA9IG5ldyBjZGsuQ2ZuUGFyYW1ldGVyKHN0YWNrLCAncGFyYW0nKTtcbiAgY29uc3QgZXhwZWN0ZWRBID0geyAnRm46OkpvaW4nOiBbJycsIFsnYXJuOicsIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sICc6c3NtOicsIHsgUmVmOiAnQVdTOjpSZWdpb24nIH0sICc6JywgeyBSZWY6ICdBV1M6OkFjY291bnRJZCcgfSwgJzpwYXJhbWV0ZXIvYmFtJ11dIH07XG4gIGNvbnN0IGV4cGVjdGVkQiA9IHsgJ0ZuOjpKb2luJzogWycnLCBbJ2FybjonLCB7IFJlZjogJ0FXUzo6UGFydGl0aW9uJyB9LCAnOnNzbTonLCB7IFJlZjogJ0FXUzo6UmVnaW9uJyB9LCAnOicsIHsgUmVmOiAnQVdTOjpBY2NvdW50SWQnIH0sICc6cGFyYW1ldGVyLycsIHsgUmVmOiAncGFyYW0nIH1dXSB9O1xuICBjb25zdCBleHBlY3RlZEMgPSB7ICdGbjo6Sm9pbic6IFsnJywgWydhcm46JywgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSwgJzpzc206JywgeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSwgJzonLCB7IFJlZjogJ0FXUzo6QWNjb3VudElkJyB9LCAnOnBhcmFtZXRlcicsIHsgUmVmOiAncGFyYW0nIH1dXSB9O1xuICBsZXQgaSA9IDA7XG5cbiAgLy8gV0hFTlxuICBjb25zdCBjYXNlMSA9IHNzbS5TdHJpbmdQYXJhbWV0ZXIuZnJvbVN0cmluZ1BhcmFtZXRlck5hbWUoc3RhY2ssIGBwJHtpKyt9YCwgJ2JhbScpO1xuICBjb25zdCBjYXNlMiA9IHNzbS5TdHJpbmdQYXJhbWV0ZXIuZnJvbVN0cmluZ1BhcmFtZXRlck5hbWUoc3RhY2ssIGBwJHtpKyt9YCwgJy9iYW0nKTtcbiAgY29uc3QgY2FzZTQgPSBzc20uU3RyaW5nUGFyYW1ldGVyLmZyb21TdHJpbmdQYXJhbWV0ZXJBdHRyaWJ1dGVzKHN0YWNrLCBgcCR7aSsrfWAsIHsgcGFyYW1ldGVyTmFtZTogJ2JhbScgfSk7XG4gIGNvbnN0IGNhc2U1ID0gc3NtLlN0cmluZ1BhcmFtZXRlci5mcm9tU3RyaW5nUGFyYW1ldGVyQXR0cmlidXRlcyhzdGFjaywgYHAke2krK31gLCB7IHBhcmFtZXRlck5hbWU6ICcvYmFtJyB9KTtcbiAgY29uc3QgY2FzZTYgPSBzc20uU3RyaW5nUGFyYW1ldGVyLmZyb21TdHJpbmdQYXJhbWV0ZXJBdHRyaWJ1dGVzKHN0YWNrLCBgcCR7aSsrfWAsIHsgcGFyYW1ldGVyTmFtZTogcGFyYW0udmFsdWVBc1N0cmluZywgc2ltcGxlTmFtZTogdHJ1ZSB9KTtcbiAgY29uc3QgY2FzZTcgPSBzc20uU3RyaW5nUGFyYW1ldGVyLmZyb21TZWN1cmVTdHJpbmdQYXJhbWV0ZXJBdHRyaWJ1dGVzKHN0YWNrLCBgcCR7aSsrfWAsIHsgcGFyYW1ldGVyTmFtZTogJ2JhbScsIHZlcnNpb246IDEwIH0pO1xuICBjb25zdCBjYXNlOCA9IHNzbS5TdHJpbmdQYXJhbWV0ZXIuZnJvbVNlY3VyZVN0cmluZ1BhcmFtZXRlckF0dHJpYnV0ZXMoc3RhY2ssIGBwJHtpKyt9YCwgeyBwYXJhbWV0ZXJOYW1lOiAnL2JhbScsIHZlcnNpb246IDEwIH0pO1xuICBjb25zdCBjYXNlOSA9IHNzbS5TdHJpbmdQYXJhbWV0ZXIuZnJvbVNlY3VyZVN0cmluZ1BhcmFtZXRlckF0dHJpYnV0ZXMoc3RhY2ssIGBwJHtpKyt9YCwgeyBwYXJhbWV0ZXJOYW1lOiBwYXJhbS52YWx1ZUFzU3RyaW5nLCB2ZXJzaW9uOiAxMCwgc2ltcGxlTmFtZTogZmFsc2UgfSk7XG5cbiAgLy8gYXV0by1nZW5lcmF0ZWQgbmFtZSBpcyBhbHdheXMgZ2VuZXJhdGVkIGFzIGEgXCJzaW1wbGUgbmFtZVwiIChub3QvYS9wYXRoKVxuICBjb25zdCBjYXNlMTAgPSBuZXcgc3NtLlN0cmluZ1BhcmFtZXRlcihzdGFjaywgYHAke2krK31gLCB7IHN0cmluZ1ZhbHVlOiAndmFsdWUnIH0pO1xuXG4gIC8vIGV4cGxpY2l0bHkgbmFtZWQgcGh5c2ljYWwgbmFtZSBnaXZlcyB1cyBhIGhpbnQgb24gaG93IHRvIHJlbmRlciB0aGUgQVJOXG4gIGNvbnN0IGNhc2UxMSA9IG5ldyBzc20uU3RyaW5nUGFyYW1ldGVyKHN0YWNrLCBgcCR7aSsrfWAsIHsgcGFyYW1ldGVyTmFtZTogJy9mb28vYmFyJywgc3RyaW5nVmFsdWU6ICdoZWxsbycgfSk7XG4gIGNvbnN0IGNhc2UxMiA9IG5ldyBzc20uU3RyaW5nUGFyYW1ldGVyKHN0YWNrLCBgcCR7aSsrfWAsIHsgcGFyYW1ldGVyTmFtZTogJ3NpbXBsZS1uYW1lJywgc3RyaW5nVmFsdWU6ICdoZWxsbycgfSk7XG5cbiAgY29uc3QgY2FzZTEzID0gbmV3IHNzbS5TdHJpbmdMaXN0UGFyYW1ldGVyKHN0YWNrLCBgcCR7aSsrfWAsIHsgc3RyaW5nTGlzdFZhbHVlOiBbJ2hlbGxvJywgJ3dvcmxkJ10gfSk7XG4gIGNvbnN0IGNhc2UxNCA9IG5ldyBzc20uU3RyaW5nTGlzdFBhcmFtZXRlcihzdGFjaywgYHAke2krK31gLCB7IHBhcmFtZXRlck5hbWU6ICcvbm90L3NpbXBsZScsIHN0cmluZ0xpc3RWYWx1ZTogWydoZWxsbycsICd3b3JsZCddIH0pO1xuICBjb25zdCBjYXNlMTUgPSBuZXcgc3NtLlN0cmluZ0xpc3RQYXJhbWV0ZXIoc3RhY2ssIGBwJHtpKyt9YCwgeyBwYXJhbWV0ZXJOYW1lOiAnc2ltcGxlJywgc3RyaW5nTGlzdFZhbHVlOiBbJ2hlbGxvJywgJ3dvcmxkJ10gfSk7XG5cbiAgLy8gVEhFTlxuICBleHBlY3Qoc3RhY2sucmVzb2x2ZShjYXNlMS5wYXJhbWV0ZXJBcm4pKS50b0VxdWFsKGV4cGVjdGVkQSk7XG4gIGV4cGVjdChzdGFjay5yZXNvbHZlKGNhc2UyLnBhcmFtZXRlckFybikpLnRvRXF1YWwoZXhwZWN0ZWRBKTtcbiAgZXhwZWN0KHN0YWNrLnJlc29sdmUoY2FzZTQucGFyYW1ldGVyQXJuKSkudG9FcXVhbChleHBlY3RlZEEpO1xuICBleHBlY3Qoc3RhY2sucmVzb2x2ZShjYXNlNS5wYXJhbWV0ZXJBcm4pKS50b0VxdWFsKGV4cGVjdGVkQSk7XG4gIGV4cGVjdChzdGFjay5yZXNvbHZlKGNhc2U2LnBhcmFtZXRlckFybikpLnRvRXF1YWwoZXhwZWN0ZWRCKTtcbiAgZXhwZWN0KHN0YWNrLnJlc29sdmUoY2FzZTcucGFyYW1ldGVyQXJuKSkudG9FcXVhbChleHBlY3RlZEEpO1xuICBleHBlY3Qoc3RhY2sucmVzb2x2ZShjYXNlOC5wYXJhbWV0ZXJBcm4pKS50b0VxdWFsKGV4cGVjdGVkQSk7XG4gIGV4cGVjdChzdGFjay5yZXNvbHZlKGNhc2U5LnBhcmFtZXRlckFybikpLnRvRXF1YWwoZXhwZWN0ZWRDKTtcblxuICAvLyBuZXcgc3NtLlBhcmFtZXRlcnMgZGV0ZXJtaW5lIGlmIFwiL1wiIGlzIG5lZWRlZCBiYXNlZCBvbiB0aGUgcG9zdHVyZSBvZiBgcGFyYW1ldGVyTmFtZWAuXG4gIGV4cGVjdChzdGFjay5yZXNvbHZlKGNhc2UxMC5wYXJhbWV0ZXJBcm4pKS50b0VxdWFsKHsgJ0ZuOjpKb2luJzogWycnLCBbJ2FybjonLCB7IFJlZjogJ0FXUzo6UGFydGl0aW9uJyB9LCAnOnNzbTonLCB7IFJlZjogJ0FXUzo6UmVnaW9uJyB9LCAnOicsIHsgUmVmOiAnQVdTOjpBY2NvdW50SWQnIH0sICc6cGFyYW1ldGVyLycsIHsgUmVmOiAncDgxQkIwRjZGRScgfV1dIH0pO1xuICBleHBlY3Qoc3RhY2sucmVzb2x2ZShjYXNlMTEucGFyYW1ldGVyQXJuKSkudG9FcXVhbCh7ICdGbjo6Sm9pbic6IFsnJywgWydhcm46JywgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSwgJzpzc206JywgeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSwgJzonLCB7IFJlZjogJ0FXUzo6QWNjb3VudElkJyB9LCAnOnBhcmFtZXRlcicsIHsgUmVmOiAncDk3QTUwODIxMicgfV1dIH0pO1xuICBleHBlY3Qoc3RhY2sucmVzb2x2ZShjYXNlMTIucGFyYW1ldGVyQXJuKSkudG9FcXVhbCh7ICdGbjo6Sm9pbic6IFsnJywgWydhcm46JywgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSwgJzpzc206JywgeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSwgJzonLCB7IFJlZjogJ0FXUzo6QWNjb3VudElkJyB9LCAnOnBhcmFtZXRlci8nLCB7IFJlZjogJ3AxMDdENkI4QUIwJyB9XV0gfSk7XG4gIGV4cGVjdChzdGFjay5yZXNvbHZlKGNhc2UxMy5wYXJhbWV0ZXJBcm4pKS50b0VxdWFsKHsgJ0ZuOjpKb2luJzogWycnLCBbJ2FybjonLCB7IFJlZjogJ0FXUzo6UGFydGl0aW9uJyB9LCAnOnNzbTonLCB7IFJlZjogJ0FXUzo6UmVnaW9uJyB9LCAnOicsIHsgUmVmOiAnQVdTOjpBY2NvdW50SWQnIH0sICc6cGFyYW1ldGVyLycsIHsgUmVmOiAncDExOEE5Q0IwMkMnIH1dXSB9KTtcbiAgZXhwZWN0KHN0YWNrLnJlc29sdmUoY2FzZTE0LnBhcmFtZXRlckFybikpLnRvRXF1YWwoeyAnRm46OkpvaW4nOiBbJycsIFsnYXJuOicsIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sICc6c3NtOicsIHsgUmVmOiAnQVdTOjpSZWdpb24nIH0sICc6JywgeyBSZWY6ICdBV1M6OkFjY291bnRJZCcgfSwgJzpwYXJhbWV0ZXInLCB7IFJlZjogJ3AxMjlCRTRDRTkxJyB9XV0gfSk7XG4gIGV4cGVjdChzdGFjay5yZXNvbHZlKGNhc2UxNS5wYXJhbWV0ZXJBcm4pKS50b0VxdWFsKHsgJ0ZuOjpKb2luJzogWycnLCBbJ2FybjonLCB7IFJlZjogJ0FXUzo6UGFydGl0aW9uJyB9LCAnOnNzbTonLCB7IFJlZjogJ0FXUzo6UmVnaW9uJyB9LCAnOicsIHsgUmVmOiAnQVdTOjpBY2NvdW50SWQnIH0sICc6cGFyYW1ldGVyLycsIHsgUmVmOiAncDEzMjZBMkFFQzQnIH1dXSB9KTtcbn0pO1xuXG50ZXN0KCdpZiBwYXJhbWV0ZXJOYW1lIGlzIGEgdG9rZW4gc2VwYXJhdG9yIG11c3QgYmUgc3BlY2lmaWVkJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgY29uc3QgcGFyYW0gPSBuZXcgY2RrLkNmblBhcmFtZXRlcihzdGFjaywgJ3BhcmFtJyk7XG4gIGxldCBpID0gMDtcblxuICAvLyBXSEVOXG4gIGNvbnN0IHAxID0gbmV3IHNzbS5TdHJpbmdQYXJhbWV0ZXIoc3RhY2ssIGBwJHtpKyt9YCwgeyBwYXJhbWV0ZXJOYW1lOiBwYXJhbS52YWx1ZUFzU3RyaW5nLCBzdHJpbmdWYWx1ZTogJ2ZvbycsIHNpbXBsZU5hbWU6IHRydWUgfSk7XG4gIGNvbnN0IHAyID0gbmV3IHNzbS5TdHJpbmdQYXJhbWV0ZXIoc3RhY2ssIGBwJHtpKyt9YCwgeyBwYXJhbWV0ZXJOYW1lOiBwYXJhbS52YWx1ZUFzU3RyaW5nLCBzdHJpbmdWYWx1ZTogJ2ZvbycsIHNpbXBsZU5hbWU6IGZhbHNlIH0pO1xuICBjb25zdCBwMyA9IG5ldyBzc20uU3RyaW5nTGlzdFBhcmFtZXRlcihzdGFjaywgYHAke2krK31gLCB7IHBhcmFtZXRlck5hbWU6IHBhcmFtLnZhbHVlQXNTdHJpbmcsIHN0cmluZ0xpc3RWYWx1ZTogWydmb28nXSwgc2ltcGxlTmFtZTogZmFsc2UgfSk7XG5cbiAgLy8gVEhFTlxuICBleHBlY3Qoc3RhY2sucmVzb2x2ZShwMS5wYXJhbWV0ZXJBcm4pKS50b0VxdWFsKHsgJ0ZuOjpKb2luJzogWycnLCBbJ2FybjonLCB7IFJlZjogJ0FXUzo6UGFydGl0aW9uJyB9LCAnOnNzbTonLCB7IFJlZjogJ0FXUzo6UmVnaW9uJyB9LCAnOicsIHsgUmVmOiAnQVdTOjpBY2NvdW50SWQnIH0sICc6cGFyYW1ldGVyLycsIHsgUmVmOiAncDBCMDJBOEY2NScgfV1dIH0pO1xuICBleHBlY3Qoc3RhY2sucmVzb2x2ZShwMi5wYXJhbWV0ZXJBcm4pKS50b0VxdWFsKHsgJ0ZuOjpKb2luJzogWycnLCBbJ2FybjonLCB7IFJlZjogJ0FXUzo6UGFydGl0aW9uJyB9LCAnOnNzbTonLCB7IFJlZjogJ0FXUzo6UmVnaW9uJyB9LCAnOicsIHsgUmVmOiAnQVdTOjpBY2NvdW50SWQnIH0sICc6cGFyYW1ldGVyJywgeyBSZWY6ICdwMUU0M0FENUFDJyB9XV0gfSk7XG4gIGV4cGVjdChzdGFjay5yZXNvbHZlKHAzLnBhcmFtZXRlckFybikpLnRvRXF1YWwoeyAnRm46OkpvaW4nOiBbJycsIFsnYXJuOicsIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sICc6c3NtOicsIHsgUmVmOiAnQVdTOjpSZWdpb24nIH0sICc6JywgeyBSZWY6ICdBV1M6OkFjY291bnRJZCcgfSwgJzpwYXJhbWV0ZXInLCB7IFJlZjogJ3AyQzE5MDNBRUInIH1dXSB9KTtcbn0pO1xuXG50ZXN0KCdmYWlscyBpZiBuYW1lIGlzIGEgdG9rZW4gYW5kIG5vIGV4cGxpY2l0IHNlcGFyYXRvcicsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gIGNvbnN0IHBhcmFtID0gbmV3IGNkay5DZm5QYXJhbWV0ZXIoc3RhY2ssICdwYXJhbScpO1xuICBsZXQgaSA9IDA7XG5cbiAgLy8gVEhFTlxuICBjb25zdCBleHBlY3RlZCA9IC9VbmFibGUgdG8gZGV0ZXJtaW5lIEFSTiBzZXBhcmF0b3IgZm9yIFNTTSBwYXJhbWV0ZXIgc2luY2UgdGhlIHBhcmFtZXRlciBuYW1lIGlzIGFuIHVucmVzb2x2ZWQgdG9rZW4uIFVzZSBcImZyb21BdHRyaWJ1dGVzXCIgYW5kIHNwZWNpZnkgXCJzaW1wbGVOYW1lXCIgZXhwbGljaXRseS87XG4gIGV4cGVjdCgoKSA9PiBzc20uU3RyaW5nUGFyYW1ldGVyLmZyb21TdHJpbmdQYXJhbWV0ZXJOYW1lKHN0YWNrLCBgcCR7aSsrfWAsIHBhcmFtLnZhbHVlQXNTdHJpbmcpKS50b1Rocm93KGV4cGVjdGVkKTtcbiAgZXhwZWN0KCgpID0+IHNzbS5TdHJpbmdQYXJhbWV0ZXIuZnJvbVNlY3VyZVN0cmluZ1BhcmFtZXRlckF0dHJpYnV0ZXMoc3RhY2ssIGBwJHtpKyt9YCwgeyBwYXJhbWV0ZXJOYW1lOiBwYXJhbS52YWx1ZUFzU3RyaW5nLCB2ZXJzaW9uOiAxIH0pKS50b1Rocm93KGV4cGVjdGVkKTtcbiAgZXhwZWN0KCgpID0+IG5ldyBzc20uU3RyaW5nUGFyYW1ldGVyKHN0YWNrLCBgcCR7aSsrfWAsIHsgcGFyYW1ldGVyTmFtZTogcGFyYW0udmFsdWVBc1N0cmluZywgc3RyaW5nVmFsdWU6ICdmb28nIH0pKS50b1Rocm93KGV4cGVjdGVkKTtcbiAgZXhwZWN0KCgpID0+IG5ldyBzc20uU3RyaW5nUGFyYW1ldGVyKHN0YWNrLCBgcCR7aSsrfWAsIHsgcGFyYW1ldGVyTmFtZTogcGFyYW0udmFsdWVBc1N0cmluZywgc3RyaW5nVmFsdWU6ICdmb28nIH0pKS50b1Rocm93KGV4cGVjdGVkKTtcbn0pO1xuXG50ZXN0KCdmYWlscyBpZiBzaW1wbGVOYW1lIGlzIHdyb25nIGJhc2VkIG9uIGEgY29uY3JldGUgcGh5c2ljYWwgbmFtZScsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gIGxldCBpID0gMDtcblxuICAvLyBUSEVOXG4gIGV4cGVjdCgoKSA9PiBzc20uU3RyaW5nUGFyYW1ldGVyLmZyb21TdHJpbmdQYXJhbWV0ZXJBdHRyaWJ1dGVzKHN0YWNrLCBgcCR7aSsrfWAsIHsgcGFyYW1ldGVyTmFtZTogJ3NpbXBsZScsIHNpbXBsZU5hbWU6IGZhbHNlIH0pKS50b1Rocm93KC9QYXJhbWV0ZXIgbmFtZSBcInNpbXBsZVwiIGlzIGEgc2ltcGxlIG5hbWUsIGJ1dCBcInNpbXBsZU5hbWVcIiB3YXMgZXhwbGljaXRseSBzZXQgdG8gZmFsc2UuIEVpdGhlciBvbWl0IGl0IG9yIHNldCBpdCB0byB0cnVlLyk7XG4gIGV4cGVjdCgoKSA9PiBzc20uU3RyaW5nUGFyYW1ldGVyLmZyb21TdHJpbmdQYXJhbWV0ZXJBdHRyaWJ1dGVzKHN0YWNrLCBgcCR7aSsrfWAsIHsgcGFyYW1ldGVyTmFtZTogJy9mb28vYmFyJywgc2ltcGxlTmFtZTogdHJ1ZSB9KSkudG9UaHJvdygvUGFyYW1ldGVyIG5hbWUgXCJcXC9mb29cXC9iYXJcIiBpcyBub3QgYSBzaW1wbGUgbmFtZSwgYnV0IFwic2ltcGxlTmFtZVwiIHdhcyBleHBsaWNpdGx5IHNldCB0byB0cnVlLiBFaXRoZXIgb21pdCBpdCBvciBzZXQgaXQgdG8gZmFsc2UvKTtcbn0pO1xuXG50ZXN0KCdmYWlscyBpZiBwYXJhbWV0ZXJOYW1lIGlzIHVuZGVmaW5lZCBhbmQgc2ltcGxlTmFtZSBpcyBcImZhbHNlXCInLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gIC8vIFRIRU5cbiAgZXhwZWN0KCgpID0+IG5ldyBzc20uU3RyaW5nUGFyYW1ldGVyKHN0YWNrLCAncCcsIHsgc2ltcGxlTmFtZTogZmFsc2UsIHN0cmluZ1ZhbHVlOiAnZm9vJyB9KSkudG9UaHJvdygvSWYgXCJwYXJhbWV0ZXJOYW1lXCIgaXMgbm90IGV4cGxpY2l0bHkgZGVmaW5lZCwgXCJzaW1wbGVOYW1lXCIgbXVzdCBiZSBcInRydWVcIiBvciB1bmRlZmluZWQgc2luY2UgYXV0by1nZW5lcmF0ZWQgcGFyYW1ldGVyIG5hbWVzIGFsd2F5cyBoYXZlIHNpbXBsZSBuYW1lcy8pO1xufSk7XG4iXX0=