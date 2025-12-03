import { Template } from '../../assertions';
import * as cdk from '../../core';
import * as lambda from '../lib';

describe('durable config', () => {
  test('DurableConfig with execution timeout only', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'stack');
    new lambda.Function(stack, 'Lambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      durableConfig: { executionTimeout: cdk.Duration.hours(1) },
    });
    // WHEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      DurableConfig: {
        ExecutionTimeout: 3600,
      },
    });
  });

  test('DurableConfig with execution timeout and retention period', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'stack');
    new lambda.Function(stack, 'Lambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      durableConfig: { executionTimeout: cdk.Duration.hours(2), retentionPeriod: cdk.Duration.days(60) },
    });
    // WHEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      DurableConfig: {
        ExecutionTimeout: 7200,
        RetentionPeriodInDays: 60,
      },
    });
  });

  test('Function validates execution timeout bounds', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'stack');

    expect(() => new lambda.Function(stack, 'Lambda1', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      durableConfig: { executionTimeout: cdk.Duration.seconds(0) },
    })).toThrow(/executionTimeout must be between 1 and 31622400 seconds/);

    expect(() => new lambda.Function(stack, 'Lambda2', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      durableConfig: { executionTimeout: cdk.Duration.seconds(31622401) },
    })).toThrow(/executionTimeout must be between 1 and 31622400 seconds/);
  });

  test('Function validates retention period bounds', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'stack');

    expect(() => new lambda.Function(stack, 'Lambda1', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      durableConfig: { executionTimeout: cdk.Duration.hours(1), retentionPeriod: cdk.Duration.days(0) },
    })).toThrow(/retentionPeriodInDays must be between 1 and 90 days/);

    expect(() => new lambda.Function(stack, 'Lambda2', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      durableConfig: { executionTimeout: cdk.Duration.hours(1), retentionPeriod: cdk.Duration.days(91) },
    })).toThrow(/retentionPeriodInDays must be between 1 and 90 days/);
  });

  test('DurableConfig allows valid boundary values', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'stack');

    // Should not throw
    expect(() => new lambda.Function(stack, 'Lambda1', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      durableConfig: { executionTimeout: cdk.Duration.seconds(1) },
    })).not.toThrow();

    expect(() => new lambda.Function(stack, 'Lambda2', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      durableConfig: { executionTimeout: cdk.Duration.seconds(31622400) },
    })).not.toThrow();

    expect(() => new lambda.Function(stack, 'Lambda3', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      durableConfig: { executionTimeout: cdk.Duration.hours(1), retentionPeriod: cdk.Duration.days(1) },
    })).not.toThrow();

    expect(() => new lambda.Function(stack, 'Lambda4', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      durableConfig: { executionTimeout: cdk.Duration.hours(1), retentionPeriod: cdk.Duration.days(90) },
    })).not.toThrow();
  });

  test('Function validates retention period requires whole days', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'stack');

    expect(() => new lambda.Function(stack, 'Lambda1', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      durableConfig: { executionTimeout: cdk.Duration.hours(1), retentionPeriod: cdk.Duration.hours(25) },
    })).toThrow(/'25 hours' cannot be converted into a whole number of days/);
  });

  test('Durable function uses AWSLambdaBasicDurableExecutionRolePolicy instead of AWSLambdaBasicExecutionRole', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'stack');
    new lambda.Function(stack, 'Lambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      durableConfig: { executionTimeout: cdk.Duration.hours(1) },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
      ManagedPolicyArns: [
        { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::aws:policy/service-role/AWSLambdaBasicDurableExecutionRolePolicy']] },
      ],
    });
  });

  test('Non-durable function uses AWSLambdaBasicExecutionRole', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'stack');
    new lambda.Function(stack, 'Lambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
      ManagedPolicyArns: [
        { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole']] },
      ],
    });
  });
});
