import '@aws-cdk/assert/jest';
import { ResourcePart } from '@aws-cdk/assert';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import * as lambda from '../lib';

describe('singleton lambda', () => {
  test('can add same singleton Lambda multiple times, only instantiated once in template', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    for (let i = 0; i < 5; i++) {
      new lambda.SingletonFunction(stack, `Singleton${i}`, {
        uuid: '84c0de93-353f-4217-9b0b-45b6c993251a',
        code: new lambda.InlineCode('def hello(): pass'),
        runtime: lambda.Runtime.PYTHON_2_7,
        handler: 'index.hello',
        timeout: cdk.Duration.minutes(5),
      });
    }

    // THEN
    expect(stack).toMatchTemplate({
      Resources: {
        SingletonLambda84c0de93353f42179b0b45b6c993251aServiceRole26D59235: {
          Type: 'AWS::IAM::Role',
          Properties: {
            AssumeRolePolicyDocument: {
              Statement: [
                {
                  Action: 'sts:AssumeRole',
                  Effect: 'Allow',
                  Principal: { Service: 'lambda.amazonaws.com' },
                },
              ],
              Version: '2012-10-17',
            },
            ManagedPolicyArns: [
              {
                'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole']],
              },
            ],
          },
        },
        SingletonLambda84c0de93353f42179b0b45b6c993251a840BCC38: {
          Type: 'AWS::Lambda::Function',
          Properties: {
            Code: {
              ZipFile: 'def hello(): pass',
            },
            Handler: 'index.hello',
            Role: { 'Fn::GetAtt': ['SingletonLambda84c0de93353f42179b0b45b6c993251aServiceRole26D59235', 'Arn'] },
            Runtime: 'python2.7',
            Timeout: 300,
          },
          DependsOn: ['SingletonLambda84c0de93353f42179b0b45b6c993251aServiceRole26D59235'],
        },
      },
    });
  });

  test('dependencies are correctly added', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const singleton = new lambda.SingletonFunction(stack, 'Singleton', {
      uuid: '84c0de93-353f-4217-9b0b-45b6c993251a',
      code: new lambda.InlineCode('def hello(): pass'),
      runtime: lambda.Runtime.PYTHON_2_7,
      handler: 'index.hello',
      timeout: cdk.Duration.minutes(5),
    });
    const dependency = new iam.User(stack, 'dependencyUser');

    // WHEN
    singleton.addDependency(dependency);

    // THEN
    expect(stack).toHaveResource('AWS::Lambda::Function', {
      DependsOn: [
        'dependencyUser1B9CB07E',
        'SingletonLambda84c0de93353f42179b0b45b6c993251aServiceRole26D59235',
      ],
    }, ResourcePart.CompleteDefinition);
  });

  test('dependsOn are correctly added', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const singleton = new lambda.SingletonFunction(stack, 'Singleton', {
      uuid: '84c0de93-353f-4217-9b0b-45b6c993251a',
      code: new lambda.InlineCode('def hello(): pass'),
      runtime: lambda.Runtime.PYTHON_2_7,
      handler: 'index.hello',
      timeout: cdk.Duration.minutes(5),
    });
    const user = new iam.User(stack, 'user');

    // WHEN
    singleton.dependOn(user);

    // THEN
    expect(stack).toHaveResource('AWS::IAM::User', {
      DependsOn: [
        'SingletonLambda84c0de93353f42179b0b45b6c993251a840BCC38',
        'SingletonLambda84c0de93353f42179b0b45b6c993251aServiceRole26D59235',
      ],
    }, ResourcePart.CompleteDefinition);
  });

  test('grantInvoke works correctly', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const singleton = new lambda.SingletonFunction(stack, 'Singleton', {
      uuid: '84c0de93-353f-4217-9b0b-45b6c993251a',
      code: new lambda.InlineCode('def hello(): pass'),
      runtime: lambda.Runtime.PYTHON_2_7,
      handler: 'index.hello',
    });

    // WHEN
    const invokeResult = singleton.grantInvoke(new iam.ServicePrincipal('events.amazonaws.com'));
    const statement = stack.resolve(invokeResult.resourceStatement);

    // THEN
    expect(stack).toHaveResource('AWS::Lambda::Permission', {
      Action: 'lambda:InvokeFunction',
      Principal: 'events.amazonaws.com',
    });
    expect(statement.action).toEqual(['lambda:InvokeFunction']);
    expect(statement.principal).toEqual({ Service: ['events.amazonaws.com'] });
    expect(statement.effect).toEqual('Allow');
    expect(statement.resource).toEqual([{
      'Fn::GetAtt': ['SingletonLambda84c0de93353f42179b0b45b6c993251a840BCC38', 'Arn'],
    }]);
  });

  test('check edge compatibility', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const singleton = new lambda.SingletonFunction(stack, 'Singleton', {
      uuid: '84c0de93-353f-4217-9b0b-45b6c993251a',
      code: new lambda.InlineCode('def hello(): pass'),
      runtime: lambda.Runtime.PYTHON_2_7,
      handler: 'index.hello',
      environment: {
        KEY: 'value',
      },
    });

    // THEN
    expect(() => singleton._checkEdgeCompatibility())
      .toThrow(/contains environment variables .* and is not compatible with Lambda@Edge/);
  });

  test('current version of a singleton function', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const singleton = new lambda.SingletonFunction(stack, 'Singleton', {
      uuid: '84c0de93-353f-4217-9b0b-45b6c993251a',
      code: new lambda.InlineCode('foo'),
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'index.handler',
    });

    // WHEN
    const version = singleton.currentVersion;
    version.addAlias('foo');

    // THEN
    expect(stack).toHaveResource('AWS::Lambda::Version', {
      FunctionName: {
        Ref: 'SingletonLambda84c0de93353f42179b0b45b6c993251a840BCC38',
      },
    });
  });
});
