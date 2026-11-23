import type { Construct } from 'constructs';
import { Annotations, Template, Match } from '../../assertions';
import * as iam from '../../aws-iam';
import * as kms from '../../aws-kms';
import * as cdk from '../../core';
import { ValidationError } from '../../core/lib/errors';
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

  test('DurableConfig with a kmsKey renders KMSKeyArn from a key defined in the app and adds no execution role identity policy', () => {
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

    // CDK puts the durable statements on the key policy, never on the execution role's identity policy.
    Template.fromStack(stack).resourceCountIs('AWS::IAM::Policy', 0);
  });

  const lambdaViaService = { 'Fn::Join': ['', ['lambda.', { Ref: 'AWS::Region' }, '.amazonaws.com']] };
  const functionArn = (name: string) => ({
    'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':lambda:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, `:function:${name}`]],
  });
  const accountRoot = { AWS: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::', { Ref: 'AWS::AccountId' }, ':root']] } };
  const executionRole = { AWS: { 'Fn::GetAtt': [Match.stringLikeRegexp('LambdaServiceRole.*'), 'Arn'] } };
  const encryptionContextKey = 'kms:EncryptionContext:aws:lambda:FunctionArn';
  // Matches a warning by its exact acknowledgement id.
  const warningId = (id: string) => Match.stringLikeRegexp(`\\[ack: @aws-cdk/aws-lambda:${id}\\]$`);

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

  interface KeyPolicyStatement {
    readonly Action: string | string[];
    readonly Principal: unknown;
  }

  function keyPolicyStatements(stack: cdk.Stack): KeyPolicyStatement[] {
    const keys = Object.values(Template.fromStack(stack).findResources('AWS::KMS::Key'));
    return keys.flatMap(key => key.Properties.KeyPolicy.Statement);
  }

  test('DurableConfig with a kmsKey and a literal functionName scopes the key policy to the function', () => {
    const stack = new cdk.Stack(new cdk.App(), 'stack');
    newDurableFunction(stack, { functionName: 'my-durable-fn', kmsKey: new kms.Key(stack, 'DurableKey') });

    const fnArn = functionArn('my-durable-fn');
    expectStatements(stack, [
      Match.objectLike({ Principal: accountRoot, Action: 'kms:*' }),
      Match.objectLike({
        Principal: { Service: 'lambda.amazonaws.com' },
        Action: ['kms:Decrypt', 'kms:GenerateDataKey'],
        Condition: Match.objectEquals({
          StringEquals: { 'aws:SourceAccount': { Ref: 'AWS::AccountId' }, 'aws:SourceArn': fnArn, [encryptionContextKey]: fnArn },
        }),
      }),
      Match.objectLike({
        Principal: executionRole,
        Action: 'kms:Decrypt',
        Condition: Match.objectEquals({ StringEquals: { 'kms:ViaService': lambdaViaService, [encryptionContextKey]: fnArn } }),
      }),
      Match.objectLike({
        Principal: accountRoot,
        Action: 'kms:DescribeKey',
        Condition: Match.objectEquals({ StringEquals: { 'kms:ViaService': lambdaViaService } }),
      }),
      Match.objectLike({
        Principal: accountRoot,
        Action: ['kms:Decrypt', 'kms:GenerateDataKey'],
        Condition: Match.objectEquals({ StringEquals: { 'kms:ViaService': lambdaViaService, [encryptionContextKey]: fnArn } }),
      }),
    ]);
    Annotations.fromStack(stack).hasNoWarning('/stack/Lambda', Match.anyValue());
  });

  test('DurableConfig with a kmsKey and no functionName uses a wildcard function ARN and warns', () => {
    const stack = new cdk.Stack(new cdk.App(), 'stack');
    newDurableFunction(stack, { kmsKey: new kms.Key(stack, 'DurableKey') });

    const fnArn = functionArn('*');
    expectStatements(stack, [
      Match.objectLike({ Principal: accountRoot, Action: 'kms:*' }),
      Match.objectLike({
        Principal: { Service: 'lambda.amazonaws.com' },
        Action: ['kms:Decrypt', 'kms:GenerateDataKey'],
        Condition: Match.objectEquals({
          StringEquals: { 'aws:SourceAccount': { Ref: 'AWS::AccountId' } },
          ArnLike: { 'aws:SourceArn': fnArn },
          StringLike: { [encryptionContextKey]: fnArn },
        }),
      }),
      Match.objectLike({
        Principal: executionRole,
        Action: 'kms:Decrypt',
        Condition: Match.objectEquals({
          StringEquals: { 'kms:ViaService': lambdaViaService },
          StringLike: { [encryptionContextKey]: fnArn },
        }),
      }),
      Match.objectLike({
        Principal: accountRoot,
        Action: 'kms:DescribeKey',
        Condition: Match.objectEquals({ StringEquals: { 'kms:ViaService': lambdaViaService } }),
      }),
      Match.objectLike({
        Principal: accountRoot,
        Action: ['kms:Decrypt', 'kms:GenerateDataKey'],
        Condition: Match.objectEquals({
          StringEquals: { 'kms:ViaService': lambdaViaService },
          StringLike: { [encryptionContextKey]: fnArn },
        }),
      }),
    ]);
    Annotations.fromStack(stack).hasWarning('/stack/Lambda',
      Match.stringLikeRegexp('match every Lambda function in this account and Region.*Set functionName to a literal string.*durableConfigKmsKeyWildcardFunctionArn'));
  });

  test('DurableConfig with a kmsKey and a token functionName uses a wildcard function ARN and warns', () => {
    const stack = new cdk.Stack(new cdk.App(), 'stack');
    const functionName = new cdk.CfnParameter(stack, 'FunctionName').valueAsString;
    newDurableFunction(stack, { functionName, kmsKey: new kms.Key(stack, 'DurableKey') });

    Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
      KeyPolicy: Match.objectLike({
        Statement: Match.arrayWith([
          Match.objectLike({ Principal: { Service: 'lambda.amazonaws.com' }, Condition: Match.objectLike({ ArnLike: { 'aws:SourceArn': functionArn('*') } }) }),
        ]),
      }),
    });
    Annotations.fromStack(stack).hasWarning('/stack/Lambda', warningId('durableConfigKmsKeyWildcardFunctionArn'));
  });

  function newRole(scope: Construct, props: Partial<iam.RoleProps> = {}) {
    return new iam.Role(scope, 'Role', { assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'), ...props });
  }

  // Statement order carries no meaning in a key policy, so match each statement on its own and then the count.
  function expectStatements(stack: cdk.Stack, statements: object[]) {
    for (const statement of statements) {
      Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', { KeyPolicy: Match.objectLike({ Statement: Match.arrayWith([statement]) }) });
    }
    expect(keyPolicyStatements(stack)).toHaveLength(statements.length);
  }

  // The default root statement and the 3 durable statements, plus `roleStatement` when the execution role is granted.
  function expectKeyPolicy(stack: cdk.Stack, roleStatement: object | undefined) {
    const fnArn = functionArn('my-durable-fn');
    expectStatements(stack, [
      Match.objectLike({ Principal: accountRoot, Action: 'kms:*' }),
      Match.objectLike({ Principal: { Service: 'lambda.amazonaws.com' }, Action: ['kms:Decrypt', 'kms:GenerateDataKey'] }),
      ...(roleStatement ? [roleStatement] : []),
      Match.objectLike({ Principal: accountRoot, Action: 'kms:DescribeKey' }),
      Match.objectLike({
        Principal: accountRoot,
        Action: ['kms:Decrypt', 'kms:GenerateDataKey'],
        Condition: Match.objectEquals({ StringEquals: { 'kms:ViaService': lambdaViaService, [encryptionContextKey]: fnArn } }),
      }),
    ]);
  }

  const roleArnStatement = (principalArn: unknown) => Match.objectEquals({
    Effect: 'Allow',
    Principal: { AWS: principalArn },
    Action: 'kms:Decrypt',
    Resource: '*',
    Condition: { StringEquals: { 'kms:ViaService': lambdaViaService, [encryptionContextKey]: functionArn('my-durable-fn') } },
  });

  const roleConditionStatement = (roleArn: unknown) => Match.objectEquals({
    Effect: 'Allow',
    Principal: { AWS: '*' },
    Action: 'kms:Decrypt',
    Resource: '*',
    Condition: {
      StringEquals: { 'kms:ViaService': lambdaViaService, 'kms:CallerAccount': { Ref: 'AWS::AccountId' }, [encryptionContextKey]: functionArn('my-durable-fn') },
      ArnEquals: { 'aws:PrincipalArn': roleArn },
    },
  });

  const literalRoleArn = (resourceName: string) => ({
    'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::', { Ref: 'AWS::AccountId' }, `:role/${resourceName}`]],
  });

  // Statements that grant the execution role access, under either the role ARN or the aws:PrincipalArn condition.
  function executionRoleGrants(stack: cdk.Stack) {
    return keyPolicyStatements(stack).filter(statement =>
      statement.Action === 'kms:Decrypt' && JSON.stringify(statement.Principal) !== JSON.stringify(accountRoot));
  }

  test.each([
    ['in the key and function stack', (_app: cdk.App, _keyStack: cdk.Stack, fnStack: cdk.Stack) => fnStack, true, undefined],
    ['in the function stack', (_app: cdk.App, _keyStack: cdk.Stack, fnStack: cdk.Stack) => fnStack, false, undefined],
    ['in a third stack', (app: cdk.App) => new cdk.Stack(app, 'RoleStack'), false, undefined],
    ['in the key stack', (_app: cdk.App, keyStack: cdk.Stack) => keyStack, false, undefined],
    ['with a path', (_app: cdk.App, _keyStack: cdk.Stack, fnStack: cdk.Stack) => fnStack, false, '/team/'],
  ])('DurableConfig with a kmsKey matches a named role %s by aws:PrincipalArn', (_, roleStackOf, keyInFunctionStack, path) => {
    const app = new cdk.App();
    const fnStack = new cdk.Stack(app, 'FnStack');
    const keyStack = keyInFunctionStack ? fnStack : new cdk.Stack(app, 'KeyStack');
    const role = newRole(roleStackOf(app, keyStack, fnStack), { roleName: 'DurableRole', path });
    newDurableFunction(fnStack, { functionName: 'my-durable-fn', role, kmsKey: new kms.Key(keyStack, 'DurableKey') });

    // Template.fromStack synthesizes the app, so a cycle between the stacks would throw here.
    expectKeyPolicy(keyStack, roleConditionStatement(literalRoleArn(path ? 'team/DurableRole' : 'DurableRole')));
    Annotations.fromStack(fnStack).hasNoWarning('/FnStack/Lambda', warningId('durableConfigKmsKeyExecutionRoleNotGranted'));
    Template.fromStack(fnStack).resourceCountIs('AWS::IAM::Policy', 0);
  });

  test('DurableConfig with a kmsKey matches a named role with inline policies on the key without a resource cycle', () => {
    const stack = new cdk.Stack(new cdk.App(), 'stack');
    const key = new kms.Key(stack, 'DurableKey');
    const role = newRole(stack, {
      roleName: 'DurableRole',
      inlinePolicies: { kms: new iam.PolicyDocument({ statements: [new iam.PolicyStatement({ actions: ['kms:Encrypt'], resources: [key.keyArn] })] }) },
    });
    newDurableFunction(stack, { functionName: 'my-durable-fn', role, kmsKey: key });

    expectKeyPolicy(stack, roleConditionStatement(literalRoleArn('DurableRole')));
    expect(JSON.stringify(Template.fromStack(stack).findResources('AWS::KMS::Key'))).not.toContain('"Fn::GetAtt":["Role');
  });

  test.each([
    ['a literal ARN', 'arn:aws:iam::123456789012:role/DurableRole', (scope: Construct) =>
      iam.Role.fromRoleArn(scope, 'Role', 'arn:aws:iam::123456789012:role/DurableRole')],
  ])('DurableConfig with a kmsKey in another stack matches an execution role imported from %s by aws:PrincipalArn', (_, roleArn, importRole) => {
    const app = new cdk.App();
    const keyStack = new cdk.Stack(app, 'KeyStack');
    const fnStack = new cdk.Stack(app, 'FnStack');
    newDurableFunction(fnStack, { functionName: 'my-durable-fn', role: importRole(fnStack), kmsKey: new kms.Key(keyStack, 'DurableKey') });

    expectKeyPolicy(keyStack, roleConditionStatement(roleArn));
    Annotations.fromStack(fnStack).hasNoWarning('/FnStack/Lambda', warningId('durableConfigKmsKeyExecutionRoleNotGranted'));
  });

  test('DurableConfig with a kmsKey in the function stack grants the generated role by ARN', () => {
    const stack = new cdk.Stack(new cdk.App(), 'stack');
    newDurableFunction(stack, { functionName: 'my-durable-fn', kmsKey: new kms.Key(stack, 'DurableKey') });

    expectKeyPolicy(stack, roleArnStatement(executionRole.AWS));
  });

  test('DurableConfig with a kmsKey in another stack grants an unnamed role in the key stack by ARN', () => {
    const app = new cdk.App();
    const keyStack = new cdk.Stack(app, 'KeyStack');
    const fnStack = new cdk.Stack(app, 'FnStack');
    newDurableFunction(fnStack, { functionName: 'my-durable-fn', role: newRole(keyStack), kmsKey: new kms.Key(keyStack, 'DurableKey') });

    expectKeyPolicy(keyStack, roleArnStatement({ 'Fn::GetAtt': [Match.stringLikeRegexp('^Role'), 'Arn'] }));
    Annotations.fromStack(fnStack).hasNoWarning('/FnStack/Lambda', warningId('durableConfigKmsKeyExecutionRoleNotGranted'));
  });

  test('DurableConfig with a kmsKey in the function stack grants an unnamed role in a third stack by ARN', () => {
    const app = new cdk.App();
    const fnStack = new cdk.Stack(app, 'FnStack');
    const roleStack = new cdk.Stack(app, 'RoleStack');
    newDurableFunction(fnStack, { functionName: 'my-durable-fn', role: newRole(roleStack), kmsKey: new kms.Key(fnStack, 'DurableKey') });

    expectKeyPolicy(fnStack, roleArnStatement({ 'Fn::ImportValue': Match.stringLikeRegexp('^RoleStack:ExportsOutputFnGetAttRole.*Arn') }));
  });

  test('DurableConfig with a kmsKey in the function stack grants a role imported with a token ARN by ARN', () => {
    const stack = new cdk.Stack(new cdk.App(), 'stack');
    const roleArn = new cdk.CfnParameter(stack, 'RoleArn').valueAsString;
    newDurableFunction(stack, { functionName: 'my-durable-fn', role: iam.Role.fromRoleArn(stack, 'Role', roleArn), kmsKey: new kms.Key(stack, 'DurableKey') });

    expectKeyPolicy(stack, roleArnStatement({ Ref: 'RoleArn' }));
    Annotations.fromStack(stack).hasNoWarning('/stack/Lambda', warningId('durableConfigKmsKeyExecutionRoleNotGranted'));
  });

  test.each([
    ['the generated role in the function stack', (_app: cdk.App, _keyStack: cdk.Stack, _fnStack: cdk.Stack) => undefined, false],
    ['an unnamed role in a third stack', (app: cdk.App) => newRole(new cdk.Stack(app, 'RoleStack')), false],
    ['a role imported with a token ARN', (_app: cdk.App, _keyStack: cdk.Stack, fnStack: cdk.Stack) =>
      iam.Role.fromRoleArn(fnStack, 'ImportedRole', newRole(fnStack).roleArn), false],
    ['a named role with a token path', (_app: cdk.App, _keyStack: cdk.Stack, fnStack: cdk.Stack) =>
      newRole(fnStack, { roleName: 'DurableRole', path: new cdk.CfnParameter(fnStack, 'RolePath').valueAsString }), false],
    ['a role imported into the key stack with a token ARN from the function stack', (_app: cdk.App, keyStack: cdk.Stack, fnStack: cdk.Stack) =>
      iam.Role.fromRoleArn(keyStack, 'ImportedRole', newRole(fnStack).roleArn), false],
    ['a role imported by name', (_app: cdk.App, _keyStack: cdk.Stack, fnStack: cdk.Stack) =>
      iam.Role.fromRoleName(fnStack, 'ImportedRole', 'DurableRole'), false],
    ['a named role imported with a token account', (_app: cdk.App, _keyStack: cdk.Stack, fnStack: cdk.Stack) =>
      iam.Role.fromRoleArn(fnStack, 'ImportedRole', `arn:aws:iam::${new cdk.CfnParameter(fnStack, 'Account').valueAsString}:role/DurableRole`), false],
    ['an unnamed role in a nested stack of the function stack', (_app: cdk.App, _keyStack: cdk.Stack, fnStack: cdk.Stack) =>
      newRole(new cdk.NestedStack(fnStack, 'Nested')), true],
  ])('DurableConfig with a kmsKey and %s skips the execution role statement and warns', (_, roleOf, keyInFunctionStack) => {
    const app = new cdk.App();
    const fnStack = new cdk.Stack(app, 'FnStack');
    const keyStack = keyInFunctionStack ? fnStack : new cdk.Stack(app, 'KeyStack');
    const role = roleOf(app, keyStack, fnStack);
    const fn = newDurableFunction(fnStack, { functionName: 'my-durable-fn', role, kmsKey: new kms.Key(keyStack, 'DurableKey') });

    // Template.fromStack synthesizes the app, so a cycle between the stacks would throw here.
    expectKeyPolicy(keyStack, undefined);
    expect(executionRoleGrants(keyStack)).toEqual([]);
    Annotations.fromStack(fnStack).hasWarning('/FnStack/Lambda',
      Match.stringLikeRegexp('circular dependency.*Pass a role with a literal roleName.*durableConfigKmsKeyExecutionRoleNotGranted'));
    Template.fromStack(fnStack).resourceCountIs('AWS::IAM::Policy', 0);
    Template.fromStack(cdk.Stack.of(fn.role!)).resourceCountIs('AWS::IAM::Policy', 0);
  });

  test('DurableConfig with a kmsKey in a parent stack and the function in a nested stack skips the execution role statement and warns', () => {
    const parent = new cdk.Stack(new cdk.App(), 'Parent');
    const nested = new cdk.NestedStack(parent, 'Nested');
    newDurableFunction(nested, { functionName: 'my-durable-fn', kmsKey: new kms.Key(parent, 'DurableKey') });

    expectKeyPolicy(parent, undefined);
    Annotations.fromStack(parent).hasWarning('/Parent/Nested/Lambda', warningId('durableConfigKmsKeyExecutionRoleNotGranted'));
    Template.fromStack(nested).resourceCountIs('AWS::IAM::Policy', 0);
  });

  test('DurableConfig with a kmsKey in another account scopes statements to the function account and warns', () => {
    const app = new cdk.App();
    const keyStack = new cdk.Stack(app, 'KeyStack', { env: { account: '222222222222', region: 'us-east-1' } });
    const fnStack = new cdk.Stack(app, 'FnStack', { env: { account: '111111111111', region: 'us-east-1' } });
    const role = newRole(fnStack, { roleName: 'DurableRole' });
    newDurableFunction(fnStack, { functionName: 'my-durable-fn', role, kmsKey: new kms.Key(keyStack, 'DurableKey') });

    const join = (suffix: string) => ({ 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, suffix]] });
    const fnArn = join(':lambda:us-east-1:111111111111:function:my-durable-fn');
    const functionAccountRoot = { AWS: join(':iam::111111111111:root') };
    const viaService = 'lambda.us-east-1.amazonaws.com';
    expect(keyPolicyStatements(keyStack)).toHaveLength(5);
    expect(keyPolicyStatements(keyStack)).toEqual(expect.arrayContaining([
      expect.objectContaining({ Action: 'kms:*', Principal: { AWS: join(':iam::222222222222:root') } }),
      expect.objectContaining({
        Principal: { Service: 'lambda.amazonaws.com' },
        Condition: { StringEquals: { 'aws:SourceAccount': '111111111111', 'aws:SourceArn': fnArn, [encryptionContextKey]: fnArn } },
      }),
      expect.objectContaining({
        Principal: { AWS: '*' },
        Condition: {
          StringEquals: { 'kms:ViaService': viaService, 'kms:CallerAccount': '111111111111', [encryptionContextKey]: fnArn },
          ArnEquals: { 'aws:PrincipalArn': join(':iam::111111111111:role/DurableRole') },
        },
      }),
      expect.objectContaining({ Principal: functionAccountRoot, Action: 'kms:DescribeKey' }),
      expect.objectContaining({ Principal: functionAccountRoot, Action: ['kms:Decrypt', 'kms:GenerateDataKey'] }),
    ]));
    Annotations.fromStack(fnStack).hasWarning('/FnStack/Lambda',
      Match.stringLikeRegexp('account 222222222222, so the function.s account also needs IAM permissions.*durableConfigKmsKeyCrossAccount'));
  });

  test('DurableConfig with an imported kmsKey in another account warns about both the account and the key policy', () => {
    const stack = new cdk.Stack(new cdk.App(), 'stack', { env: { account: '111111111111', region: 'us-east-1' } });
    const key = kms.Key.fromKeyArn(stack, 'ImportedKey', 'arn:aws:kms:us-east-1:222222222222:key/abcd1234-12ab-34cd-56ef-1234567890ab');
    newDurableFunction(stack, { functionName: 'my-durable-fn', kmsKey: key });

    Annotations.fromStack(stack).hasWarning('/stack/Lambda', warningId('durableConfigKmsKeyCrossAccount'));
    Annotations.fromStack(stack).hasWarning('/stack/Lambda', warningId('durableConfigKmsKeyNotEditable'));
  });

  test.each([
    ['the same account', { account: '111111111111', region: 'us-east-1' }, { account: '111111111111', region: 'us-east-1' }],
    ['a key stack without an account', { region: 'us-east-1' }, { account: '111111111111', region: 'us-east-1' }],
    ['a function stack without an account', { account: '111111111111', region: 'us-east-1' }, { region: 'us-east-1' }],
  ])('DurableConfig with a kmsKey does not warn about another account for %s', (_, keyEnv, fnEnv) => {
    const app = new cdk.App();
    const keyStack = new cdk.Stack(app, 'KeyStack', { env: keyEnv });
    const fnStack = new cdk.Stack(app, 'FnStack', { env: fnEnv });
    newDurableFunction(fnStack, { functionName: 'my-durable-fn', kmsKey: new kms.Key(keyStack, 'DurableKey') });

    Annotations.fromStack(fnStack).hasNoWarning('/FnStack/Lambda', warningId('durableConfigKmsKeyCrossAccount'));
  });

  test('DurableConfig with @aws-cdk/aws-iam:minimizePolicies keeps each statement and its exact conditions', () => {
    const stack = new cdk.Stack(new cdk.App({ context: { '@aws-cdk/aws-iam:minimizePolicies': true } }), 'stack');
    newDurableFunction(stack, { functionName: 'my-durable-fn', kmsKey: new kms.Key(stack, 'DurableKey') });

    expectKeyPolicy(stack, roleArnStatement(executionRole.AWS));
  });

  test('DurableConfig with an L1 CfnKey adds the statements to its key policy', () => {
    const stack = new cdk.Stack(new cdk.App(), 'stack');
    const key = new kms.CfnKey(stack, 'DurableKey', {
      keyPolicy: {
        Version: '2012-10-17',
        Statement: [{ Effect: 'Allow', Principal: { AWS: 'arn:aws:iam::123456789012:root' }, Action: 'kms:*', Resource: '*' }],
      },
    });
    newDurableFunction(stack, { functionName: 'my-durable-fn', kmsKey: key });

    expectStatements(stack, [
      Match.objectLike({ Principal: { AWS: 'arn:aws:iam::123456789012:root' }, Action: 'kms:*' }),
      Match.objectLike({
        Principal: { Service: 'lambda.amazonaws.com' },
        Action: ['kms:Decrypt', 'kms:GenerateDataKey'],
        Condition: Match.objectEquals({
          StringEquals: {
            'aws:SourceAccount': { Ref: 'AWS::AccountId' }, 'aws:SourceArn': functionArn('my-durable-fn'), [encryptionContextKey]: functionArn('my-durable-fn'),
          },
        }),
      }),
      roleArnStatement(executionRole.AWS),
      Match.objectLike({ Principal: accountRoot, Action: 'kms:DescribeKey' }),
      Match.objectLike({ Principal: accountRoot, Action: ['kms:Decrypt', 'kms:GenerateDataKey'] }),
    ]);
  });

  test('DurableConfig with a key from Key.fromCfnKey adds the statements to the CfnKey key policy', () => {
    const stack = new cdk.Stack(new cdk.App(), 'stack');
    const cfnKey = new kms.CfnKey(stack, 'DurableKey', {
      keyPolicy: {
        Version: '2012-10-17',
        Statement: [{ Effect: 'Allow', Principal: { AWS: 'arn:aws:iam::123456789012:root' }, Action: 'kms:*', Resource: '*' }],
      },
    });
    newDurableFunction(stack, { functionName: 'my-durable-fn', kmsKey: kms.Key.fromCfnKey(cfnKey) });

    expectStatements(stack, [
      Match.objectLike({ Principal: { AWS: 'arn:aws:iam::123456789012:root' }, Action: 'kms:*' }),
      Match.objectLike({
        Principal: { Service: 'lambda.amazonaws.com' },
        Action: ['kms:Decrypt', 'kms:GenerateDataKey'],
        Condition: Match.objectEquals({
          StringEquals: {
            'aws:SourceAccount': { Ref: 'AWS::AccountId' }, 'aws:SourceArn': functionArn('my-durable-fn'), [encryptionContextKey]: functionArn('my-durable-fn'),
          },
        }),
      }),
      roleArnStatement(executionRole.AWS),
      Match.objectLike({ Principal: accountRoot, Action: 'kms:DescribeKey' }),
      Match.objectLike({ Principal: accountRoot, Action: ['kms:Decrypt', 'kms:GenerateDataKey'] }),
    ]);
    Annotations.fromStack(stack).hasNoWarning('/stack/Lambda', warningId('durableConfigKmsKeyNotEditable'));
  });

  test.each([
    ['a CfnKey without a keyPolicy', (stack: cdk.Stack) => new kms.CfnKey(stack, 'DurableKey', {})],
    ['a CfnKey with a token keyPolicy', (stack: cdk.Stack) => new kms.CfnKey(stack, 'DurableKey', {
      keyPolicy: cdk.Lazy.any({ produce: () => ({ Version: '2012-10-17', Statement: [] }) }),
    })],
    ['a custom IKeyRef that wraps a CfnKey', (stack: cdk.Stack) => {
      class CustomKey extends cdk.Resource implements kms.IKeyRef {
        public readonly keyRef: kms.KeyReference;
        constructor(scope: Construct, id: string) {
          super(scope, id);
          const cfnKey = new kms.CfnKey(this, 'Resource', { keyPolicy: { Version: '2012-10-17', Statement: [] } });
          cfnKey.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
          this.keyRef = { keyId: cfnKey.ref, keyArn: cfnKey.attrArn };
        }
      }
      return new CustomKey(stack, 'DurableKey');
    }],
  ])('DurableConfig with %s adds no statements and warns that its key policy is not editable', (_, keyOf) => {
    const stack = new cdk.Stack(new cdk.App(), 'stack');
    const kmsKey = keyOf(stack);
    newDurableFunction(stack, { functionName: 'my-durable-fn', kmsKey });

    expect(JSON.stringify(Template.fromStack(stack).toJSON())).not.toContain('kms:EncryptionContext:aws:lambda:FunctionArn');
    Annotations.fromStack(stack).hasWarning('/stack/Lambda',
      Match.stringLikeRegexp('CDK cannot edit the durableConfig.kmsKey key policy.*durableConfigKmsKeyNotEditable'));
  });

  test('DurableConfig with a kmsKey and no functionName matches a named role with a wildcard encryption context', () => {
    const app = new cdk.App();
    const keyStack = new cdk.Stack(app, 'KeyStack');
    const fnStack = new cdk.Stack(app, 'FnStack');
    newDurableFunction(fnStack, { role: newRole(fnStack, { roleName: 'DurableRole' }), kmsKey: new kms.Key(keyStack, 'DurableKey') });

    Template.fromStack(keyStack).hasResourceProperties('AWS::KMS::Key', {
      KeyPolicy: Match.objectLike({
        Statement: Match.arrayWith([Match.objectEquals({
          Effect: 'Allow',
          Principal: { AWS: '*' },
          Action: 'kms:Decrypt',
          Resource: '*',
          Condition: {
            StringEquals: { 'kms:ViaService': lambdaViaService, 'kms:CallerAccount': { Ref: 'AWS::AccountId' } },
            StringLike: { [encryptionContextKey]: functionArn('*') },
            ArnEquals: { 'aws:PrincipalArn': literalRoleArn('DurableRole') },
          },
        })]),
      }),
    });
  });

  test('DurableConfig with a kmsKey in a nested stack of the function stack grants the generated role by ARN', () => {
    const fnStack = new cdk.Stack(new cdk.App(), 'FnStack');
    const nested = new cdk.NestedStack(fnStack, 'Nested');
    newDurableFunction(fnStack, { functionName: 'my-durable-fn', kmsKey: new kms.Key(nested, 'DurableKey') });

    expectKeyPolicy(nested, roleArnStatement({ Ref: Match.stringLikeRegexp('^referencetoFnStackLambdaServiceRole.*Arn$') }));
    Annotations.fromStack(fnStack).hasNoWarning('/FnStack/Lambda', warningId('durableConfigKmsKeyExecutionRoleNotGranted'));
  });

  test('DurableConfig with a kmsKey in the function stack grants a role imported by name by ARN', () => {
    const stack = new cdk.Stack(new cdk.App(), 'stack');
    newDurableFunction(stack, { functionName: 'my-durable-fn', role: iam.Role.fromRoleName(stack, 'Role', 'DurableRole'), kmsKey: new kms.Key(stack, 'DurableKey') });

    expectKeyPolicy(stack, roleArnStatement(literalRoleArn('DurableRole')));
  });

  test.each([
    ['an explicit SYMMETRIC_DEFAULT kms.Key', (stack: cdk.Stack) => new kms.Key(stack, 'DurableKey', { keySpec: kms.KeySpec.SYMMETRIC_DEFAULT })],
    ['a kms.CfnKey with a token keySpec', (stack: cdk.Stack) => new kms.CfnKey(stack, 'DurableKey', {
      keySpec: new cdk.CfnParameter(stack, 'KeySpec').valueAsString,
      keyPolicy: { Version: '2012-10-17', Statement: [] },
    })],
  ])('DurableConfig accepts %s', (_, keyOf) => {
    const stack = new cdk.Stack(new cdk.App(), 'stack');
    const kmsKey = keyOf(stack);

    expect(() => newDurableFunction(stack, { functionName: 'my-durable-fn', kmsKey })).not.toThrow();
  });

  test('fails when the kmsKey is from Key.fromCfnKey with a non-symmetric key spec', () => {
    const stack = new cdk.Stack(new cdk.App(), 'stack');
    const cfnKey = new kms.CfnKey(stack, 'DurableKey', { keySpec: 'HMAC_256', keyUsage: 'GENERATE_VERIFY_MAC', keyPolicy: { Version: '2012-10-17', Statement: [] } });

    expect(() => newDurableFunction(stack, { kmsKey: kms.Key.fromCfnKey(cfnKey) })).toThrow(/must be a symmetric encryption key/);
  });

  test('fails when the kmsKey is a kms.CfnKey with a non-symmetric key spec', () => {
    const stack = new cdk.Stack(new cdk.App(), 'stack');
    const key = new kms.CfnKey(stack, 'DurableKey', { keySpec: 'RSA_2048', keyUsage: 'SIGN_VERIFY', keyPolicy: { Version: '2012-10-17', Statement: [] } });

    expect(() => newDurableFunction(stack, { kmsKey: key })).toThrow(/must be a symmetric encryption key/);
  });

  test('fails when the kmsKey is not a symmetric encryption key', () => {
    const stack = new cdk.Stack(new cdk.App(), 'stack');
    const key = new kms.Key(stack, 'DurableKey', { keySpec: kms.KeySpec.RSA_2048, keyUsage: kms.KeyUsage.SIGN_VERIFY });

    expect(() => newDurableFunction(stack, { kmsKey: key })).toThrow(
      'durableConfig.kmsKey must be a symmetric encryption key, got key spec "RSA_2048"; use KeySpec.SYMMETRIC_DEFAULT');
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

  test('DurableConfig with a kmsKey renders KMSKeyArn from an imported key and warns that its key policy is not editable', () => {
    const stack = new cdk.Stack(new cdk.App(), 'stack', { env: { region: 'us-east-1' } });
    const importedArn = 'arn:aws:kms:us-east-1:123456789012:key/abcd1234-12ab-34cd-56ef-1234567890ab';
    newDurableFunction(stack, { kmsKey: kms.Key.fromKeyArn(stack, 'ImportedKey', importedArn) });

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      DurableConfig: {
        ExecutionTimeout: 3600,
        KMSKeyArn: importedArn,
      },
    });
    Template.fromStack(stack).resourceCountIs('AWS::IAM::Policy', 0);
    Annotations.fromStack(stack).hasWarning('/stack/Lambda', warningId('durableConfigKmsKeyNotEditable'));
    Annotations.fromStack(stack).hasNoWarning('/stack/Lambda', warningId('durableConfigKmsKeyWildcardFunctionArn'));
  });

  test.each([
    ['an imported key', (stack: cdk.Stack) =>
      kms.Key.fromKeyArn(stack, 'ImportedKey', 'arn:aws:kms:us-west-2:123456789012:key/abcd1234-12ab-34cd-56ef-1234567890ab')],
    ['a key in a stack in another Region', (stack: cdk.Stack) =>
      new kms.Key(new cdk.Stack(stack.node.root as cdk.App, 'KeyStack', { env: { region: 'us-west-2' } }), 'DurableKey')],
  ])('fails when the kmsKey is in another Region for %s', (_, keyOf) => {
    const stack = new cdk.Stack(new cdk.App(), 'stack', { env: { region: 'us-east-1' } });

    const kmsKey = keyOf(stack);
    let error: unknown;
    try {
      newDurableFunction(stack, { kmsKey });
    } catch (e) {
      error = e;
    }
    expect(error).toBeInstanceOf(ValidationError);
    expect((error as Error).message).toEqual('durableConfig.kmsKey is in Region "us-west-2" but the function is in "us-east-1"; use a key in the function\'s Region');
  });

  test.each([
    ['an env-agnostic function stack', undefined, 'arn:aws:kms:us-west-2:123456789012:key/abcd1234-12ab-34cd-56ef-1234567890ab'],
    ['a key ARN token', 'us-east-1', undefined],
  ])('Function skips the kmsKey Region check for %s', (_, region, keyArn) => {
    const stack = new cdk.Stack(new cdk.App(), 'stack', { env: { region } });
    const arn = keyArn ?? new cdk.CfnParameter(stack, 'KeyArn').valueAsString;

    expect(() => newDurableFunction(stack, { kmsKey: kms.Key.fromKeyArn(stack, 'ImportedKey', arn) })).not.toThrow();
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
