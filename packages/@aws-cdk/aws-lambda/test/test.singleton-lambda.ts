import { expect, haveResource, matchTemplate, ResourcePart } from '@aws-cdk/assert';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as lambda from '../lib';

export = {
  'can add same singleton Lambda multiple times, only instantiated once in template'(test: Test) {
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
    expect(stack).to(matchTemplate({
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
                'Fn::Join': [ '', [ 'arn:', { Ref: 'AWS::Partition' }, ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole' ] ],
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
            Role: { 'Fn::GetAtt': [ 'SingletonLambda84c0de93353f42179b0b45b6c993251aServiceRole26D59235', 'Arn' ] },
            Runtime: 'python2.7',
            Timeout: 300,
          },
          DependsOn: [ 'SingletonLambda84c0de93353f42179b0b45b6c993251aServiceRole26D59235' ],
        },
      },
    }));

    test.done();
  },

  'dependencies are correctly added'(test: Test) {
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
    expect(stack).to(haveResource('AWS::Lambda::Function', {
      DependsOn: [
        'dependencyUser1B9CB07E',
        'SingletonLambda84c0de93353f42179b0b45b6c993251aServiceRole26D59235',
      ],
    }, ResourcePart.CompleteDefinition));

    test.done();
  },

  'dependsOn are correctly added'(test: Test) {
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
    expect(stack).to(haveResource('AWS::IAM::User', {
      DependsOn: [
        'SingletonLambda84c0de93353f42179b0b45b6c993251a840BCC38',
        'SingletonLambda84c0de93353f42179b0b45b6c993251aServiceRole26D59235',
      ],
    }, ResourcePart.CompleteDefinition));

    test.done();
  },

  'grantInvoke works correctly'(test: Test) {
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
    expect(stack).to(haveResource('AWS::Lambda::Permission', {
      Action: 'lambda:InvokeFunction',
      Principal: 'events.amazonaws.com',
    }));
    test.deepEqual(statement.action, [ 'lambda:InvokeFunction' ]);
    test.deepEqual(statement.principal, { Service: [ 'events.amazonaws.com' ] });
    test.deepEqual(statement.effect, 'Allow');
    test.deepEqual(statement.resource, [{
      'Fn::GetAtt': [ 'SingletonLambda84c0de93353f42179b0b45b6c993251a840BCC38', 'Arn' ],
    }]);
    test.done();
  },
};
