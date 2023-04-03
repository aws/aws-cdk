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
cdk_build_tools_1.testDeprecated('type cannot be specified as AWS_EC2_IMAGE_ID', () => {
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
    cdk_build_tools_1.testDeprecated('valueForTypedStringParameter list type throws error', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // THEN
        expect(() => {
            ssm.StringParameter.valueForTypedStringParameter(stack, 'my-param-name', lib_1.ParameterType.STRING_LIST);
        }).toThrow(/use valueForTypedListParameter instead/);
    });
    cdk_build_tools_1.testDeprecated('fromStringParameterAttributes list type throws error', () => {
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
    cdk_build_tools_1.testDeprecated('fromStringParameterAttributes returns correct value', () => {
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
    cdk_build_tools_1.testDeprecated('string type returns correct value', () => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyYW1ldGVyLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwYXJhbWV0ZXIudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsNEJBQTRCOztBQUU1QixvREFBK0M7QUFDL0Msd0NBQXdDO0FBQ3hDLHdDQUF3QztBQUN4Qyw4REFBMEQ7QUFDMUQscUNBQXFDO0FBQ3JDLHlDQUF5QztBQUN6Qyw4QkFBOEI7QUFDOUIsZ0NBQTJEO0FBRTNELElBQUksQ0FBQyxpQ0FBaUMsRUFBRSxHQUFHLEVBQUU7SUFDM0MsUUFBUTtJQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBRTlCLE9BQU87SUFDUCxJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRTtRQUMxQyxjQUFjLEVBQUUsSUFBSTtRQUNwQixXQUFXLEVBQUUsZUFBZTtRQUM1QixhQUFhLEVBQUUsY0FBYztRQUM3QixXQUFXLEVBQUUsS0FBSztLQUNuQixDQUFDLENBQUM7SUFFSCxPQUFPO0lBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMscUJBQXFCLEVBQUU7UUFDckUsY0FBYyxFQUFFLElBQUk7UUFDcEIsV0FBVyxFQUFFLGVBQWU7UUFDNUIsSUFBSSxFQUFFLGNBQWM7UUFDcEIsSUFBSSxFQUFFLFFBQVE7UUFDZCxLQUFLLEVBQUUsS0FBSztLQUNiLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsZ0NBQWMsQ0FBQyw4Q0FBOEMsRUFBRSxHQUFHLEVBQUU7SUFDbEUsUUFBUTtJQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBRTlCLE9BQU87SUFDUCxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxHQUFHLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7UUFDckQsV0FBVyxF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SyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDN0QsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzdELE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUM3RCxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDN0QsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzdELE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUM3RCxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDN0QsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBRTdELHlGQUF5RjtJQUN6RixNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxHQUFHLEVBQUUsZ0JBQWdCLEVBQUUsRUFBRSxPQUFPLEVBQUUsRUFBRSxHQUFHLEVBQUUs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S0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQywwSEFBMEgsQ0FBQyxDQUFDO0lBQ3RRLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLDZCQUE2QixDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxhQUFhLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGtJQUFrSSxDQUFDLENBQUM7QUFDalIsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsK0RBQStELEVBQUUsR0FBRyxFQUFFO0lBQ3pFLFFBQVE7SUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUU5QixPQUFPO0lBQ1AsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxzSkFBc0osQ0FBQyxDQUFDO0FBQy9QLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgbWF4LWxlbiAqL1xuXG5pbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMga21zIGZyb20gJ0Bhd3MtY2RrL2F3cy1rbXMnO1xuaW1wb3J0IHsgdGVzdERlcHJlY2F0ZWQgfSBmcm9tICdAYXdzLWNkay9jZGstYnVpbGQtdG9vbHMnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgY3hhcGkgZnJvbSAnQGF3cy1jZGsvY3gtYXBpJztcbmltcG9ydCAqIGFzIHNzbSBmcm9tICcuLi9saWInO1xuaW1wb3J0IHsgUGFyYW1ldGVyVHlwZSwgUGFyYW1ldGVyVmFsdWVUeXBlIH0gZnJvbSAnLi4vbGliJztcblxudGVzdCgnY3JlYXRpbmcgYSBTdHJpbmcgU1NNIFBhcmFtZXRlcicsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgLy8gV0hFTlxuICBuZXcgc3NtLlN0cmluZ1BhcmFtZXRlcihzdGFjaywgJ1BhcmFtZXRlcicsIHtcbiAgICBhbGxvd2VkUGF0dGVybjogJy4qJyxcbiAgICBkZXNjcmlwdGlvbjogJ1RoZSB2YWx1ZSBGb28nLFxuICAgIHBhcmFtZXRlck5hbWU6ICdGb29QYXJhbWV0ZXInLFxuICAgIHN0cmluZ1ZhbHVlOiAnRm9vJyxcbiAgfSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTU006OlBhcmFtZXRlcicsIHtcbiAgICBBbGxvd2VkUGF0dGVybjogJy4qJyxcbiAgICBEZXNjcmlwdGlvbjogJ1RoZSB2YWx1ZSBGb28nLFxuICAgIE5hbWU6ICdGb29QYXJhbWV0ZXInLFxuICAgIFR5cGU6ICdTdHJpbmcnLFxuICAgIFZhbHVlOiAnRm9vJyxcbiAgfSk7XG59KTtcblxudGVzdERlcHJlY2F0ZWQoJ3R5cGUgY2Fubm90IGJlIHNwZWNpZmllZCBhcyBBV1NfRUMyX0lNQUdFX0lEJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAvLyBUSEVOXG4gIGV4cGVjdCgoKSA9PiBuZXcgc3NtLlN0cmluZ1BhcmFtZXRlcihzdGFjaywgJ215UGFyYW0nLCB7XG4gICAgc3RyaW5nVmFsdWU6ICdteVZhbHVlJyxcbiAgICB0eXBlOiBzc20uUGFyYW1ldGVyVHlwZS5BV1NfRUMyX0lNQUdFX0lELFxuICB9KSkudG9UaHJvdygnVGhlIHR5cGUgbXVzdCBlaXRoZXIgYmUgUGFyYW1ldGVyVHlwZS5TVFJJTkcgb3IgUGFyYW1ldGVyVHlwZS5TVFJJTkdfTElTVC4gRGlkIHlvdSBtZWFuIHRvIHNldCBkYXRhVHlwZTogUGFyYW1ldGVyRGF0YVR5cGUuQVdTX0VDMl9JTUFHRSBpbnN0ZWFkPycpO1xufSk7XG5cbnRlc3QoJ2RhdGFUeXBlIGNhbiBiZSBzcGVjaWZpZWQnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gIC8vIFdIRU5cbiAgbmV3IHNzbS5TdHJpbmdQYXJhbWV0ZXIoc3RhY2ssICdteVBhcmFtJywge1xuICAgIHN0cmluZ1ZhbHVlOiAnbXlWYWx1ZScsXG4gICAgZGF0YVR5cGU6IHNzbS5QYXJhbWV0ZXJEYXRhVHlwZS5BV1NfRUMyX0lNQUdFLFxuICB9KTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlNTTTo6UGFyYW1ldGVyJywge1xuICAgIFZhbHVlOiAnbXlWYWx1ZScsXG4gICAgRGF0YVR5cGU6ICdhd3M6ZWMyOmltYWdlJyxcbiAgfSk7XG59KTtcblxudGVzdCgnZXhwZWN0IFN0cmluZyBTU00gUGFyYW1ldGVyIHRvIGhhdmUgdGllciBwcm9wZXJseSBzZXQnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gIC8vIFdIRU5cbiAgbmV3IHNzbS5TdHJpbmdQYXJhbWV0ZXIoc3RhY2ssICdQYXJhbWV0ZXInLCB7XG4gICAgYWxsb3dlZFBhdHRlcm46ICcuKicsXG4gICAgZGVzY3JpcHRpb246ICdUaGUgdmFsdWUgRm9vJyxcbiAgICBwYXJhbWV0ZXJOYW1lOiAnRm9vUGFyYW1ldGVyJyxcbiAgICBzdHJpbmdWYWx1ZTogJ0ZvbycsXG4gICAgdGllcjogc3NtLlBhcmFtZXRlclRpZXIuQURWQU5DRUQsXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6U1NNOjpQYXJhbWV0ZXInLCB7XG4gICAgVGllcjogJ0FkdmFuY2VkJyxcbiAgfSk7XG59KTtcblxudGVzdCgnU3RyaW5nIFNTTSBQYXJhbWV0ZXIgcmVqZWN0cyBpbnZhbGlkIHZhbHVlcycsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgLy8gVEhFTlxuICBleHBlY3QoKCkgPT4gbmV3IHNzbS5TdHJpbmdQYXJhbWV0ZXIoc3RhY2ssICdQYXJhbWV0ZXInLCB7IGFsbG93ZWRQYXR0ZXJuOiAnXkJhciQnLCBzdHJpbmdWYWx1ZTogJ0Zvb0JhcicgfSkpLnRvVGhyb3coXG4gICAgL2RvZXMgbm90IG1hdGNoIHRoZSBzcGVjaWZpZWQgYWxsb3dlZFBhdHRlcm4vKTtcbn0pO1xuXG50ZXN0KCdTdHJpbmcgU1NNIFBhcmFtZXRlciBhbGxvd3MgdW5yZXNvbHZlZCB0b2tlbnMnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gIC8vIFRIRU5cbiAgZXhwZWN0KCgpID0+IHtcbiAgICBuZXcgc3NtLlN0cmluZ1BhcmFtZXRlcihzdGFjaywgJ1BhcmFtZXRlcicsIHtcbiAgICAgIGFsbG93ZWRQYXR0ZXJuOiAnXkJhciQnLFxuICAgICAgc3RyaW5nVmFsdWU6IGNkay5MYXp5LnN0cmluZyh7IHByb2R1Y2U6ICgpID0+ICdGb28hJyB9KSxcbiAgICB9KTtcbiAgfSkubm90LnRvVGhyb3coKTtcbn0pO1xuXG50ZXN0KCdjcmVhdGluZyBhIFN0cmluZ0xpc3QgU1NNIFBhcmFtZXRlcicsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgLy8gV0hFTlxuICBuZXcgc3NtLlN0cmluZ0xpc3RQYXJhbWV0ZXIoc3RhY2ssICdQYXJhbWV0ZXInLCB7XG4gICAgYWxsb3dlZFBhdHRlcm46ICcoRm9vfEJhciknLFxuICAgIGRlc2NyaXB0aW9uOiAnVGhlIHZhbHVlcyBGb28gYW5kIEJhcicsXG4gICAgcGFyYW1ldGVyTmFtZTogJ0Zvb1BhcmFtZXRlcicsXG4gICAgc3RyaW5nTGlzdFZhbHVlOiBbJ0ZvbycsICdCYXInXSxcbiAgfSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTU006OlBhcmFtZXRlcicsIHtcbiAgICBBbGxvd2VkUGF0dGVybjogJyhGb298QmFyKScsXG4gICAgRGVzY3JpcHRpb246ICdUaGUgdmFsdWVzIEZvbyBhbmQgQmFyJyxcbiAgICBOYW1lOiAnRm9vUGFyYW1ldGVyJyxcbiAgICBUeXBlOiAnU3RyaW5nTGlzdCcsXG4gICAgVmFsdWU6ICdGb28sQmFyJyxcbiAgfSk7XG59KTtcblxudGVzdCgnU3RyaW5nIFNTTSBQYXJhbWV0ZXIgdGhyb3dzIG9uIGxvbmcgZGVzY3JpcHRpb25zJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAvLyBUSEVOXG4gIGV4cGVjdCgoKSA9PiB7XG4gICAgbmV3IHNzbS5TdHJpbmdQYXJhbWV0ZXIoc3RhY2ssICdQYXJhbWV0ZXInLCB7XG4gICAgICBzdHJpbmdWYWx1ZTogJ0ZvbycsXG4gICAgICBkZXNjcmlwdGlvbjogJzEwMjQrIGNoYXJhY3RlciBsb25nIGRlc2NyaXB0aW9uOiBMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dWVyIGFkaXBpc2NpbmcgZWxpdC4gXFxcbiAgICAgIEFlbmVhbiBjb21tb2RvIGxpZ3VsYSBlZ2V0IGRvbG9yLiBBZW5lYW4gbWFzc2EuIEN1bSBzb2NpaXMgbmF0b3F1ZSBwZW5hdGlidXMgZXQgbWFnbmlzIGRpcyBwYXJ0dXJpZW50IG1vbnRlcywgXFxcbiAgICAgIG5hc2NldHVyIHJpZGljdWx1cyBtdXMuIERvbmVjIHF1YW0gZmVsaXMsIHVsdHJpY2llcyBuZWMsIHBlbGxlbnRlc3F1ZSBldSwgcHJldGl1bSBxdWlzLCBzZW0uIE51bGxhIGNvbnNlcXVhdCBcXFxuICAgICAgbWFzc2EgcXVpcyBlbmltLiBEb25lYyBwZWRlIGp1c3RvLCBmcmluZ2lsbGEgdmVsLCBhbGlxdWV0IG5lYywgdnVscHV0YXRlIGVnZXQsIGFyY3UuIEluIGVuaW0ganVzdG8sIHJob25jdXMgdXQsIFxcXG4gICAgICBpbXBlcmRpZXQgYSwgdmVuZW5hdGlzIHZpdGFlLCBqdXN0by4gTnVsbGFtIGRpY3R1bSBmZWxpcyBldSBwZWRlIG1vbGxpcyBwcmV0aXVtLiBJbnRlZ2VyIHRpbmNpZHVudC4gQ3JhcyBkYXBpYnVzLiBcXFxuICAgICAgVml2YW11cyBlbGVtZW50dW0gc2VtcGVyIG5pc2kuIEFlbmVhbiB2dWxwdXRhdGUgZWxlaWZlbmQgdGVsbHVzLiBBZW5lYW4gbGVvIGxpZ3VsYSwgcG9ydHRpdG9yIGV1LCBjb25zZXF1YXQgdml0YWUsIFxcXG4gICAgICBlbGVpZmVuZCBhYywgZW5pbS4gQWxpcXVhbSBsb3JlbSBhbnRlLCBkYXBpYnVzIGluLCB2aXZlcnJhIHF1aXMsIGZldWdpYXQgYSwgdGVsbHVzLiBQaGFzZWxsdXMgdml2ZXJyYSBudWxsYSB1dCBtZXR1cyBcXFxuICAgICAgdmFyaXVzIGxhb3JlZXQuIFF1aXNxdWUgcnV0cnVtLiBBZW5lYW4gaW1wZXJkaWV0LiBFdGlhbSB1bHRyaWNpZXMgbmlzaSB2ZWwgYXVndWUuIEN1cmFiaXR1ciB1bGxhbWNvcnBlciB1bHRyaWNpZXMgbmlzaS4gXFxcbiAgICAgIE5hbSBlZ2V0IGR1aS4gRXRpYW0gcmhvbmN1cy4gTWFlY2VuYXMgdGVtcHVzLCB0ZWxsdXMgZWdldCBjb25kaW1lbnR1bSByaG9uY3VzLCBzZW0gcXVhbSBzZW1wZXIgbGliZXJvLCBzaXQgYW1ldCBhZGlwaXNjaW5nIFxcXG4gICAgICBzZW0gbmVxdWUgc2VkIGlwc3VtLicsXG4gICAgfSk7XG4gIH0pLnRvVGhyb3coL0Rlc2NyaXB0aW9uIGNhbm5vdCBiZSBsb25nZXIgdGhhbiAxMDI0IGNoYXJhY3RlcnMuLyk7XG59KTtcblxudGVzdCgnU3RyaW5nIFNTTSBQYXJhbWV0ZXIgdGhyb3dzIG9uIGxvbmcgbmFtZXMnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gIC8vIFRIRU5cbiAgZXhwZWN0KCgpID0+IHtcbiAgICBuZXcgc3NtLlN0cmluZ1BhcmFtZXRlcihzdGFjaywgJ1BhcmFtZXRlcicsIHtcbiAgICAgIHN0cmluZ1ZhbHVlOiAnRm9vJyxcbiAgICAgIHBhcmFtZXRlck5hbWU6ICcyMDQ4KyBjaGFyYWN0ZXIgbG9uZyBuYW1lOiBMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dWVyIGFkaXBpc2NpbmcgZWxpdC4gXFxcbiAgICAgIEFlbmVhbiBjb21tb2RvIGxpZ3VsYSBlZ2V0IGRvbG9yLiBBZW5lYW4gbWFzc2EuIEN1bSBzb2NpaXMgbmF0b3F1ZSBwZW5hdGlidXMgZXQgbWFnbmlzIGRpcyBwYXJ0dXJpZW50IG1vbnRlcywgXFxcbiAgICAgIG5hc2NldHVyIHJpZGljdWx1cyBtdXMuIERvbmVjIHF1YW0gZmVsaXMsIHVsdHJpY2llcyBuZWMsIHBlbGxlbnRlc3F1ZSBldSwgcHJldGl1bSBxdWlzLCBzZW0uIE51bGxhIGNvbnNlcXVhdCBcXFxuICAgICAgbWFzc2EgcXVpcyBlbmltLiBEb25lYyBwZWRlIGp1c3RvLCBmcmluZ2lsbGEgdmVsLCBhbGlxdWV0IG5lYywgdnVscHV0YXRlIGVnZXQsIGFyY3UuIEluIGVuaW0ganVzdG8sIHJob25jdXMgdXQsIFxcXG4gICAgICBpbXBlcmRpZXQgYSwgdmVuZW5hdGlzIHZpdGFlLCBqdXN0by4gTnVsbGFtIGRpY3R1bSBmZWxpcyBldSBwZWRlIG1vbGxpcyBwcmV0aXVtLiBJbnRlZ2VyIHRpbmNpZHVudC4gQ3JhcyBkYXBpYnVzLiBcXFxuICAgICAgVml2YW11cyBlbGVtZW50dW0gc2VtcGVyIG5pc2kuIEFlbmVhbiB2dWxwdXRhdGUgZWxlaWZlbmQgdGVsbHVzLiBBZW5lYW4gbGVvIGxpZ3VsYSwgcG9ydHRpdG9yIGV1LCBjb25zZXF1YXQgdml0YWUsIFxcXG4gICAgICBlbGVpZmVuZCBhYywgZW5pbS4gQWxpcXVhbSBsb3JlbSBhbnRlLCBkYXBpYnVzIGluLCB2aXZlcnJhIHF1aXMsIGZldWdpYXQgYSwgdGVsbHVzLiBQaGFzZWxsdXMgdml2ZXJyYSBudWxsYSB1dCBtZXR1cyBcXFxuICAgICAgdmFyaXVzIGxhb3JlZXQuIFF1aXNxdWUgcnV0cnVtLiBBZW5lYW4gaW1wZXJkaWV0LiBFdGlhbSB1bHRyaWNpZXMgbmlzaSB2ZWwgYXVndWUuIEN1cmFiaXR1ciB1bGxhbWNvcnBlciB1bHRyaWNpZXMgbmlzaS4gXFxcbiAgICAgIE5hbSBlZ2V0IGR1aS4gRXRpYW0gcmhvbmN1cy4gTWFlY2VuYXMgdGVtcHVzLCB0ZWxsdXMgZWdldCBjb25kaW1lbnR1bSByaG9uY3VzLCBzZW0gcXVhbSBzZW1wZXIgbGliZXJvLCBzaXQgYW1ldCBhZGlwaXNjaW5nIFxcXG4gICAgICBzZW0gbmVxdWUgc2VkIGlwc3VtLiBMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dWVyIGFkaXBpc2NpbmcgZWxpdC4gXFxcbiAgICAgIEFlbmVhbiBjb21tb2RvIGxpZ3VsYSBlZ2V0IGRvbG9yLiBBZW5lYW4gbWFzc2EuIEN1bSBzb2NpaXMgbmF0b3F1ZSBwZW5hdGlidXMgZXQgbWFnbmlzIGRpcyBwYXJ0dXJpZW50IG1vbnRlcywgXFxcbiAgICAgIG5hc2NldHVyIHJpZGljdWx1cyBtdXMuIERvbmVjIHF1YW0gZmVsaXMsIHVsdHJpY2llcyBuZWMsIHBlbGxlbnRlc3F1ZSBldSwgcHJldGl1bSBxdWlzLCBzZW0uIE51bGxhIGNvbnNlcXVhdCBcXFxuICAgICAgbWFzc2EgcXVpcyBlbmltLiBEb25lYyBwZWRlIGp1c3RvLCBmcmluZ2lsbGEgdmVsLCBhbGlxdWV0IG5lYywgdnVscHV0YXRlIGVnZXQsIGFyY3UuIEluIGVuaW0ganVzdG8sIHJob25jdXMgdXQsIFxcXG4gICAgICBpbXBlcmRpZXQgYSwgdmVuZW5hdGlzIHZpdGFlLCBqdXN0by4gTnVsbGFtIGRpY3R1bSBmZWxpcyBldSBwZWRlIG1vbGxpcyBwcmV0aXVtLiBJbnRlZ2VyIHRpbmNpZHVudC4gQ3JhcyBkYXBpYnVzLiBcXFxuICAgICAgVml2YW11cyBlbGVtZW50dW0gc2VtcGVyIG5pc2kuIEFlbmVhbiB2dWxwdXRhdGUgZWxlaWZlbmQgdGVsbHVzLiBBZW5lYW4gbGVvIGxpZ3VsYSwgcG9ydHRpdG9yIGV1LCBjb25zZXF1YXQgdml0YWUsIFxcXG4gICAgICBlbGVpZmVuZCBhYywgZW5pbS4gQWxpcXVhbSBsb3JlbSBhbnRlLCBkYXBpYnVzIGluLCB2aXZlcnJhIHF1aXMsIGZldWdpYXQgYSwgdGVsbHVzLiBQaGFzZWxsdXMgdml2ZXJyYSBudWxsYSB1dCBtZXR1cyBcXFxuICAgICAgdmFyaXVzIGxhb3JlZXQuIFF1aXNxdWUgcnV0cnVtLiBBZW5lYW4gaW1wZXJkaWV0LiBFdGlhbSB1bHRyaWNpZXMgbmlzaSB2ZWwgYXVndWUuIEN1cmFiaXR1ciB1bGxhbWNvcnBlciB1bHRyaWNpZXMgbmlzaS4gXFxcbiAgICAgIE5hbSBlZ2V0IGR1aS4gRXRpYW0gcmhvbmN1cy4gTWFlY2VuYXMgdGVtcHVzLCB0ZWxsdXMgZWdldCBjb25kaW1lbnR1bSByaG9uY3VzLCBzZW0gcXVhbSBzZW1wZXIgbGliZXJvLCBzaXQgYW1ldCBhZGlwaXNjaW5nIFxcXG4gICAgICBzZW0gbmVxdWUgc2VkIGlwc3VtLicsXG4gICAgfSk7XG4gIH0pLnRvVGhyb3coL25hbWUgY2Fubm90IGJlIGxvbmdlciB0aGFuIDIwNDggY2hhcmFjdGVycy4vKTtcbn0pO1xuXG50ZXN0LmVhY2goW1xuICAnL3BhcmFtZXRlci93aXRoIHNwYWNlcycsXG4gICdjaGFyYWN0ZXJzT3RoZXJUaGFuXmFsbG93ZWQnLFxuICAndHJ5aW5nO3RoaXMnLFxuXSkoJ1N0cmluZyBTU00gUGFyYW1ldGVyIHRocm93cyBvbiBpbnZhbGlkIG5hbWUgJXMnLCAocGFyYW1ldGVyTmFtZSkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAvLyBUSEVOXG4gIGV4cGVjdCgoKSA9PiB7XG4gICAgbmV3IHNzbS5TdHJpbmdQYXJhbWV0ZXIoc3RhY2ssICdQYXJhbWV0ZXInLCB7IHN0cmluZ1ZhbHVlOiAnRm9vJywgcGFyYW1ldGVyTmFtZSB9KTtcbiAgfSkudG9UaHJvdygvbmFtZSBtdXN0IG9ubHkgY29udGFpbiBsZXR0ZXJzLCBudW1iZXJzLCBhbmQgdGhlIGZvbGxvd2luZyA0IHN5bWJvbHMuKi8pO1xufSk7XG5cbnRlc3QoJ1N0cmluZ0xpc3QgU1NNIFBhcmFtZXRlciB0aHJvd3Mgb24gbG9uZyBkZXNjcmlwdGlvbnMnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gIC8vIFRIRU5cbiAgZXhwZWN0KCgpID0+IHtcbiAgICBuZXcgc3NtLlN0cmluZ0xpc3RQYXJhbWV0ZXIoc3RhY2ssICdQYXJhbWV0ZXInLCB7XG4gICAgICBzdHJpbmdMaXN0VmFsdWU6IFsnRm9vJywgJ0JhciddLFxuICAgICAgZGVzY3JpcHRpb246ICcxMDI0KyBjaGFyYWN0ZXIgbG9uZyBkZXNjcmlwdGlvbjogTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVlciBhZGlwaXNjaW5nIGVsaXQuIFxcXG4gICAgICBBZW5lYW4gY29tbW9kbyBsaWd1bGEgZWdldCBkb2xvci4gQWVuZWFuIG1hc3NhLiBDdW0gc29jaWlzIG5hdG9xdWUgcGVuYXRpYnVzIGV0IG1hZ25pcyBkaXMgcGFydHVyaWVudCBtb250ZXMsIFxcXG4gICAgICBuYXNjZXR1ciByaWRpY3VsdXMgbXVzLiBEb25lYyBxdWFtIGZlbGlzLCB1bHRyaWNpZXMgbmVjLCBwZWxsZW50ZXNxdWUgZXUsIHByZXRpdW0gcXVpcywgc2VtLiBOdWxsYSBjb25zZXF1YXQgXFxcbiAgICAgIG1hc3NhIHF1aXMgZW5pbS4gRG9uZWMgcGVkZSBqdXN0bywgZnJpbmdpbGxhIHZlbCwgYWxpcXVldCBuZWMsIHZ1bHB1dGF0ZSBlZ2V0LCBhcmN1LiBJbiBlbmltIGp1c3RvLCByaG9uY3VzIHV0LCBcXFxuICAgICAgaW1wZXJkaWV0IGEsIHZlbmVuYXRpcyB2aXRhZSwganVzdG8uIE51bGxhbSBkaWN0dW0gZmVsaXMgZXUgcGVkZSBtb2xsaXMgcHJldGl1bS4gSW50ZWdlciB0aW5jaWR1bnQuIENyYXMgZGFwaWJ1cy4gXFxcbiAgICAgIFZpdmFtdXMgZWxlbWVudHVtIHNlbXBlciBuaXNpLiBBZW5lYW4gdnVscHV0YXRlIGVsZWlmZW5kIHRlbGx1cy4gQWVuZWFuIGxlbyBsaWd1bGEsIHBvcnR0aXRvciBldSwgY29uc2VxdWF0IHZpdGFlLCBcXFxuICAgICAgZWxlaWZlbmQgYWMsIGVuaW0uIEFsaXF1YW0gbG9yZW0gYW50ZSwgZGFwaWJ1cyBpbiwgdml2ZXJyYSBxdWlzLCBmZXVnaWF0IGEsIHRlbGx1cy4gUGhhc2VsbHVzIHZpdmVycmEgbnVsbGEgdXQgbWV0dXMgXFxcbiAgICAgIHZhcml1cyBsYW9yZWV0LiBRdWlzcXVlIHJ1dHJ1bS4gQWVuZWFuIGltcGVyZGlldC4gRXRpYW0gdWx0cmljaWVzIG5pc2kgdmVsIGF1Z3VlLiBDdXJhYml0dXIgdWxsYW1jb3JwZXIgdWx0cmljaWVzIG5pc2kuIFxcXG4gICAgICBOYW0gZWdldCBkdWkuIEV0aWFtIHJob25jdXMuIE1hZWNlbmFzIHRlbXB1cywgdGVsbHVzIGVnZXQgY29uZGltZW50dW0gcmhvbmN1cywgc2VtIHF1YW0gc2VtcGVyIGxpYmVybywgc2l0IGFtZXQgYWRpcGlzY2luZyBcXFxuICAgICAgc2VtIG5lcXVlIHNlZCBpcHN1bS4nLFxuICAgIH0pO1xuICB9KS50b1Rocm93KC9EZXNjcmlwdGlvbiBjYW5ub3QgYmUgbG9uZ2VyIHRoYW4gMTAyNCBjaGFyYWN0ZXJzLi8pO1xufSk7XG5cbnRlc3QoJ1N0cmluZ0xpc3QgU1NNIFBhcmFtZXRlciB0aHJvd3Mgb24gbG9uZyBuYW1lcycsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgLy8gVEhFTlxuICBleHBlY3QoKCkgPT4ge1xuICAgIG5ldyBzc20uU3RyaW5nTGlzdFBhcmFtZXRlcihzdGFjaywgJ1BhcmFtZXRlcicsIHtcbiAgICAgIHN0cmluZ0xpc3RWYWx1ZTogWydGb28nLCAnQmFyJ10sXG4gICAgICBwYXJhbWV0ZXJOYW1lOiAnMjA0OCsgY2hhcmFjdGVyIGxvbmcgbmFtZTogTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVlciBhZGlwaXNjaW5nIGVsaXQuIFxcXG4gICAgICBBZW5lYW4gY29tbW9kbyBsaWd1bGEgZWdldCBkb2xvci4gQWVuZWFuIG1hc3NhLiBDdW0gc29jaWlzIG5hdG9xdWUgcGVuYXRpYnVzIGV0IG1hZ25pcyBkaXMgcGFydHVyaWVudCBtb250ZXMsIFxcXG4gICAgICBuYXNjZXR1ciByaWRpY3VsdXMgbXVzLiBEb25lYyBxdWFtIGZlbGlzLCB1bHRyaWNpZXMgbmVjLCBwZWxsZW50ZXNxdWUgZXUsIHByZXRpdW0gcXVpcywgc2VtLiBOdWxsYSBjb25zZXF1YXQgXFxcbiAgICAgIG1hc3NhIHF1aXMgZW5pbS4gRG9uZWMgcGVkZSBqdXN0bywgZnJpbmdpbGxhIHZlbCwgYWxpcXVldCBuZWMsIHZ1bHB1dGF0ZSBlZ2V0LCBhcmN1LiBJbiBlbmltIGp1c3RvLCByaG9uY3VzIHV0LCBcXFxuICAgICAgaW1wZXJkaWV0IGEsIHZlbmVuYXRpcyB2aXRhZSwganVzdG8uIE51bGxhbSBkaWN0dW0gZmVsaXMgZXUgcGVkZSBtb2xsaXMgcHJldGl1bS4gSW50ZWdlciB0aW5jaWR1bnQuIENyYXMgZGFwaWJ1cy4gXFxcbiAgICAgIFZpdmFtdXMgZWxlbWVudHVtIHNlbXBlciBuaXNpLiBBZW5lYW4gdnVscHV0YXRlIGVsZWlmZW5kIHRlbGx1cy4gQWVuZWFuIGxlbyBsaWd1bGEsIHBvcnR0aXRvciBldSwgY29uc2VxdWF0IHZpdGFlLCBcXFxuICAgICAgZWxlaWZlbmQgYWMsIGVuaW0uIEFsaXF1YW0gbG9yZW0gYW50ZSwgZGFwaWJ1cyBpbiwgdml2ZXJyYSBxdWlzLCBmZXVnaWF0IGEsIHRlbGx1cy4gUGhhc2VsbHVzIHZpdmVycmEgbnVsbGEgdXQgbWV0dXMgXFxcbiAgICAgIHZhcml1cyBsYW9yZWV0LiBRdWlzcXVlIHJ1dHJ1bS4gQWVuZWFuIGltcGVyZGlldC4gRXRpYW0gdWx0cmljaWVzIG5pc2kgdmVsIGF1Z3VlLiBDdXJhYml0dXIgdWxsYW1jb3JwZXIgdWx0cmljaWVzIG5pc2kuIFxcXG4gICAgICBOYW0gZWdldCBkdWkuIEV0aWFtIHJob25jdXMuIE1hZWNlbmFzIHRlbXB1cywgdGVsbHVzIGVnZXQgY29uZGltZW50dW0gcmhvbmN1cywgc2VtIHF1YW0gc2VtcGVyIGxpYmVybywgc2l0IGFtZXQgYWRpcGlzY2luZyBcXFxuICAgICAgc2VtIG5lcXVlIHNlZCBpcHN1bS4gTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVlciBhZGlwaXNjaW5nIGVsaXQuIFxcXG4gICAgICBBZW5lYW4gY29tbW9kbyBsaWd1bGEgZWdldCBkb2xvci4gQWVuZWFuIG1hc3NhLiBDdW0gc29jaWlzIG5hdG9xdWUgcGVuYXRpYnVzIGV0IG1hZ25pcyBkaXMgcGFydHVyaWVudCBtb250ZXMsIFxcXG4gICAgICBuYXNjZXR1ciByaWRpY3VsdXMgbXVzLiBEb25lYyBxdWFtIGZlbGlzLCB1bHRyaWNpZXMgbmVjLCBwZWxsZW50ZXNxdWUgZXUsIHByZXRpdW0gcXVpcywgc2VtLiBOdWxsYSBjb25zZXF1YXQgXFxcbiAgICAgIG1hc3NhIHF1aXMgZW5pbS4gRG9uZWMgcGVkZSBqdXN0bywgZnJpbmdpbGxhIHZlbCwgYWxpcXVldCBuZWMsIHZ1bHB1dGF0ZSBlZ2V0LCBhcmN1LiBJbiBlbmltIGp1c3RvLCByaG9uY3VzIHV0LCBcXFxuICAgICAgaW1wZXJkaWV0IGEsIHZlbmVuYXRpcyB2aXRhZSwganVzdG8uIE51bGxhbSBkaWN0dW0gZmVsaXMgZXUgcGVkZSBtb2xsaXMgcHJldGl1bS4gSW50ZWdlciB0aW5jaWR1bnQuIENyYXMgZGFwaWJ1cy4gXFxcbiAgICAgIFZpdmFtdXMgZWxlbWVudHVtIHNlbXBlciBuaXNpLiBBZW5lYW4gdnVscHV0YXRlIGVsZWlmZW5kIHRlbGx1cy4gQWVuZWFuIGxlbyBsaWd1bGEsIHBvcnR0aXRvciBldSwgY29uc2VxdWF0IHZpdGFlLCBcXFxuICAgICAgZWxlaWZlbmQgYWMsIGVuaW0uIEFsaXF1YW0gbG9yZW0gYW50ZSwgZGFwaWJ1cyBpbiwgdml2ZXJyYSBxdWlzLCBmZXVnaWF0IGEsIHRlbGx1cy4gUGhhc2VsbHVzIHZpdmVycmEgbnVsbGEgdXQgbWV0dXMgXFxcbiAgICAgIHZhcml1cyBsYW9yZWV0LiBRdWlzcXVlIHJ1dHJ1bS4gQWVuZWFuIGltcGVyZGlldC4gRXRpYW0gdWx0cmljaWVzIG5pc2kgdmVsIGF1Z3VlLiBDdXJhYml0dXIgdWxsYW1jb3JwZXIgdWx0cmljaWVzIG5pc2kuIFxcXG4gICAgICBOYW0gZWdldCBkdWkuIEV0aWFtIHJob25jdXMuIE1hZWNlbmFzIHRlbXB1cywgdGVsbHVzIGVnZXQgY29uZGltZW50dW0gcmhvbmN1cywgc2VtIHF1YW0gc2VtcGVyIGxpYmVybywgc2l0IGFtZXQgYWRpcGlzY2luZyBcXFxuICAgICAgc2VtIG5lcXVlIHNlZCBpcHN1bS4nLFxuICAgIH0pO1xuICB9KS50b1Rocm93KC9uYW1lIGNhbm5vdCBiZSBsb25nZXIgdGhhbiAyMDQ4IGNoYXJhY3RlcnMuLyk7XG59KTtcblxudGVzdC5lYWNoKFtcbiAgJy9wYXJhbWV0ZXIvd2l0aCBzcGFjZXMnLFxuICAnY2hhcmFjdGVyc090aGVyVGhhbl5hbGxvd2VkJyxcbiAgJ3RyeWluZzt0aGlzJyxcbl0pKCdTdHJpbmdMaXN0IFNTTSBQYXJhbWV0ZXIgdGhyb3dzIG9uIGludmFsaWQgbmFtZSAlcycsIChwYXJhbWV0ZXJOYW1lKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gIC8vIFRIRU5cbiAgZXhwZWN0KCgpID0+IHtcbiAgICBuZXcgc3NtLlN0cmluZ0xpc3RQYXJhbWV0ZXIoc3RhY2ssICdQYXJhbWV0ZXInLCB7IHN0cmluZ0xpc3RWYWx1ZTogWydGb28nXSwgcGFyYW1ldGVyTmFtZSB9KTtcbiAgfSkudG9UaHJvdygvbmFtZSBtdXN0IG9ubHkgY29udGFpbiBsZXR0ZXJzLCBudW1iZXJzLCBhbmQgdGhlIGZvbGxvd2luZyA0IHN5bWJvbHMuKi8pO1xufSk7XG5cbnRlc3QoJ1N0cmluZ0xpc3QgU1NNIFBhcmFtZXRlciB2YWx1ZXMgY2Fubm90IGNvbnRhaW4gY29tbWFzJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAvLyBUSEVOXG4gIGV4cGVjdCgoKSA9PiBuZXcgc3NtLlN0cmluZ0xpc3RQYXJhbWV0ZXIoc3RhY2ssICdQYXJhbWV0ZXInLCB7IHN0cmluZ0xpc3RWYWx1ZTogWydGb28sQmFyJ10gfSkpLnRvVGhyb3coXG4gICAgL2Nhbm5vdCBjb250YWluIHRoZSAnLCcgY2hhcmFjdGVyLyk7XG59KTtcblxudGVzdCgnU3RyaW5nTGlzdCBTU00gUGFyYW1ldGVyIHJlamVjdHMgaW52YWxpZCB2YWx1ZXMnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gIC8vIFRIRU5cbiAgZXhwZWN0KCgpID0+IG5ldyBzc20uU3RyaW5nTGlzdFBhcmFtZXRlcihzdGFjaywgJ1BhcmFtZXRlcicsIHsgYWxsb3dlZFBhdHRlcm46ICdeKEZvb3xCYXIpJCcsIHN0cmluZ0xpc3RWYWx1ZTogWydGb28nLCAnRm9vQmFyJ10gfSkpLnRvVGhyb3coXG4gICAgL2RvZXMgbm90IG1hdGNoIHRoZSBzcGVjaWZpZWQgYWxsb3dlZFBhdHRlcm4vKTtcbn0pO1xuXG50ZXN0KCdTdHJpbmdMaXN0IFNTTSBQYXJhbWV0ZXIgYWxsb3dzIHVucmVzb2x2ZWQgdG9rZW5zJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAvLyBUSEVOXG4gIGV4cGVjdCgoKSA9PiBuZXcgc3NtLlN0cmluZ0xpc3RQYXJhbWV0ZXIoc3RhY2ssICdQYXJhbWV0ZXInLCB7XG4gICAgYWxsb3dlZFBhdHRlcm46ICdeKEZvb3xCYXIpJCcsXG4gICAgc3RyaW5nTGlzdFZhbHVlOiBbJ0ZvbycsIGNkay5MYXp5LnN0cmluZyh7IHByb2R1Y2U6ICgpID0+ICdCYXohJyB9KV0sXG4gIH0pKS5ub3QudG9UaHJvdygpO1xufSk7XG5cbnRlc3QoJ3BhcmFtZXRlckFybiBpcyBjcmFmdGVkIGNvcnJlY3RseScsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gIGNvbnN0IHBhcmFtID0gbmV3IHNzbS5TdHJpbmdQYXJhbWV0ZXIoc3RhY2ssICdQYXJhbWV0ZXInLCB7IHN0cmluZ1ZhbHVlOiAnRm9vJyB9KTtcblxuICAvLyBUSEVOXG4gIGV4cGVjdChzdGFjay5yZXNvbHZlKHBhcmFtLnBhcmFtZXRlckFybikpLnRvRXF1YWwoe1xuICAgICdGbjo6Sm9pbic6IFsnJywgW1xuICAgICAgJ2FybjonLFxuICAgICAgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSxcbiAgICAgICc6c3NtOicsXG4gICAgICB7IFJlZjogJ0FXUzo6UmVnaW9uJyB9LFxuICAgICAgJzonLFxuICAgICAgeyBSZWY6ICdBV1M6OkFjY291bnRJZCcgfSxcbiAgICAgICc6cGFyYW1ldGVyLycsXG4gICAgICB7IFJlZjogJ1BhcmFtZXRlcjlFMUI0RkJBJyB9LFxuICAgIF1dLFxuICB9KTtcbn0pO1xuXG50ZXN0KCdwYXJhbWV0ZXJOYW1lIHRoYXQgaW5jbHVkZXMgYSBcIi9cIiBtdXN0IGJlIGZ1bGx5IHF1YWxpZmllZCAoaS5lLiBiZWdpbiB3aXRoIFwiL1wiKSBhcyB3ZWxsJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAvLyBUSEVOXG4gIGV4cGVjdCgoKSA9PiBuZXcgc3NtLlN0cmluZ1BhcmFtZXRlcihzdGFjaywgJ215UGFyYW0nLCB7XG4gICAgc3RyaW5nVmFsdWU6ICdteVZhbHVlJyxcbiAgICBwYXJhbWV0ZXJOYW1lOiAncGF0aC90by9wYXJhbWV0ZXInLFxuICB9KSkudG9UaHJvdygvUGFyYW1ldGVyIG5hbWVzIG11c3QgYmUgZnVsbHkgcXVhbGlmaWVkLyk7XG5cbiAgZXhwZWN0KCgpID0+IG5ldyBzc20uU3RyaW5nTGlzdFBhcmFtZXRlcihzdGFjaywgJ215UGFyYW0yJywge1xuICAgIHN0cmluZ0xpc3RWYWx1ZTogWydmb28nLCAnYmFyJ10sXG4gICAgcGFyYW1ldGVyTmFtZTogJ3BhdGgvdG8vcGFyYW1ldGVyMicsXG4gIH0pKS50b1Rocm93KC9QYXJhbWV0ZXIgbmFtZXMgbXVzdCBiZSBmdWxseSBxdWFsaWZpZWQgXFwoaWYgdGhleSBpbmNsdWRlIFxcXCJcXC9cXFwiIHRoZXkgbXVzdCBhbHNvIGJlZ2luIHdpdGggYSBcXFwiXFwvXFxcIlxcKVxcOiBwYXRoXFwvdG9cXC9wYXJhbWV0ZXIyLyk7XG59KTtcblxudGVzdCgnU3RyaW5nUGFyYW1ldGVyLmZyb21TdHJpbmdQYXJhbWV0ZXJOYW1lJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAvLyBXSEVOXG4gIGNvbnN0IHBhcmFtID0gc3NtLlN0cmluZ1BhcmFtZXRlci5mcm9tU3RyaW5nUGFyYW1ldGVyTmFtZShzdGFjaywgJ015UGFyYW1OYW1lJywgJ015UGFyYW1OYW1lJyk7XG5cbiAgLy8gVEhFTlxuICBleHBlY3Qoc3RhY2sucmVzb2x2ZShwYXJhbS5wYXJhbWV0ZXJBcm4pKS50b0VxdWFsKHtcbiAgICAnRm46OkpvaW4nOiBbJycsIFtcbiAgICAgICdhcm46JyxcbiAgICAgIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sXG4gICAgICAnOnNzbTonLFxuICAgICAgeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICc6JyxcbiAgICAgIHsgUmVmOiAnQVdTOjpBY2NvdW50SWQnIH0sXG4gICAgICAnOnBhcmFtZXRlci9NeVBhcmFtTmFtZScsXG4gICAgXV0sXG4gIH0pO1xuICBleHBlY3Qoc3RhY2sucmVzb2x2ZShwYXJhbS5wYXJhbWV0ZXJOYW1lKSkudG9FcXVhbCgnTXlQYXJhbU5hbWUnKTtcbiAgZXhwZWN0KHN0YWNrLnJlc29sdmUocGFyYW0ucGFyYW1ldGVyVHlwZSkpLnRvRXF1YWwoJ1N0cmluZycpO1xuICBleHBlY3Qoc3RhY2sucmVzb2x2ZShwYXJhbS5zdHJpbmdWYWx1ZSkpLnRvRXF1YWwoeyBSZWY6ICdNeVBhcmFtTmFtZVBhcmFtZXRlcicgfSk7XG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICBQYXJhbWV0ZXJzOiB7XG4gICAgICBNeVBhcmFtTmFtZVBhcmFtZXRlcjoge1xuICAgICAgICBUeXBlOiAnQVdTOjpTU006OlBhcmFtZXRlcjo6VmFsdWU8U3RyaW5nPicsXG4gICAgICAgIERlZmF1bHQ6ICdNeVBhcmFtTmFtZScsXG4gICAgICB9LFxuICAgIH0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ1N0cmluZ1BhcmFtZXRlci5mcm9tU3RyaW5nUGFyYW1ldGVyQXR0cmlidXRlcycsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgLy8gV0hFTlxuICBjb25zdCBwYXJhbSA9IHNzbS5TdHJpbmdQYXJhbWV0ZXIuZnJvbVN0cmluZ1BhcmFtZXRlckF0dHJpYnV0ZXMoc3RhY2ssICdNeVBhcmFtTmFtZScsIHtcbiAgICBwYXJhbWV0ZXJOYW1lOiAnTXlQYXJhbU5hbWUnLFxuICAgIHZlcnNpb246IDIsXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgZXhwZWN0KHN0YWNrLnJlc29sdmUocGFyYW0ucGFyYW1ldGVyQXJuKSkudG9FcXVhbCh7XG4gICAgJ0ZuOjpKb2luJzogWycnLCBbXG4gICAgICAnYXJuOicsXG4gICAgICB7IFJlZjogJ0FXUzo6UGFydGl0aW9uJyB9LFxuICAgICAgJzpzc206JyxcbiAgICAgIHsgUmVmOiAnQVdTOjpSZWdpb24nIH0sXG4gICAgICAnOicsXG4gICAgICB7IFJlZjogJ0FXUzo6QWNjb3VudElkJyB9LFxuICAgICAgJzpwYXJhbWV0ZXIvTXlQYXJhbU5hbWUnLFxuICAgIF1dLFxuICB9KTtcbiAgZXhwZWN0KHN0YWNrLnJlc29sdmUocGFyYW0ucGFyYW1ldGVyTmFtZSkpLnRvRXF1YWwoJ015UGFyYW1OYW1lJyk7XG4gIGV4cGVjdChzdGFjay5yZXNvbHZlKHBhcmFtLnBhcmFtZXRlclR5cGUpKS50b0VxdWFsKCdTdHJpbmcnKTtcbiAgZXhwZWN0KHN0YWNrLnJlc29sdmUocGFyYW0uc3RyaW5nVmFsdWUpKS50b0VxdWFsKCd7e3Jlc29sdmU6c3NtOk15UGFyYW1OYW1lOjJ9fScpO1xufSk7XG5cbnRlc3QoJ1N0cmluZ1BhcmFtZXRlci5mcm9tU3RyaW5nUGFyYW1ldGVyQXR0cmlidXRlcyB3aXRoIHZlcnNpb24gZnJvbSB0b2tlbicsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgLy8gV0hFTlxuICBjb25zdCBwYXJhbSA9IHNzbS5TdHJpbmdQYXJhbWV0ZXIuZnJvbVN0cmluZ1BhcmFtZXRlckF0dHJpYnV0ZXMoc3RhY2ssICdNeVBhcmFtTmFtZScsIHtcbiAgICBwYXJhbWV0ZXJOYW1lOiAnTXlQYXJhbU5hbWUnLFxuICAgIHZlcnNpb246IGNkay5Ub2tlbi5hc051bWJlcih7IFJlZjogJ3ZlcnNpb24nIH0pLFxuICB9KTtcblxuICAvLyBUSEVOXG4gIGV4cGVjdChzdGFjay5yZXNvbHZlKHBhcmFtLnBhcmFtZXRlckFybikpLnRvRXF1YWwoe1xuICAgICdGbjo6Sm9pbic6IFsnJywgW1xuICAgICAgJ2FybjonLFxuICAgICAgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSxcbiAgICAgICc6c3NtOicsXG4gICAgICB7IFJlZjogJ0FXUzo6UmVnaW9uJyB9LFxuICAgICAgJzonLFxuICAgICAgeyBSZWY6ICdBV1M6OkFjY291bnRJZCcgfSxcbiAgICAgICc6cGFyYW1ldGVyL015UGFyYW1OYW1lJyxcbiAgICBdXSxcbiAgfSk7XG4gIGV4cGVjdChzdGFjay5yZXNvbHZlKHBhcmFtLnBhcmFtZXRlck5hbWUpKS50b0VxdWFsKCdNeVBhcmFtTmFtZScpO1xuICBleHBlY3Qoc3RhY2sucmVzb2x2ZShwYXJhbS5wYXJhbWV0ZXJUeXBlKSkudG9FcXVhbCgnU3RyaW5nJyk7XG4gIGV4cGVjdChzdGFjay5yZXNvbHZlKHBhcmFtLnN0cmluZ1ZhbHVlKSkudG9FcXVhbCh7XG4gICAgJ0ZuOjpKb2luJzogWycnLCBbXG4gICAgICAne3tyZXNvbHZlOnNzbTpNeVBhcmFtTmFtZTonLFxuICAgICAgeyBSZWY6ICd2ZXJzaW9uJyB9LFxuICAgICAgJ319JyxcbiAgICBdXSxcbiAgfSk7XG59KTtcblxudGVzdCgnU3RyaW5nUGFyYW1ldGVyLmZyb21TZWN1cmVTdHJpbmdQYXJhbWV0ZXJBdHRyaWJ1dGVzJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAvLyBXSEVOXG4gIGNvbnN0IHBhcmFtID0gc3NtLlN0cmluZ1BhcmFtZXRlci5mcm9tU2VjdXJlU3RyaW5nUGFyYW1ldGVyQXR0cmlidXRlcyhzdGFjaywgJ015UGFyYW1OYW1lJywge1xuICAgIHBhcmFtZXRlck5hbWU6ICdNeVBhcmFtTmFtZScsXG4gICAgdmVyc2lvbjogMixcbiAgfSk7XG5cbiAgLy8gVEhFTlxuICBleHBlY3Qoc3RhY2sucmVzb2x2ZShwYXJhbS5wYXJhbWV0ZXJBcm4pKS50b0VxdWFsKHtcbiAgICAnRm46OkpvaW4nOiBbJycsIFtcbiAgICAgICdhcm46JyxcbiAgICAgIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sXG4gICAgICAnOnNzbTonLFxuICAgICAgeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICc6JyxcbiAgICAgIHsgUmVmOiAnQVdTOjpBY2NvdW50SWQnIH0sXG4gICAgICAnOnBhcmFtZXRlci9NeVBhcmFtTmFtZScsXG4gICAgXV0sXG4gIH0pO1xuICBleHBlY3Qoc3RhY2sucmVzb2x2ZShwYXJhbS5wYXJhbWV0ZXJOYW1lKSkudG9FcXVhbCgnTXlQYXJhbU5hbWUnKTtcbiAgZXhwZWN0KHN0YWNrLnJlc29sdmUocGFyYW0ucGFyYW1ldGVyVHlwZSkpLnRvRXF1YWwoJ1NlY3VyZVN0cmluZycpO1xuICBleHBlY3Qoc3RhY2sucmVzb2x2ZShwYXJhbS5zdHJpbmdWYWx1ZSkpLnRvRXF1YWwoJ3t7cmVzb2x2ZTpzc20tc2VjdXJlOk15UGFyYW1OYW1lOjJ9fScpO1xufSk7XG5cbnRlc3QoJ1N0cmluZ1BhcmFtZXRlci5mcm9tU2VjdXJlU3RyaW5nUGFyYW1ldGVyQXR0cmlidXRlcyB3aXRoIHZlcnNpb24gZnJvbSB0b2tlbicsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgLy8gV0hFTlxuICBjb25zdCBwYXJhbSA9IHNzbS5TdHJpbmdQYXJhbWV0ZXIuZnJvbVNlY3VyZVN0cmluZ1BhcmFtZXRlckF0dHJpYnV0ZXMoc3RhY2ssICdNeVBhcmFtTmFtZScsIHtcbiAgICBwYXJhbWV0ZXJOYW1lOiAnTXlQYXJhbU5hbWUnLFxuICAgIHZlcnNpb246IGNkay5Ub2tlbi5hc051bWJlcih7IFJlZjogJ3ZlcnNpb24nIH0pLFxuICB9KTtcblxuICAvLyBUSEVOXG4gIGV4cGVjdChzdGFjay5yZXNvbHZlKHBhcmFtLnBhcmFtZXRlckFybikpLnRvRXF1YWwoe1xuICAgICdGbjo6Sm9pbic6IFsnJywgW1xuICAgICAgJ2FybjonLFxuICAgICAgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSxcbiAgICAgICc6c3NtOicsXG4gICAgICB7IFJlZjogJ0FXUzo6UmVnaW9uJyB9LFxuICAgICAgJzonLFxuICAgICAgeyBSZWY6ICdBV1M6OkFjY291bnRJZCcgfSxcbiAgICAgICc6cGFyYW1ldGVyL015UGFyYW1OYW1lJyxcbiAgICBdXSxcbiAgfSk7XG4gIGV4cGVjdChzdGFjay5yZXNvbHZlKHBhcmFtLnBhcmFtZXRlck5hbWUpKS50b0VxdWFsKCdNeVBhcmFtTmFtZScpO1xuICBleHBlY3Qoc3RhY2sucmVzb2x2ZShwYXJhbS5wYXJhbWV0ZXJUeXBlKSkudG9FcXVhbCgnU2VjdXJlU3RyaW5nJyk7XG4gIGV4cGVjdChzdGFjay5yZXNvbHZlKHBhcmFtLnN0cmluZ1ZhbHVlKSkudG9FcXVhbCh7XG4gICAgJ0ZuOjpKb2luJzogWycnLCBbXG4gICAgICAne3tyZXNvbHZlOnNzbS1zZWN1cmU6TXlQYXJhbU5hbWU6JyxcbiAgICAgIHsgUmVmOiAndmVyc2lvbicgfSxcbiAgICAgICd9fScsXG4gICAgXV0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ1N0cmluZ1BhcmFtZXRlci5mcm9tU2VjdXJlU3RyaW5nUGFyYW1ldGVyQXR0cmlidXRlcyB3aXRoIGVuY3J5cHRpb24ga2V5IGNyZWF0ZXMgdGhlIGNvcnJlY3QgcG9saWN5IGZvciBncmFudFJlYWQnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICBjb25zdCBrZXkgPSBrbXMuS2V5LmZyb21LZXlBcm4oc3RhY2ssICdDdXN0b21LZXknLCAnYXJuOmF3czprbXM6dXMtZWFzdC0xOjEyMzQ1Njc4OTAxMjprZXkveHl6Jyk7XG4gIGNvbnN0IHJvbGUgPSBuZXcgaWFtLlJvbGUoc3RhY2ssICdSb2xlJywge1xuICAgIGFzc3VtZWRCeTogbmV3IGlhbS5BY2NvdW50Um9vdFByaW5jaXBhbCgpLFxuICB9KTtcblxuICAvLyBXSEVOXG4gIGNvbnN0IHBhcmFtID0gc3NtLlN0cmluZ1BhcmFtZXRlci5mcm9tU2VjdXJlU3RyaW5nUGFyYW1ldGVyQXR0cmlidXRlcyhzdGFjaywgJ015UGFyYW1OYW1lJywge1xuICAgIHBhcmFtZXRlck5hbWU6ICdNeVBhcmFtTmFtZScsXG4gICAgdmVyc2lvbjogMixcbiAgICBlbmNyeXB0aW9uS2V5OiBrZXksXG4gIH0pO1xuICBwYXJhbS5ncmFudFJlYWQocm9sZSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgIHtcbiAgICAgICAgICBBY3Rpb246ICdrbXM6RGVjcnlwdCcsXG4gICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgIFJlc291cmNlOiAnYXJuOmF3czprbXM6dXMtZWFzdC0xOjEyMzQ1Njc4OTAxMjprZXkveHl6JyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgJ3NzbTpEZXNjcmliZVBhcmFtZXRlcnMnLFxuICAgICAgICAgICAgJ3NzbTpHZXRQYXJhbWV0ZXJzJyxcbiAgICAgICAgICAgICdzc206R2V0UGFyYW1ldGVyJyxcbiAgICAgICAgICAgICdzc206R2V0UGFyYW1ldGVySGlzdG9yeScsXG4gICAgICAgICAgXSxcbiAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJzpzc206JyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlJlZ2lvbicsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnOicsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpBY2NvdW50SWQnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJzpwYXJhbWV0ZXIvTXlQYXJhbU5hbWUnLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG50ZXN0KCdTdHJpbmdQYXJhbWV0ZXIuZnJvbVNlY3VyZVN0cmluZ1BhcmFtZXRlckF0dHJpYnV0ZXMgd2l0aCBlbmNyeXB0aW9uIGtleSBjcmVhdGVzIHRoZSBjb3JyZWN0IHBvbGljeSBmb3IgZ3JhbnRXcml0ZScsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gIGNvbnN0IGtleSA9IGttcy5LZXkuZnJvbUtleUFybihzdGFjaywgJ0N1c3RvbUtleScsICdhcm46YXdzOmttczp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOmtleS94eXonKTtcbiAgY29uc3Qgcm9sZSA9IG5ldyBpYW0uUm9sZShzdGFjaywgJ1JvbGUnLCB7XG4gICAgYXNzdW1lZEJ5OiBuZXcgaWFtLkFjY291bnRSb290UHJpbmNpcGFsKCksXG4gIH0pO1xuXG4gIC8vIFdIRU5cbiAgY29uc3QgcGFyYW0gPSBzc20uU3RyaW5nUGFyYW1ldGVyLmZyb21TZWN1cmVTdHJpbmdQYXJhbWV0ZXJBdHRyaWJ1dGVzKHN0YWNrLCAnTXlQYXJhbU5hbWUnLCB7XG4gICAgcGFyYW1ldGVyTmFtZTogJ015UGFyYW1OYW1lJyxcbiAgICB2ZXJzaW9uOiAyLFxuICAgIGVuY3J5cHRpb25LZXk6IGtleSxcbiAgfSk7XG4gIHBhcmFtLmdyYW50V3JpdGUocm9sZSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgIHtcbiAgICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAgICdrbXM6RW5jcnlwdCcsXG4gICAgICAgICAgICAna21zOlJlRW5jcnlwdConLFxuICAgICAgICAgICAgJ2ttczpHZW5lcmF0ZURhdGFLZXkqJyxcbiAgICAgICAgICBdLFxuICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICBSZXNvdXJjZTogJ2Fybjphd3M6a21zOnVzLWVhc3QtMToxMjM0NTY3ODkwMTI6a2V5L3h5eicsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBBY3Rpb246ICdzc206UHV0UGFyYW1ldGVyJyxcbiAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJzpzc206JyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlJlZ2lvbicsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnOicsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpBY2NvdW50SWQnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJzpwYXJhbWV0ZXIvTXlQYXJhbU5hbWUnLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG50ZXN0KCdTdHJpbmdQYXJhbWV0ZXIuZnJvbVNlY3VyZVN0cmluZ1BhcmFtZXRlckF0dHJpYnV0ZXMgd2l0aG91dCB2ZXJzaW9uJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAvLyBXSEVOXG4gIGNvbnN0IHBhcmFtID0gc3NtLlN0cmluZ1BhcmFtZXRlci5mcm9tU2VjdXJlU3RyaW5nUGFyYW1ldGVyQXR0cmlidXRlcyhzdGFjaywgJ015UGFyYW1OYW1lJywge1xuICAgIHBhcmFtZXRlck5hbWU6ICdNeVBhcmFtTmFtZScsXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgZXhwZWN0KHN0YWNrLnJlc29sdmUocGFyYW0uc3RyaW5nVmFsdWUpKS50b0VxdWFsKCd7e3Jlc29sdmU6c3NtLXNlY3VyZTpNeVBhcmFtTmFtZX19Jyk7XG59KTtcblxudGVzdCgnU3RyaW5nTGlzdFBhcmFtZXRlci5mcm9tTmFtZScsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgLy8gV0hFTlxuICBjb25zdCBwYXJhbSA9IHNzbS5TdHJpbmdMaXN0UGFyYW1ldGVyLmZyb21TdHJpbmdMaXN0UGFyYW1ldGVyTmFtZShzdGFjaywgJ015UGFyYW1OYW1lJywgJ015UGFyYW1OYW1lJyk7XG5cbiAgLy8gVEhFTlxuICBleHBlY3Qoc3RhY2sucmVzb2x2ZShwYXJhbS5wYXJhbWV0ZXJBcm4pKS50b0VxdWFsKHtcbiAgICAnRm46OkpvaW4nOiBbJycsIFtcbiAgICAgICdhcm46JyxcbiAgICAgIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sXG4gICAgICAnOnNzbTonLFxuICAgICAgeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICc6JyxcbiAgICAgIHsgUmVmOiAnQVdTOjpBY2NvdW50SWQnIH0sXG4gICAgICAnOnBhcmFtZXRlci9NeVBhcmFtTmFtZScsXG4gICAgXV0sXG4gIH0pO1xuICBleHBlY3Qoc3RhY2sucmVzb2x2ZShwYXJhbS5wYXJhbWV0ZXJOYW1lKSkudG9FcXVhbCgnTXlQYXJhbU5hbWUnKTtcbiAgZXhwZWN0KHN0YWNrLnJlc29sdmUocGFyYW0ucGFyYW1ldGVyVHlwZSkpLnRvRXF1YWwoJ1N0cmluZ0xpc3QnKTtcbiAgZXhwZWN0KHN0YWNrLnJlc29sdmUocGFyYW0uc3RyaW5nTGlzdFZhbHVlKSkudG9FcXVhbCh7ICdGbjo6U3BsaXQnOiBbJywnLCAne3tyZXNvbHZlOnNzbTpNeVBhcmFtTmFtZX19J10gfSk7XG59KTtcblxudGVzdCgnZnJvbUxvb2t1cCB3aWxsIHVzZSB0aGUgU1NNIGNvbnRleHQgcHJvdmlkZXIgdG8gcmVhZCB2YWx1ZSBkdXJpbmcgc3ludGhlc2lzJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCh7IGNvbnRleHQ6IHsgW2N4YXBpLk5FV19TVFlMRV9TVEFDS19TWU5USEVTSVNfQ09OVEVYVF06IGZhbHNlIH0gfSk7XG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdteS1zdGFxJywgeyBlbnY6IHsgcmVnaW9uOiAndXMtZWFzdC0xJywgYWNjb3VudDogJzEyMzQ0JyB9IH0pO1xuXG4gIC8vIFdIRU5cbiAgY29uc3QgdmFsdWUgPSBzc20uU3RyaW5nUGFyYW1ldGVyLnZhbHVlRnJvbUxvb2t1cChzdGFjaywgJ215LXBhcmFtLW5hbWUnKTtcblxuICAvLyBUSEVOXG4gIGV4cGVjdCh2YWx1ZSkudG9FcXVhbCgnZHVtbXktdmFsdWUtZm9yLW15LXBhcmFtLW5hbWUnKTtcbiAgZXhwZWN0KGFwcC5zeW50aCgpLm1hbmlmZXN0Lm1pc3NpbmcpLnRvRXF1YWwoW1xuICAgIHtcbiAgICAgIGtleTogJ3NzbTphY2NvdW50PTEyMzQ0OnBhcmFtZXRlck5hbWU9bXktcGFyYW0tbmFtZTpyZWdpb249dXMtZWFzdC0xJyxcbiAgICAgIHByb3BzOiB7XG4gICAgICAgIGFjY291bnQ6ICcxMjM0NCcsXG4gICAgICAgIHJlZ2lvbjogJ3VzLWVhc3QtMScsXG4gICAgICAgIHBhcmFtZXRlck5hbWU6ICdteS1wYXJhbS1uYW1lJyxcbiAgICAgIH0sXG4gICAgICBwcm92aWRlcjogJ3NzbScsXG4gICAgfSxcbiAgXSk7XG59KTtcblxuZGVzY3JpYmUoJ2Zyb20gc3RyaW5nIGxpc3QgcGFyYW1ldGVyJywgKCkgPT4ge1xuICB0ZXN0RGVwcmVjYXRlZCgndmFsdWVGb3JUeXBlZFN0cmluZ1BhcmFtZXRlciBsaXN0IHR5cGUgdGhyb3dzIGVycm9yJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIHNzbS5TdHJpbmdQYXJhbWV0ZXIudmFsdWVGb3JUeXBlZFN0cmluZ1BhcmFtZXRlcihzdGFjaywgJ215LXBhcmFtLW5hbWUnLCBQYXJhbWV0ZXJUeXBlLlNUUklOR19MSVNUKTtcbiAgICB9KS50b1Rocm93KC91c2UgdmFsdWVGb3JUeXBlZExpc3RQYXJhbWV0ZXIgaW5zdGVhZC8pO1xuICB9KTtcblxuICB0ZXN0RGVwcmVjYXRlZCgnZnJvbVN0cmluZ1BhcmFtZXRlckF0dHJpYnV0ZXMgbGlzdCB0eXBlIHRocm93cyBlcnJvcicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBzc20uU3RyaW5nUGFyYW1ldGVyLmZyb21TdHJpbmdQYXJhbWV0ZXJBdHRyaWJ1dGVzKHN0YWNrLCAnbXktcGFyYW0tbmFtZScsIHtcbiAgICAgICAgcGFyYW1ldGVyTmFtZTogJ215LXBhcmFtLW5hbWUnLFxuICAgICAgICB0eXBlOiBQYXJhbWV0ZXJUeXBlLlNUUklOR19MSVNULFxuICAgICAgfSk7XG4gICAgfSkudG9UaHJvdygvZnJvbVN0cmluZ1BhcmFtZXRlckF0dHJpYnV0ZXMgZG9lcyBub3Qgc3VwcG9ydCBTdHJpbmdMaXN0Lyk7XG4gIH0pO1xuXG4gIHRlc3REZXByZWNhdGVkKCdmcm9tU3RyaW5nUGFyYW1ldGVyQXR0cmlidXRlcyByZXR1cm5zIGNvcnJlY3QgdmFsdWUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBzc20uU3RyaW5nUGFyYW1ldGVyLmZyb21TdHJpbmdQYXJhbWV0ZXJBdHRyaWJ1dGVzKHN0YWNrLCAnbXktcGFyYW0tbmFtZScsIHtcbiAgICAgIHBhcmFtZXRlck5hbWU6ICdteS1wYXJhbS1uYW1lJyxcbiAgICAgIHR5cGU6IFBhcmFtZXRlclR5cGUuU1RSSU5HLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAgIFBhcmFtZXRlcnM6IHtcbiAgICAgICAgbXlwYXJhbW5hbWVQYXJhbWV0ZXI6IHtcbiAgICAgICAgICBUeXBlOiAnQVdTOjpTU006OlBhcmFtZXRlcjo6VmFsdWU8U3RyaW5nPicsXG4gICAgICAgICAgRGVmYXVsdDogJ215LXBhcmFtLW5hbWUnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZnJvbVN0cmluZ1BhcmFtZXRlckF0dHJpYnV0ZXMgcmV0dXJucyBjb3JyZWN0IHZhbHVlIHdpdGggdmFsdWVUeXBlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgc3NtLlN0cmluZ1BhcmFtZXRlci5mcm9tU3RyaW5nUGFyYW1ldGVyQXR0cmlidXRlcyhzdGFjaywgJ215LXBhcmFtLW5hbWUnLCB7XG4gICAgICBwYXJhbWV0ZXJOYW1lOiAnbXktcGFyYW0tbmFtZScsXG4gICAgICB2YWx1ZVR5cGU6IFBhcmFtZXRlclZhbHVlVHlwZS5TVFJJTkcsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgUGFyYW1ldGVyczoge1xuICAgICAgICBteXBhcmFtbmFtZVBhcmFtZXRlcjoge1xuICAgICAgICAgIFR5cGU6ICdBV1M6OlNTTTo6UGFyYW1ldGVyOjpWYWx1ZTxTdHJpbmc+JyxcbiAgICAgICAgICBEZWZhdWx0OiAnbXktcGFyYW0tbmFtZScsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd2YWx1ZUZvclR5cGVkTGlzdFBhcmFtZXRlciByZXR1cm5zIGNvcnJlY3QgdmFsdWUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBzc20uU3RyaW5nTGlzdFBhcmFtZXRlci52YWx1ZUZvclR5cGVkTGlzdFBhcmFtZXRlcihzdGFjaywgJ215LXBhcmFtLW5hbWUnKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICBQYXJhbWV0ZXJzOiB7XG4gICAgICAgIFNzbVBhcmFtZXRlclZhbHVlbXlwYXJhbW5hbWVDOTY1ODRCNkYwMEE0NjRFQUQxOTUzQUZGNEIwNTExOFBhcmFtZXRlcjoge1xuICAgICAgICAgIFR5cGU6ICdBV1M6OlNTTTo6UGFyYW1ldGVyOjpWYWx1ZTxMaXN0PFN0cmluZz4+JyxcbiAgICAgICAgICBEZWZhdWx0OiAnbXktcGFyYW0tbmFtZScsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd2YWx1ZUZvclR5cGVkTGlzdFBhcmFtZXRlciByZXR1cm5zIGNvcnJlY3QgdmFsdWUgd2l0aCB0eXBlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgc3NtLlN0cmluZ0xpc3RQYXJhbWV0ZXIudmFsdWVGb3JUeXBlZExpc3RQYXJhbWV0ZXIoc3RhY2ssICdteS1wYXJhbS1uYW1lJywgUGFyYW1ldGVyVmFsdWVUeXBlLkFXU19FQzJfSU5TVEFOQ0VfSUQpO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAgIFBhcmFtZXRlcnM6IHtcbiAgICAgICAgU3NtUGFyYW1ldGVyVmFsdWVteXBhcmFtbmFtZUM5NjU4NEI2RjAwQTQ2NEVBRDE5NTNBRkY0QjA1MTE4UGFyYW1ldGVyOiB7XG4gICAgICAgICAgVHlwZTogJ0FXUzo6U1NNOjpQYXJhbWV0ZXI6OlZhbHVlPExpc3Q8QVdTOjpFQzI6Okluc3RhbmNlOjpJZD4+JyxcbiAgICAgICAgICBEZWZhdWx0OiAnbXktcGFyYW0tbmFtZScsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdmcm9tU3RyaW5nTGlzdFBhcmFtZXRlckF0dHJpYnV0ZXMgcmV0dXJucyBjb3JyZWN0IHZhbHVlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgc3NtLlN0cmluZ0xpc3RQYXJhbWV0ZXIuZnJvbUxpc3RQYXJhbWV0ZXJBdHRyaWJ1dGVzKHN0YWNrLCAnbXktcGFyYW0tbmFtZScsIHtcbiAgICAgIHBhcmFtZXRlck5hbWU6ICdteS1wYXJhbS1uYW1lJyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICBQYXJhbWV0ZXJzOiB7XG4gICAgICAgIG15cGFyYW1uYW1lUGFyYW1ldGVyOiB7XG4gICAgICAgICAgVHlwZTogJ0FXUzo6U1NNOjpQYXJhbWV0ZXI6OlZhbHVlPExpc3Q8U3RyaW5nPj4nLFxuICAgICAgICAgIERlZmF1bHQ6ICdteS1wYXJhbS1uYW1lJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3REZXByZWNhdGVkKCdzdHJpbmcgdHlwZSByZXR1cm5zIGNvcnJlY3QgdmFsdWUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBzc20uU3RyaW5nUGFyYW1ldGVyLnZhbHVlRm9yVHlwZWRTdHJpbmdQYXJhbWV0ZXIoc3RhY2ssICdteS1wYXJhbS1uYW1lJywgUGFyYW1ldGVyVHlwZS5TVFJJTkcpO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAgIFBhcmFtZXRlcnM6IHtcbiAgICAgICAgU3NtUGFyYW1ldGVyVmFsdWVteXBhcmFtbmFtZUM5NjU4NEI2RjAwQTQ2NEVBRDE5NTNBRkY0QjA1MTE4UGFyYW1ldGVyOiB7XG4gICAgICAgICAgVHlwZTogJ0FXUzo6U1NNOjpQYXJhbWV0ZXI6OlZhbHVlPFN0cmluZz4nLFxuICAgICAgICAgIERlZmF1bHQ6ICdteS1wYXJhbS1uYW1lJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3N0cmluZyB2YWx1ZVR5cGUgcmV0dXJucyBjb3JyZWN0IHZhbHVlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgc3NtLlN0cmluZ1BhcmFtZXRlci52YWx1ZUZvclR5cGVkU3RyaW5nUGFyYW1ldGVyVjIoc3RhY2ssICdteS1wYXJhbS1uYW1lJywgUGFyYW1ldGVyVmFsdWVUeXBlLkFXU19FQzJfSU1BR0VfSUQpO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAgIFBhcmFtZXRlcnM6IHtcbiAgICAgICAgU3NtUGFyYW1ldGVyVmFsdWVteXBhcmFtbmFtZUM5NjU4NEI2RjAwQTQ2NEVBRDE5NTNBRkY0QjA1MTE4UGFyYW1ldGVyOiB7XG4gICAgICAgICAgVHlwZTogJ0FXUzo6U1NNOjpQYXJhbWV0ZXI6OlZhbHVlPEFXUzo6RUMyOjpJbWFnZTo6SWQ+JyxcbiAgICAgICAgICBEZWZhdWx0OiAnbXktcGFyYW0tbmFtZScsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxufSk7XG5cbmRlc2NyaWJlKCd2YWx1ZUZvclN0cmluZ1BhcmFtZXRlcicsICgpID0+IHtcbiAgdGVzdCgncmV0dXJucyBhIHRva2VuIHRoYXQgcmVwcmVzZW50cyB0aGUgU1NNIHBhcmFtZXRlciB2YWx1ZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHZhbHVlID0gc3NtLlN0cmluZ1BhcmFtZXRlci52YWx1ZUZvclN0cmluZ1BhcmFtZXRlcihzdGFjaywgJ215LXBhcmFtLW5hbWUnKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICBQYXJhbWV0ZXJzOiB7XG4gICAgICAgIFNzbVBhcmFtZXRlclZhbHVlbXlwYXJhbW5hbWVDOTY1ODRCNkYwMEE0NjRFQUQxOTUzQUZGNEIwNTExOFBhcmFtZXRlcjoge1xuICAgICAgICAgIFR5cGU6ICdBV1M6OlNTTTo6UGFyYW1ldGVyOjpWYWx1ZTxTdHJpbmc+JyxcbiAgICAgICAgICBEZWZhdWx0OiAnbXktcGFyYW0tbmFtZScsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHZhbHVlKSkudG9FcXVhbCh7IFJlZjogJ1NzbVBhcmFtZXRlclZhbHVlbXlwYXJhbW5hbWVDOTY1ODRCNkYwMEE0NjRFQUQxOTUzQUZGNEIwNTExOFBhcmFtZXRlcicgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2RlLWR1cCBiYXNlZCBvbiBwYXJhbWV0ZXIgbmFtZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIHNzbS5TdHJpbmdQYXJhbWV0ZXIudmFsdWVGb3JTdHJpbmdQYXJhbWV0ZXIoc3RhY2ssICdteS1wYXJhbS1uYW1lJyk7XG4gICAgc3NtLlN0cmluZ1BhcmFtZXRlci52YWx1ZUZvclN0cmluZ1BhcmFtZXRlcihzdGFjaywgJ215LXBhcmFtLW5hbWUnKTtcbiAgICBzc20uU3RyaW5nUGFyYW1ldGVyLnZhbHVlRm9yU3RyaW5nUGFyYW1ldGVyKHN0YWNrLCAnbXktcGFyYW0tbmFtZS0yJyk7XG4gICAgc3NtLlN0cmluZ1BhcmFtZXRlci52YWx1ZUZvclN0cmluZ1BhcmFtZXRlcihzdGFjaywgJ215LXBhcmFtLW5hbWUnKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICBQYXJhbWV0ZXJzOiB7XG4gICAgICAgIFNzbVBhcmFtZXRlclZhbHVlbXlwYXJhbW5hbWVDOTY1ODRCNkYwMEE0NjRFQUQxOTUzQUZGNEIwNTExOFBhcmFtZXRlcjoge1xuICAgICAgICAgIFR5cGU6ICdBV1M6OlNTTTo6UGFyYW1ldGVyOjpWYWx1ZTxTdHJpbmc+JyxcbiAgICAgICAgICBEZWZhdWx0OiAnbXktcGFyYW0tbmFtZScsXG4gICAgICAgIH0sXG4gICAgICAgIFNzbVBhcmFtZXRlclZhbHVlbXlwYXJhbW5hbWUyQzk2NTg0QjZGMDBBNDY0RUFEMTk1M0FGRjRCMDUxMThQYXJhbWV0ZXI6IHtcbiAgICAgICAgICBUeXBlOiAnQVdTOjpTU006OlBhcmFtZXRlcjo6VmFsdWU8U3RyaW5nPicsXG4gICAgICAgICAgRGVmYXVsdDogJ215LXBhcmFtLW5hbWUtMicsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gcXVlcnkgYWN0dWFsIFNTTSBQYXJhbWV0ZXIgTmFtZXMsIG11bHRpcGxlIHRpbWVzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgc3NtLlN0cmluZ1BhcmFtZXRlci52YWx1ZUZvclN0cmluZ1BhcmFtZXRlcihzdGFjaywgJy9teS9wYXJhbS9uYW1lJyk7XG4gICAgc3NtLlN0cmluZ1BhcmFtZXRlci52YWx1ZUZvclN0cmluZ1BhcmFtZXRlcihzdGFjaywgJy9teS9wYXJhbS9uYW1lJyk7XG4gIH0pO1xufSk7XG5cbnRlc3QoJ3JlbmRlcmluZyBvZiBwYXJhbWV0ZXIgYXJucycsICgpID0+IHtcbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gIGNvbnN0IHBhcmFtID0gbmV3IGNkay5DZm5QYXJhbWV0ZXIoc3RhY2ssICdwYXJhbScpO1xuICBjb25zdCBleHBlY3RlZEEgPSB7ICdGbjo6Sm9pbic6IFsnJywgWydhcm46JywgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSwgJzpzc206JywgeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSwgJzonLCB7IFJlZjogJ0FXUzo6QWNjb3VudElkJyB9LCAnOnBhcmFtZXRlci9iYW0nXV0gfTtcbiAgY29uc3QgZXhwZWN0ZWRCID0geyAnRm46OkpvaW4nOiBbJycsIFsnYXJuOicsIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sICc6c3NtOicsIHsgUmVmOiAnQVdTOjpSZWdpb24nIH0sICc6JywgeyBSZWY6ICdBV1M6OkFjY291bnRJZCcgfSwgJzpwYXJhbWV0ZXIvJywgeyBSZWY6ICdwYXJhbScgfV1dIH07XG4gIGNvbnN0IGV4cGVjdGVkQyA9IHsgJ0ZuOjpKb2luJzogWycnLCBbJ2FybjonLCB7IFJlZjogJ0FXUzo6UGFydGl0aW9uJyB9LCAnOnNzbTonLCB7IFJlZjogJ0FXUzo6UmVnaW9uJyB9LCAnOicsIHsgUmVmOiAnQVdTOjpBY2NvdW50SWQnIH0sICc6cGFyYW1ldGVyJywgeyBSZWY6ICdwYXJhbScgfV1dIH07XG4gIGxldCBpID0gMDtcblxuICAvLyBXSEVOXG4gIGNvbnN0IGNhc2UxID0gc3NtLlN0cmluZ1BhcmFtZXRlci5mcm9tU3RyaW5nUGFyYW1ldGVyTmFtZShzdGFjaywgYHAke2krK31gLCAnYmFtJyk7XG4gIGNvbnN0IGNhc2UyID0gc3NtLlN0cmluZ1BhcmFtZXRlci5mcm9tU3RyaW5nUGFyYW1ldGVyTmFtZShzdGFjaywgYHAke2krK31gLCAnL2JhbScpO1xuICBjb25zdCBjYXNlNCA9IHNzbS5TdHJpbmdQYXJhbWV0ZXIuZnJvbVN0cmluZ1BhcmFtZXRlckF0dHJpYnV0ZXMoc3RhY2ssIGBwJHtpKyt9YCwgeyBwYXJhbWV0ZXJOYW1lOiAnYmFtJyB9KTtcbiAgY29uc3QgY2FzZTUgPSBzc20uU3RyaW5nUGFyYW1ldGVyLmZyb21TdHJpbmdQYXJhbWV0ZXJBdHRyaWJ1dGVzKHN0YWNrLCBgcCR7aSsrfWAsIHsgcGFyYW1ldGVyTmFtZTogJy9iYW0nIH0pO1xuICBjb25zdCBjYXNlNiA9IHNzbS5TdHJpbmdQYXJhbWV0ZXIuZnJvbVN0cmluZ1BhcmFtZXRlckF0dHJpYnV0ZXMoc3RhY2ssIGBwJHtpKyt9YCwgeyBwYXJhbWV0ZXJOYW1lOiBwYXJhbS52YWx1ZUFzU3RyaW5nLCBzaW1wbGVOYW1lOiB0cnVlIH0pO1xuICBjb25zdCBjYXNlNyA9IHNzbS5TdHJpbmdQYXJhbWV0ZXIuZnJvbVNlY3VyZVN0cmluZ1BhcmFtZXRlckF0dHJpYnV0ZXMoc3RhY2ssIGBwJHtpKyt9YCwgeyBwYXJhbWV0ZXJOYW1lOiAnYmFtJywgdmVyc2lvbjogMTAgfSk7XG4gIGNvbnN0IGNhc2U4ID0gc3NtLlN0cmluZ1BhcmFtZXRlci5mcm9tU2VjdXJlU3RyaW5nUGFyYW1ldGVyQXR0cmlidXRlcyhzdGFjaywgYHAke2krK31gLCB7IHBhcmFtZXRlck5hbWU6ICcvYmFtJywgdmVyc2lvbjogMTAgfSk7XG4gIGNvbnN0IGNhc2U5ID0gc3NtLlN0cmluZ1BhcmFtZXRlci5mcm9tU2VjdXJlU3RyaW5nUGFyYW1ldGVyQXR0cmlidXRlcyhzdGFjaywgYHAke2krK31gLCB7IHBhcmFtZXRlck5hbWU6IHBhcmFtLnZhbHVlQXNTdHJpbmcsIHZlcnNpb246IDEwLCBzaW1wbGVOYW1lOiBmYWxzZSB9KTtcblxuICAvLyBhdXRvLWdlbmVyYXRlZCBuYW1lIGlzIGFsd2F5cyBnZW5lcmF0ZWQgYXMgYSBcInNpbXBsZSBuYW1lXCIgKG5vdC9hL3BhdGgpXG4gIGNvbnN0IGNhc2UxMCA9IG5ldyBzc20uU3RyaW5nUGFyYW1ldGVyKHN0YWNrLCBgcCR7aSsrfWAsIHsgc3RyaW5nVmFsdWU6ICd2YWx1ZScgfSk7XG5cbiAgLy8gZXhwbGljaXRseSBuYW1lZCBwaHlzaWNhbCBuYW1lIGdpdmVzIHVzIGEgaGludCBvbiBob3cgdG8gcmVuZGVyIHRoZSBBUk5cbiAgY29uc3QgY2FzZTExID0gbmV3IHNzbS5TdHJpbmdQYXJhbWV0ZXIoc3RhY2ssIGBwJHtpKyt9YCwgeyBwYXJhbWV0ZXJOYW1lOiAnL2Zvby9iYXInLCBzdHJpbmdWYWx1ZTogJ2hlbGxvJyB9KTtcbiAgY29uc3QgY2FzZTEyID0gbmV3IHNzbS5TdHJpbmdQYXJhbWV0ZXIoc3RhY2ssIGBwJHtpKyt9YCwgeyBwYXJhbWV0ZXJOYW1lOiAnc2ltcGxlLW5hbWUnLCBzdHJpbmdWYWx1ZTogJ2hlbGxvJyB9KTtcblxuICBjb25zdCBjYXNlMTMgPSBuZXcgc3NtLlN0cmluZ0xpc3RQYXJhbWV0ZXIoc3RhY2ssIGBwJHtpKyt9YCwgeyBzdHJpbmdMaXN0VmFsdWU6IFsnaGVsbG8nLCAnd29ybGQnXSB9KTtcbiAgY29uc3QgY2FzZTE0ID0gbmV3IHNzbS5TdHJpbmdMaXN0UGFyYW1ldGVyKHN0YWNrLCBgcCR7aSsrfWAsIHsgcGFyYW1ldGVyTmFtZTogJy9ub3Qvc2ltcGxlJywgc3RyaW5nTGlzdFZhbHVlOiBbJ2hlbGxvJywgJ3dvcmxkJ10gfSk7XG4gIGNvbnN0IGNhc2UxNSA9IG5ldyBzc20uU3RyaW5nTGlzdFBhcmFtZXRlcihzdGFjaywgYHAke2krK31gLCB7IHBhcmFtZXRlck5hbWU6ICdzaW1wbGUnLCBzdHJpbmdMaXN0VmFsdWU6IFsnaGVsbG8nLCAnd29ybGQnXSB9KTtcblxuICAvLyBUSEVOXG4gIGV4cGVjdChzdGFjay5yZXNvbHZlKGNhc2UxLnBhcmFtZXRlckFybikpLnRvRXF1YWwoZXhwZWN0ZWRBKTtcbiAgZXhwZWN0KHN0YWNrLnJlc29sdmUoY2FzZTIucGFyYW1ldGVyQXJuKSkudG9FcXVhbChleHBlY3RlZEEpO1xuICBleHBlY3Qoc3RhY2sucmVzb2x2ZShjYXNlNC5wYXJhbWV0ZXJBcm4pKS50b0VxdWFsKGV4cGVjdGVkQSk7XG4gIGV4cGVjdChzdGFjay5yZXNvbHZlKGNhc2U1LnBhcmFtZXRlckFybikpLnRvRXF1YWwoZXhwZWN0ZWRBKTtcbiAgZXhwZWN0KHN0YWNrLnJlc29sdmUoY2FzZTYucGFyYW1ldGVyQXJuKSkudG9FcXVhbChleHBlY3RlZEIpO1xuICBleHBlY3Qoc3RhY2sucmVzb2x2ZShjYXNlNy5wYXJhbWV0ZXJBcm4pKS50b0VxdWFsKGV4cGVjdGVkQSk7XG4gIGV4cGVjdChzdGFjay5yZXNvbHZlKGNhc2U4LnBhcmFtZXRlckFybikpLnRvRXF1YWwoZXhwZWN0ZWRBKTtcbiAgZXhwZWN0KHN0YWNrLnJlc29sdmUoY2FzZTkucGFyYW1ldGVyQXJuKSkudG9FcXVhbChleHBlY3RlZEMpO1xuXG4gIC8vIG5ldyBzc20uUGFyYW1ldGVycyBkZXRlcm1pbmUgaWYgXCIvXCIgaXMgbmVlZGVkIGJhc2VkIG9uIHRoZSBwb3N0dXJlIG9mIGBwYXJhbWV0ZXJOYW1lYC5cbiAgZXhwZWN0KHN0YWNrLnJlc29sdmUoY2FzZTEwLnBhcmFtZXRlckFybikpLnRvRXF1YWwoeyAnRm46OkpvaW4nOiBbJycsIFsnYXJuOicsIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sICc6c3NtOicsIHsgUmVmOiAnQVdTOjpSZWdpb24nIH0sICc6JywgeyBSZWY6ICdBV1M6OkFjY291bnRJZCcgfSwgJzpwYXJhbWV0ZXIvJywgeyBSZWY6ICdwODFCQjBGNkZFJyB9XV0gfSk7XG4gIGV4cGVjdChzdGFjay5yZXNvbHZlKGNhc2UxMS5wYXJhbWV0ZXJBcm4pKS50b0VxdWFsKHsgJ0ZuOjpKb2luJzogWycnLCBbJ2FybjonLCB7IFJlZjogJ0FXUzo6UGFydGl0aW9uJyB9LCAnOnNzbTonLCB7IFJlZjogJ0FXUzo6UmVnaW9uJyB9LCAnOicsIHsgUmVmOiAnQVdTOjpBY2NvdW50SWQnIH0sICc6cGFyYW1ldGVyJywgeyBSZWY6ICdwOTdBNTA4MjEyJyB9XV0gfSk7XG4gIGV4cGVjdChzdGFjay5yZXNvbHZlKGNhc2UxMi5wYXJhbWV0ZXJBcm4pKS50b0VxdWFsKHsgJ0ZuOjpKb2luJzogWycnLCBbJ2FybjonLCB7IFJlZjogJ0FXUzo6UGFydGl0aW9uJyB9LCAnOnNzbTonLCB7IFJlZjogJ0FXUzo6UmVnaW9uJyB9LCAnOicsIHsgUmVmOiAnQVdTOjpBY2NvdW50SWQnIH0sICc6cGFyYW1ldGVyLycsIHsgUmVmOiAncDEwN0Q2QjhBQjAnIH1dXSB9KTtcbiAgZXhwZWN0KHN0YWNrLnJlc29sdmUoY2FzZTEzLnBhcmFtZXRlckFybikpLnRvRXF1YWwoeyAnRm46OkpvaW4nOiBbJycsIFsnYXJuOicsIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sICc6c3NtOicsIHsgUmVmOiAnQVdTOjpSZWdpb24nIH0sICc6JywgeyBSZWY6ICdBV1M6OkFjY291bnRJZCcgfSwgJzpwYXJhbWV0ZXIvJywgeyBSZWY6ICdwMTE4QTlDQjAyQycgfV1dIH0pO1xuICBleHBlY3Qoc3RhY2sucmVzb2x2ZShjYXNlMTQucGFyYW1ldGVyQXJuKSkudG9FcXVhbCh7ICdGbjo6Sm9pbic6IFsnJywgWydhcm46JywgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSwgJzpzc206JywgeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSwgJzonLCB7IFJlZjogJ0FXUzo6QWNjb3VudElkJyB9LCAnOnBhcmFtZXRlcicsIHsgUmVmOiAncDEyOUJFNENFOTEnIH1dXSB9KTtcbiAgZXhwZWN0KHN0YWNrLnJlc29sdmUoY2FzZTE1LnBhcmFtZXRlckFybikpLnRvRXF1YWwoeyAnRm46OkpvaW4nOiBbJycsIFsnYXJuOicsIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sICc6c3NtOicsIHsgUmVmOiAnQVdTOjpSZWdpb24nIH0sICc6JywgeyBSZWY6ICdBV1M6OkFjY291bnRJZCcgfSwgJzpwYXJhbWV0ZXIvJywgeyBSZWY6ICdwMTMyNkEyQUVDNCcgfV1dIH0pO1xufSk7XG5cbnRlc3QoJ2lmIHBhcmFtZXRlck5hbWUgaXMgYSB0b2tlbiBzZXBhcmF0b3IgbXVzdCBiZSBzcGVjaWZpZWQnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICBjb25zdCBwYXJhbSA9IG5ldyBjZGsuQ2ZuUGFyYW1ldGVyKHN0YWNrLCAncGFyYW0nKTtcbiAgbGV0IGkgPSAwO1xuXG4gIC8vIFdIRU5cbiAgY29uc3QgcDEgPSBuZXcgc3NtLlN0cmluZ1BhcmFtZXRlcihzdGFjaywgYHAke2krK31gLCB7IHBhcmFtZXRlck5hbWU6IHBhcmFtLnZhbHVlQXNTdHJpbmcsIHN0cmluZ1ZhbHVlOiAnZm9vJywgc2ltcGxlTmFtZTogdHJ1ZSB9KTtcbiAgY29uc3QgcDIgPSBuZXcgc3NtLlN0cmluZ1BhcmFtZXRlcihzdGFjaywgYHAke2krK31gLCB7IHBhcmFtZXRlck5hbWU6IHBhcmFtLnZhbHVlQXNTdHJpbmcsIHN0cmluZ1ZhbHVlOiAnZm9vJywgc2ltcGxlTmFtZTogZmFsc2UgfSk7XG4gIGNvbnN0IHAzID0gbmV3IHNzbS5TdHJpbmdMaXN0UGFyYW1ldGVyKHN0YWNrLCBgcCR7aSsrfWAsIHsgcGFyYW1ldGVyTmFtZTogcGFyYW0udmFsdWVBc1N0cmluZywgc3RyaW5nTGlzdFZhbHVlOiBbJ2ZvbyddLCBzaW1wbGVOYW1lOiBmYWxzZSB9KTtcblxuICAvLyBUSEVOXG4gIGV4cGVjdChzdGFjay5yZXNvbHZlKHAxLnBhcmFtZXRlckFybikpLnRvRXF1YWwoeyAnRm46OkpvaW4nOiBbJycsIFsnYXJuOicsIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sICc6c3NtOicsIHsgUmVmOiAnQVdTOjpSZWdpb24nIH0sICc6JywgeyBSZWY6ICdBV1M6OkFjY291bnRJZCcgfSwgJzpwYXJhbWV0ZXIvJywgeyBSZWY6ICdwMEIwMkE4RjY1JyB9XV0gfSk7XG4gIGV4cGVjdChzdGFjay5yZXNvbHZlKHAyLnBhcmFtZXRlckFybikpLnRvRXF1YWwoeyAnRm46OkpvaW4nOiBbJycsIFsnYXJuOicsIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sICc6c3NtOicsIHsgUmVmOiAnQVdTOjpSZWdpb24nIH0sICc6JywgeyBSZWY6ICdBV1M6OkFjY291bnRJZCcgfSwgJzpwYXJhbWV0ZXInLCB7IFJlZjogJ3AxRTQzQUQ1QUMnIH1dXSB9KTtcbiAgZXhwZWN0KHN0YWNrLnJlc29sdmUocDMucGFyYW1ldGVyQXJuKSkudG9FcXVhbCh7ICdGbjo6Sm9pbic6IFsnJywgWydhcm46JywgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSwgJzpzc206JywgeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSwgJzonLCB7IFJlZjogJ0FXUzo6QWNjb3VudElkJyB9LCAnOnBhcmFtZXRlcicsIHsgUmVmOiAncDJDMTkwM0FFQicgfV1dIH0pO1xufSk7XG5cbnRlc3QoJ2ZhaWxzIGlmIG5hbWUgaXMgYSB0b2tlbiBhbmQgbm8gZXhwbGljaXQgc2VwYXJhdG9yJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgY29uc3QgcGFyYW0gPSBuZXcgY2RrLkNmblBhcmFtZXRlcihzdGFjaywgJ3BhcmFtJyk7XG4gIGxldCBpID0gMDtcblxuICAvLyBUSEVOXG4gIGNvbnN0IGV4cGVjdGVkID0gL1VuYWJsZSB0byBkZXRlcm1pbmUgQVJOIHNlcGFyYXRvciBmb3IgU1NNIHBhcmFtZXRlciBzaW5jZSB0aGUgcGFyYW1ldGVyIG5hbWUgaXMgYW4gdW5yZXNvbHZlZCB0b2tlbi4gVXNlIFwiZnJvbUF0dHJpYnV0ZXNcIiBhbmQgc3BlY2lmeSBcInNpbXBsZU5hbWVcIiBleHBsaWNpdGx5LztcbiAgZXhwZWN0KCgpID0+IHNzbS5TdHJpbmdQYXJhbWV0ZXIuZnJvbVN0cmluZ1BhcmFtZXRlck5hbWUoc3RhY2ssIGBwJHtpKyt9YCwgcGFyYW0udmFsdWVBc1N0cmluZykpLnRvVGhyb3coZXhwZWN0ZWQpO1xuICBleHBlY3QoKCkgPT4gc3NtLlN0cmluZ1BhcmFtZXRlci5mcm9tU2VjdXJlU3RyaW5nUGFyYW1ldGVyQXR0cmlidXRlcyhzdGFjaywgYHAke2krK31gLCB7IHBhcmFtZXRlck5hbWU6IHBhcmFtLnZhbHVlQXNTdHJpbmcsIHZlcnNpb246IDEgfSkpLnRvVGhyb3coZXhwZWN0ZWQpO1xuICBleHBlY3QoKCkgPT4gbmV3IHNzbS5TdHJpbmdQYXJhbWV0ZXIoc3RhY2ssIGBwJHtpKyt9YCwgeyBwYXJhbWV0ZXJOYW1lOiBwYXJhbS52YWx1ZUFzU3RyaW5nLCBzdHJpbmdWYWx1ZTogJ2ZvbycgfSkpLnRvVGhyb3coZXhwZWN0ZWQpO1xuICBleHBlY3QoKCkgPT4gbmV3IHNzbS5TdHJpbmdQYXJhbWV0ZXIoc3RhY2ssIGBwJHtpKyt9YCwgeyBwYXJhbWV0ZXJOYW1lOiBwYXJhbS52YWx1ZUFzU3RyaW5nLCBzdHJpbmdWYWx1ZTogJ2ZvbycgfSkpLnRvVGhyb3coZXhwZWN0ZWQpO1xufSk7XG5cbnRlc3QoJ2ZhaWxzIGlmIHNpbXBsZU5hbWUgaXMgd3JvbmcgYmFzZWQgb24gYSBjb25jcmV0ZSBwaHlzaWNhbCBuYW1lJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgbGV0IGkgPSAwO1xuXG4gIC8vIFRIRU5cbiAgZXhwZWN0KCgpID0+IHNzbS5TdHJpbmdQYXJhbWV0ZXIuZnJvbVN0cmluZ1BhcmFtZXRlckF0dHJpYnV0ZXMoc3RhY2ssIGBwJHtpKyt9YCwgeyBwYXJhbWV0ZXJOYW1lOiAnc2ltcGxlJywgc2ltcGxlTmFtZTogZmFsc2UgfSkpLnRvVGhyb3coL1BhcmFtZXRlciBuYW1lIFwic2ltcGxlXCIgaXMgYSBzaW1wbGUgbmFtZSwgYnV0IFwic2ltcGxlTmFtZVwiIHdhcyBleHBsaWNpdGx5IHNldCB0byBmYWxzZS4gRWl0aGVyIG9taXQgaXQgb3Igc2V0IGl0IHRvIHRydWUvKTtcbiAgZXhwZWN0KCgpID0+IHNzbS5TdHJpbmdQYXJhbWV0ZXIuZnJvbVN0cmluZ1BhcmFtZXRlckF0dHJpYnV0ZXMoc3RhY2ssIGBwJHtpKyt9YCwgeyBwYXJhbWV0ZXJOYW1lOiAnL2Zvby9iYXInLCBzaW1wbGVOYW1lOiB0cnVlIH0pKS50b1Rocm93KC9QYXJhbWV0ZXIgbmFtZSBcIlxcL2Zvb1xcL2JhclwiIGlzIG5vdCBhIHNpbXBsZSBuYW1lLCBidXQgXCJzaW1wbGVOYW1lXCIgd2FzIGV4cGxpY2l0bHkgc2V0IHRvIHRydWUuIEVpdGhlciBvbWl0IGl0IG9yIHNldCBpdCB0byBmYWxzZS8pO1xufSk7XG5cbnRlc3QoJ2ZhaWxzIGlmIHBhcmFtZXRlck5hbWUgaXMgdW5kZWZpbmVkIGFuZCBzaW1wbGVOYW1lIGlzIFwiZmFsc2VcIicsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgLy8gVEhFTlxuICBleHBlY3QoKCkgPT4gbmV3IHNzbS5TdHJpbmdQYXJhbWV0ZXIoc3RhY2ssICdwJywgeyBzaW1wbGVOYW1lOiBmYWxzZSwgc3RyaW5nVmFsdWU6ICdmb28nIH0pKS50b1Rocm93KC9JZiBcInBhcmFtZXRlck5hbWVcIiBpcyBub3QgZXhwbGljaXRseSBkZWZpbmVkLCBcInNpbXBsZU5hbWVcIiBtdXN0IGJlIFwidHJ1ZVwiIG9yIHVuZGVmaW5lZCBzaW5jZSBhdXRvLWdlbmVyYXRlZCBwYXJhbWV0ZXIgbmFtZXMgYWx3YXlzIGhhdmUgc2ltcGxlIG5hbWVzLyk7XG59KTtcbiJdfQ==