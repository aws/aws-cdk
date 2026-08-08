import { Template, Match } from '../../assertions';
import * as kms from '../../aws-kms';
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
      runtime: lambda.Runtime.NODEJS_LATEST,
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
      runtime: lambda.Runtime.NODEJS_LATEST,
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
      runtime: lambda.Runtime.NODEJS_LATEST,
      durableConfig: { executionTimeout: cdk.Duration.seconds(0) },
    })).toThrow(/executionTimeout must be between 1 and 31622400 seconds/);

    expect(() => new lambda.Function(stack, 'Lambda2', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_LATEST,
      durableConfig: { executionTimeout: cdk.Duration.seconds(31622401) },
    })).toThrow(/executionTimeout must be between 1 and 31622400 seconds/);
  });

  test('Function validates retention period bounds', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'stack');

    expect(() => new lambda.Function(stack, 'Lambda1', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_LATEST,
      durableConfig: { executionTimeout: cdk.Duration.hours(1), retentionPeriod: cdk.Duration.days(0) },
    })).toThrow(/retentionPeriodInDays must be between 1 and 90 days/);

    expect(() => new lambda.Function(stack, 'Lambda2', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_LATEST,
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
      runtime: lambda.Runtime.NODEJS_LATEST,
      durableConfig: { executionTimeout: cdk.Duration.seconds(1) },
    })).not.toThrow();

    expect(() => new lambda.Function(stack, 'Lambda2', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_LATEST,
      durableConfig: { executionTimeout: cdk.Duration.seconds(31622400) },
    })).not.toThrow();

    expect(() => new lambda.Function(stack, 'Lambda3', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_LATEST,
      durableConfig: { executionTimeout: cdk.Duration.hours(1), retentionPeriod: cdk.Duration.days(1) },
    })).not.toThrow();

    expect(() => new lambda.Function(stack, 'Lambda4', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_LATEST,
      durableConfig: { executionTimeout: cdk.Duration.hours(1), retentionPeriod: cdk.Duration.days(90) },
    })).not.toThrow();
  });

  test('Function validates retention period requires whole days', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'stack');

    expect(() => new lambda.Function(stack, 'Lambda1', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_LATEST,
      durableConfig: { executionTimeout: cdk.Duration.hours(1), retentionPeriod: cdk.Duration.hours(25) },
    })).toThrow(/'25 hours' cannot be converted into a whole number of days/);
  });

  test('Durable function uses AWSLambdaBasicDurableExecutionRolePolicy instead of AWSLambdaBasicExecutionRole', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'stack');
    new lambda.Function(stack, 'Lambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_LATEST,
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
      runtime: lambda.Runtime.NODEJS_LATEST,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
      ManagedPolicyArns: [
        { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole']] },
      ],
    });
  });

  test('DurableConfig with kmsKey renders KMSKeyArn from a CDK-managed key and does not grant kms:Decrypt to the execution role', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'stack');
    const key = new kms.Key(stack, 'DurableKey');

    new lambda.Function(stack, 'Lambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_LATEST,
      durableConfig: { executionTimeout: cdk.Duration.hours(1), kmsKey: key },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      DurableConfig: {
        ExecutionTimeout: 3600,
        KMSKeyArn: { 'Fn::GetAtt': [stack.getLogicalId(key.node.defaultChild as cdk.CfnElement), 'Arn'] },
      },
    });

    // The Lambda service uses the CMK via the key's resource policy. CDK does
    // not attach any KMS permissions to the execution role on the user's behalf
    // — mirroring the AWS console behavior.
    Template.fromStack(stack).resourcePropertiesCountIs('AWS::IAM::Policy', {
      PolicyDocument: Match.objectLike({
        Statement: Match.arrayWith([Match.objectLike({ Action: Match.stringLikeRegexp('kms:.*') })]),
      }),
    }, 0);
  });

  test('DurableConfig with kmsKey renders KMSKeyArn from an imported key', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'stack');
    const importedArn = 'arn:aws:kms:us-east-1:123456789012:key/abcd1234-12ab-34cd-56ef-1234567890ab';
    const key = kms.Key.fromKeyArn(stack, 'ImportedKey', importedArn);

    new lambda.Function(stack, 'Lambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_LATEST,
      durableConfig: { executionTimeout: cdk.Duration.hours(1), kmsKey: key },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      DurableConfig: {
        ExecutionTimeout: 3600,
        KMSKeyArn: importedArn,
      },
    });
  });

  test('DurableConfig without kmsKey omits KMSKeyArn', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'stack');

    new lambda.Function(stack, 'Lambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_LATEST,
      durableConfig: { executionTimeout: cdk.Duration.hours(1) },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      DurableConfig: {
        ExecutionTimeout: 3600,
        KMSKeyArn: Match.absent(),
      },
    });
  });
});
