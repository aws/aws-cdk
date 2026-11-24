import type { Construct } from 'constructs';
import { Annotations, Template, Match } from '../../assertions';
import * as iam from '../../aws-iam';
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

  const lambdaViaService = { 'Fn::Join': ['', ['lambda.', { Ref: 'AWS::Region' }, '.amazonaws.com']] };
  const functionArn = (name: string) => ({
    'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':lambda:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, `:function:${name}`]],
  });
  const accountRoot = { AWS: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::', { Ref: 'AWS::AccountId' }, ':root']] } };
  const encryptionContextKey = 'kms:EncryptionContext:aws:lambda:FunctionArn';

  function newDurableFunction(scope: Construct, props: Omit<Partial<lambda.FunctionProps>, 'durableConfig'> & { kmsKey: kms.IKeyRef }) {
    const { kmsKey, ...rest } = props;
    return new lambda.Function(scope, 'Lambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_LATEST,
      durableConfig: { executionTimeout: cdk.Duration.hours(1), kmsKey },
      ...rest,
    });
  }

  function keyPolicyStatements(stack: cdk.Stack): object[] {
    const keys = Object.values(Template.fromStack(stack).findResources('AWS::KMS::Key'));
    return keys.flatMap(key => key.Properties?.KeyPolicy?.Statement ?? []);
  }

  // Statement order carries no meaning in a key policy, so match each statement on its own and then the count.
  function expectKeyPolicyStatements(stack: cdk.Stack, statements: object[]) {
    for (const statement of statements) {
      Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', { KeyPolicy: Match.objectLike({ Statement: Match.arrayWith([statement]) }) });
    }
    expect(keyPolicyStatements(stack)).toHaveLength(statements.length);
  }

  const lambdaServiceStatement = (name: string) => Match.objectEquals({
    Effect: 'Allow',
    Principal: { Service: 'lambda.amazonaws.com' },
    Action: ['kms:Decrypt', 'kms:GenerateDataKey'],
    Resource: '*',
    Condition: name === '*'
      ? { StringEquals: { 'aws:SourceAccount': { Ref: 'AWS::AccountId' } }, ArnLike: { 'aws:SourceArn': functionArn('*') }, StringLike: { [encryptionContextKey]: functionArn('*') } }
      : { StringEquals: { 'aws:SourceAccount': { Ref: 'AWS::AccountId' }, 'aws:SourceArn': functionArn(name), [encryptionContextKey]: functionArn(name) } },
  });

  function expectExecutionRoleStatement(stack: cdk.Stack, name: string, keyArn: unknown) {
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([Match.objectEquals({
          Effect: 'Allow',
          Action: 'kms:Decrypt',
          Resource: keyArn,
          Condition: name === '*'
            ? { StringEquals: { 'kms:ViaService': lambdaViaService }, StringLike: { [encryptionContextKey]: functionArn('*') } }
            : { StringEquals: { 'kms:ViaService': lambdaViaService, [encryptionContextKey]: functionArn(name) } },
        })]),
      },
    });
  }

  const keyArnOf = (stack: cdk.Stack, key: kms.Key) => ({ 'Fn::GetAtt': [stack.getLogicalId(key.node.defaultChild as cdk.CfnElement), 'Arn'] });

  test('DurableConfig with a kmsKey renders KMSKeyArn', () => {
    const stack = new cdk.Stack(new cdk.App(), 'stack');
    const key = new kms.Key(stack, 'DurableKey');
    newDurableFunction(stack, { kmsKey: key });

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      DurableConfig: { ExecutionTimeout: 3600, KMSKeyArn: keyArnOf(stack, key) },
    });
  });

  test('DurableConfig with a kmsKey and a literal functionName scopes the key policy and the execution role to the function', () => {
    const stack = new cdk.Stack(new cdk.App(), 'stack');
    const key = new kms.Key(stack, 'DurableKey');
    newDurableFunction(stack, { functionName: 'my-durable-fn', kmsKey: key });

    expectKeyPolicyStatements(stack, [
      Match.objectLike({ Principal: accountRoot, Action: 'kms:*' }),
      lambdaServiceStatement('my-durable-fn'),
    ]);
    expectExecutionRoleStatement(stack, 'my-durable-fn', keyArnOf(stack, key));
    Annotations.fromStack(stack).hasNoWarning('/stack/Lambda', Match.anyValue());
  });

  test.each([
    ['no functionName', (_stack: cdk.Stack) => undefined],
    ['a token functionName', (stack: cdk.Stack) => new cdk.CfnParameter(stack, 'FunctionName').valueAsString],
  ])('DurableConfig with a kmsKey and %s uses a wildcard function ARN', (_, functionNameOf) => {
    const stack = new cdk.Stack(new cdk.App(), 'stack');
    const key = new kms.Key(stack, 'DurableKey');
    newDurableFunction(stack, { functionName: functionNameOf(stack), kmsKey: key });

    expectKeyPolicyStatements(stack, [
      Match.objectLike({ Principal: accountRoot, Action: 'kms:*' }),
      lambdaServiceStatement('*'),
    ]);
    expectExecutionRoleStatement(stack, '*', keyArnOf(stack, key));
  });

  test('DurableConfig with a kmsKey in another stack adds no reference from the key stack to the function stack', () => {
    const app = new cdk.App();
    const keyStack = new cdk.Stack(app, 'KeyStack');
    const fnStack = new cdk.Stack(app, 'FnStack');
    newDurableFunction(fnStack, { functionName: 'my-durable-fn', kmsKey: new kms.Key(keyStack, 'DurableKey') });

    expectKeyPolicyStatements(keyStack, [
      Match.objectLike({ Principal: accountRoot, Action: 'kms:*' }),
      lambdaServiceStatement('my-durable-fn'),
    ]);
    expect(JSON.stringify(Template.fromStack(keyStack).toJSON())).not.toContain('Fn::ImportValue');
    expectExecutionRoleStatement(fnStack, 'my-durable-fn', { 'Fn::ImportValue': Match.stringLikeRegexp('^KeyStack:ExportsOutputFnGetAttDurableKey.*Arn') });
  });

  test('DurableConfig with a kmsKey in a nested stack grants the execution role through a nested stack output', () => {
    const fnStack = new cdk.Stack(new cdk.App(), 'FnStack');
    const nested = new cdk.NestedStack(fnStack, 'Nested');
    newDurableFunction(fnStack, { functionName: 'my-durable-fn', kmsKey: new kms.Key(nested, 'DurableKey') });

    expectKeyPolicyStatements(nested, [
      Match.objectLike({ Principal: accountRoot, Action: 'kms:*' }),
      lambdaServiceStatement('my-durable-fn'),
    ]);
    expectExecutionRoleStatement(fnStack, 'my-durable-fn', {
      'Fn::GetAtt': [Match.stringLikeRegexp('^NestedNestedStackNestedNestedStackResource'), Match.stringLikeRegexp('^Outputs\\.FnStackNestedDurableKey.*Arn$')],
    });
  });

  test('DurableConfig with a kmsKey grants a role whose inline policy references the key without a cycle', () => {
    const stack = new cdk.Stack(new cdk.App(), 'stack');
    const key = new kms.Key(stack, 'DurableKey');
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      inlinePolicies: { kms: new iam.PolicyDocument({ statements: [new iam.PolicyStatement({ actions: ['kms:Encrypt'], resources: [key.keyArn] })] }) },
    });
    newDurableFunction(stack, { functionName: 'my-durable-fn', role, kmsKey: key });

    expectExecutionRoleStatement(stack, 'my-durable-fn', keyArnOf(stack, key));
  });

  test('DurableConfig with @aws-cdk/aws-iam:minimizePolicies keeps the exact conditions', () => {
    const stack = new cdk.Stack(new cdk.App({ context: { '@aws-cdk/aws-iam:minimizePolicies': true } }), 'stack');
    const key = new kms.Key(stack, 'DurableKey');
    newDurableFunction(stack, { functionName: 'my-durable-fn', kmsKey: key });

    expectKeyPolicyStatements(stack, [
      Match.objectLike({ Principal: accountRoot, Action: 'kms:*' }),
      lambdaServiceStatement('my-durable-fn'),
    ]);
    expectExecutionRoleStatement(stack, 'my-durable-fn', keyArnOf(stack, key));
  });

  const rootPolicy = {
    Version: '2012-10-17',
    Statement: [{ Effect: 'Allow', Principal: { AWS: 'arn:aws:iam::123456789012:root' }, Action: 'kms:*', Resource: '*' }],
  };

  test.each([
    ['an L1 CfnKey', (stack: cdk.Stack) => new kms.CfnKey(stack, 'DurableKey', { keyPolicy: rootPolicy })],
    ['a key from Key.fromCfnKey', (stack: cdk.Stack) => kms.Key.fromCfnKey(new kms.CfnKey(stack, 'DurableKey', { keyPolicy: rootPolicy }))],
  ])('DurableConfig with %s adds the Lambda service principal statement to its key policy', (_, keyOf) => {
    const stack = new cdk.Stack(new cdk.App(), 'stack');
    newDurableFunction(stack, { functionName: 'my-durable-fn', kmsKey: keyOf(stack) });

    expectKeyPolicyStatements(stack, [
      Match.objectLike({ Principal: { AWS: 'arn:aws:iam::123456789012:root' }, Action: 'kms:*' }),
      lambdaServiceStatement('my-durable-fn'),
    ]);
    expectExecutionRoleStatement(stack, 'my-durable-fn', { 'Fn::GetAtt': ['DurableKey', 'Arn'] });
    Annotations.fromStack(stack).hasNoWarning('/stack/Lambda', Match.anyValue());
  });

  const importedKeyArn = 'arn:aws:kms:us-east-1:123456789012:key/abcd1234-12ab-34cd-56ef-1234567890ab';

  test.each([
    ['an imported key', (stack: cdk.Stack) => kms.Key.fromKeyArn(stack, 'DurableKey', importedKeyArn), importedKeyArn],
    ['a CfnKey without a keyPolicy', (stack: cdk.Stack) => new kms.CfnKey(stack, 'DurableKey', {}), { 'Fn::GetAtt': ['DurableKey', 'Arn'] }],
    ['a CfnKey with a null keyPolicy', (stack: cdk.Stack) => new kms.CfnKey(stack, 'DurableKey', { keyPolicy: null }), { 'Fn::GetAtt': ['DurableKey', 'Arn'] }],
    ['a CfnKey with a token keyPolicy', (stack: cdk.Stack) => new kms.CfnKey(stack, 'DurableKey', {
      keyPolicy: cdk.Lazy.any({ produce: () => rootPolicy }),
    }), { 'Fn::GetAtt': ['DurableKey', 'Arn'] }],
    ['a custom IKeyRef that wraps a CfnKey', (stack: cdk.Stack) => {
      class CustomKey extends cdk.Resource implements kms.IKeyRef {
        public readonly keyRef: kms.KeyReference;
        constructor(scope: Construct, id: string) {
          super(scope, id);
          const cfnKey = new kms.CfnKey(this, 'Resource', { keyPolicy: rootPolicy });
          cfnKey.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
          this.keyRef = { keyId: cfnKey.ref, keyArn: cfnKey.attrArn };
        }
      }
      return new CustomKey(stack, 'DurableKey');
    }, { 'Fn::GetAtt': [Match.stringLikeRegexp('^DurableKey'), 'Arn'] }],
  ])('DurableConfig with %s grants only the execution role and warns that the key policy is incomplete', (_, keyOf, keyArn) => {
    const stack = new cdk.Stack(new cdk.App(), 'stack');
    newDurableFunction(stack, { functionName: 'my-durable-fn', kmsKey: keyOf(stack) });

    expect(JSON.stringify(keyPolicyStatements(stack))).not.toContain('lambda.amazonaws.com');
    expectExecutionRoleStatement(stack, 'my-durable-fn', keyArn);
    Annotations.fromStack(stack).hasWarning('/stack/Lambda',
      Match.stringLikeRegexp('CDK cannot add every durableConfig.kmsKey statement to the key policy.*durableConfigKmsKeyPolicyIncomplete'));
  });

  test('DurableConfig with a kmsKey in another account adds the Lambda service principal statement and warns that the key policy is incomplete', () => {
    const app = new cdk.App();
    const keyStack = new cdk.Stack(app, 'KeyStack', { env: { account: '222222222222', region: 'us-east-1' } });
    const fnStack = new cdk.Stack(app, 'FnStack', { env: { account: '111111111111', region: 'us-east-1' } });
    newDurableFunction(fnStack, { functionName: 'my-durable-fn', kmsKey: new kms.Key(keyStack, 'DurableKey') });

    const partitionFnArn = { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':lambda:us-east-1:111111111111:function:my-durable-fn']] };
    expectKeyPolicyStatements(keyStack, [
      Match.objectLike({ Action: 'kms:*' }),
      Match.objectEquals({
        Effect: 'Allow',
        Principal: { Service: 'lambda.amazonaws.com' },
        Action: ['kms:Decrypt', 'kms:GenerateDataKey'],
        Resource: '*',
        Condition: { StringEquals: { 'aws:SourceAccount': '111111111111', 'aws:SourceArn': partitionFnArn, [encryptionContextKey]: partitionFnArn } },
      }),
    ]);
    Template.fromStack(fnStack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([Match.objectLike({
          Action: 'kms:Decrypt',
          Condition: { StringEquals: { 'kms:ViaService': 'lambda.us-east-1.amazonaws.com', [encryptionContextKey]: partitionFnArn } },
        })]),
      },
    });
    Annotations.fromStack(fnStack).hasWarning('/FnStack/Lambda',
      Match.stringLikeRegexp('CDK cannot add every durableConfig.kmsKey statement to the key policy.*durableConfigKmsKeyPolicyIncomplete'));
  });

  test('fails when the kmsKey is an alias', () => {
    const stack = new cdk.Stack(new cdk.App(), 'stack');
    const alias = new kms.Key(stack, 'DurableKey').addAlias('alias/durable');

    expect(() => newDurableFunction(stack, { kmsKey: alias })).toThrow(
      'durableConfig.kmsKey must be a KMS key, not an alias ("stack/DurableKey/Alias"); pass the key itself');
  });

  test.each(['alias/durable', 'alias/my-key'])('fails when the kmsKey is imported from the alias ARN %s', (aliasName) => {
    const stack = new cdk.Stack(new cdk.App(), 'stack', { env: { region: 'us-east-1' } });
    const key = kms.Key.fromKeyArn(stack, 'ImportedKey', `arn:aws:kms:us-east-1:123456789012:${aliasName}`);

    expect(() => newDurableFunction(stack, { kmsKey: key })).toThrow(/durableConfig.kmsKey must be a KMS key, not an alias/);
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
