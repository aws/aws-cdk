import { Template } from '@aws-cdk/assertions';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import { testDeprecated } from '@aws-cdk/cdk-build-tools';
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
        runtime: lambda.Runtime.PYTHON_3_9,
        handler: 'index.hello',
        timeout: cdk.Duration.minutes(5),
      });
    }

    // THEN
    Template.fromStack(stack).templateMatches({
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
            Runtime: 'python3.9',
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
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'index.hello',
      timeout: cdk.Duration.minutes(5),
    });
    const dependency = new iam.User(stack, 'dependencyUser');

    // WHEN
    singleton.addDependency(dependency);

    // THEN
    Template.fromStack(stack).hasResource('AWS::Lambda::Function', {
      DependsOn: [
        'dependencyUser1B9CB07E',
        'SingletonLambda84c0de93353f42179b0b45b6c993251aServiceRole26D59235',
      ],
    });
  });

  test('dependsOn are correctly added', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const singleton = new lambda.SingletonFunction(stack, 'Singleton', {
      uuid: '84c0de93-353f-4217-9b0b-45b6c993251a',
      code: new lambda.InlineCode('def hello(): pass'),
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'index.hello',
      timeout: cdk.Duration.minutes(5),
    });
    const user = new iam.User(stack, 'user');

    // WHEN
    singleton.dependOn(user);

    // THEN
    Template.fromStack(stack).hasResource('AWS::IAM::User', {
      DependsOn: [
        'SingletonLambda84c0de93353f42179b0b45b6c993251a840BCC38',
        'SingletonLambda84c0de93353f42179b0b45b6c993251aServiceRole26D59235',
      ],
    });
  });

  test('Environment is added to Lambda, when .addEnvironment() is provided one key pair', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const singleton = new lambda.SingletonFunction(stack, 'Singleton', {
      uuid: '84c0de93-353f-4217-9b0b-45b6c993251a',
      code: new lambda.InlineCode('def hello(): pass'),
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'index.hello',
      timeout: cdk.Duration.minutes(5),
    });

    // WHEN
    singleton.addEnvironment('KEY', 'value');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      Environment: {
        Variables: {
          KEY: 'value',
        },
      },
    });
  });

  test('Layer is added to Lambda, when .addLayers() is provided a valid layer', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const singleton = new lambda.SingletonFunction(stack, 'Singleton', {
      uuid: '84c0de93-353f-4217-9b0b-45b6c993251a',
      code: new lambda.InlineCode('def hello(): pass'),
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'index.hello',
      timeout: cdk.Duration.minutes(5),
    });
    const bucket = new s3.Bucket(stack, 'Bucket');
    const layer = new lambda.LayerVersion(stack, 'myLayer', {
      code: new lambda.S3Code(bucket, 'ObjectKey'),
      compatibleRuntimes: [lambda.Runtime.PYTHON_3_9],
    });

    // WHEN
    singleton.addLayers(layer);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      Layers: [{
        Ref: 'myLayerBA1B098A',
      }],
    });
  });

  test('grantInvoke works correctly', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const singleton = new lambda.SingletonFunction(stack, 'Singleton', {
      uuid: '84c0de93-353f-4217-9b0b-45b6c993251a',
      code: new lambda.InlineCode('def hello(): pass'),
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'index.hello',
    });

    // WHEN
    const invokeResult = singleton.grantInvoke(new iam.ServicePrincipal('events.amazonaws.com'));
    const statement = stack.resolve(invokeResult.resourceStatement?.toJSON());

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
      Action: 'lambda:InvokeFunction',
      Principal: 'events.amazonaws.com',
    });
    expect(statement.Action).toEqual('lambda:InvokeFunction');
    expect(statement.Principal).toEqual({ Service: 'events.amazonaws.com' });
    expect(statement.Effect).toEqual('Allow');
    expect(statement.Resource).toEqual([
      { 'Fn::GetAtt': ['SingletonLambda84c0de93353f42179b0b45b6c993251a840BCC38', 'Arn'] },
      { 'Fn::Join': ['', [{ 'Fn::GetAtt': ['SingletonLambda84c0de93353f42179b0b45b6c993251a840BCC38', 'Arn'] }, ':*']] },
    ]);
  });

  test('check edge compatibility', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const singleton = new lambda.SingletonFunction(stack, 'Singleton', {
      uuid: '84c0de93-353f-4217-9b0b-45b6c993251a',
      code: new lambda.InlineCode('def hello(): pass'),
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'index.hello',
      environment: {
        KEY: 'value',
      },
    });

    // THEN
    expect(() => singleton._checkEdgeCompatibility())
      .toThrow(/contains environment variables .* and is not compatible with Lambda@Edge/);
  });

  test('logGroup is correctly returned', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const singleton = new lambda.SingletonFunction(stack, 'Singleton', {
      uuid: '84c0de93-353f-4217-9b0b-45b6c993251a',
      code: new lambda.InlineCode('def hello(): pass'),
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'index.hello',
      timeout: cdk.Duration.minutes(5),
    });

    // THEN
    expect(singleton.logGroup.logGroupName).toBeDefined();
    expect(singleton.logGroup.logGroupArn).toBeDefined();
  });

  test('runtime is correctly returned', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const singleton = new lambda.SingletonFunction(stack, 'Singleton', {
      uuid: '84c0de93-353f-4217-9b0b-45b6c993251a',
      code: new lambda.InlineCode('def hello(): pass'),
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'index.hello',
      timeout: cdk.Duration.minutes(5),
    });

    // THEN
    expect(singleton.runtime).toStrictEqual(lambda.Runtime.PYTHON_3_9);
  });

  testDeprecated('current version of a singleton function', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const singleton = new lambda.SingletonFunction(stack, 'Singleton', {
      uuid: '84c0de93-353f-4217-9b0b-45b6c993251a',
      code: new lambda.InlineCode('foo'),
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler',
    });

    // WHEN
    const version = singleton.currentVersion;
    version.addAlias('foo');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Version', {
      FunctionName: {
        Ref: 'SingletonLambda84c0de93353f42179b0b45b6c993251a840BCC38',
      },
    });
  });

  test('bind to vpc and access connections', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2 });
    const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup', {
      vpc: vpc,
    });

    // WHEN
    const singleton = new lambda.SingletonFunction(stack, 'Singleton', {
      uuid: '84c0de93-353f-4217-9b0b-45b6c993251a',
      code: new lambda.InlineCode('foo'),
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler',
      securityGroups: [securityGroup],
      vpc: vpc,
    });

    // THEN
    expect(singleton.isBoundToVpc).toBeTruthy();
    expect(singleton.connections).toEqual(new ec2.Connections({ securityGroups: [securityGroup] }));
  });
});
