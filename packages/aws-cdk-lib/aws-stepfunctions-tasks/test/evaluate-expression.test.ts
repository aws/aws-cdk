import { Annotations, Match, Template } from '../../assertions';
import type { CfnRole } from '../../aws-iam';
import { PolicyStatement } from '../../aws-iam';
import type { IFunction } from '../../aws-lambda';
import { Architecture, Runtime, RuntimeFamily } from '../../aws-lambda';
import * as sfn from '../../aws-stepfunctions';
import { App, Lazy, Stack } from '../../core';
import * as cxapi from '../../cx-api';
import * as tasks from '../lib';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

/** Logical ID of the only Lambda function in the stack. */
function evalFnLogicalId(): string {
  const ids = Object.keys(Template.fromStack(stack).findResources('AWS::Lambda::Function'));
  expect(ids).toHaveLength(1);
  return ids[0];
}

test('Eval with Node.js', () => {
  // WHEN
  const task = new tasks.EvaluateExpression(stack, 'Task', {
    expression: '$.a + $.b',
  });
  new sfn.StateMachine(stack, 'SM', {
    definitionBody: sfn.DefinitionBody.fromChainable(task),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::StepFunctions::StateMachine', {
    DefinitionString: {
      'Fn::Join': [
        '',
        [
          '{"StartAt":"Task","States":{"Task":{"End":true,"Type":"Task","Resource":"',
          {
            'Fn::GetAtt': [evalFnLogicalId(), 'Arn'],
          },
          '","Parameters":{"expression":"$.a + $.b","expressionAttributeValues":{"$.a.$":"$.a","$.b.$":"$.b"}}}}}',
        ],
      ],
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
    Runtime: 'nodejs24.x',
  });
});

test('expression does not contain paths', () => {
  // WHEN
  const task = new tasks.EvaluateExpression(stack, 'Task', {
    expression: '2 + 2',
  });
  new sfn.StateMachine(stack, 'SM', {
    definitionBody: sfn.DefinitionBody.fromChainable(task),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::StepFunctions::StateMachine', {
    DefinitionString: {
      'Fn::Join': [
        '',
        [
          '{"StartAt":"Task","States":{"Task":{"End":true,"Type":"Task","Resource":"',
          {
            'Fn::GetAtt': [evalFnLogicalId(), 'Arn'],
          },
          '","Parameters":{"expression":"2 + 2","expressionAttributeValues":{}}}}}',
        ],
      ],
    },
  });
});

test('with dash and underscore in path', () => {
  // WHEN
  const task = new tasks.EvaluateExpression(stack, 'Task', {
    expression: '$.a_b + $.c-d + $[_e]',
  });
  new sfn.StateMachine(stack, 'SM', {
    definitionBody: sfn.DefinitionBody.fromChainable(task),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::StepFunctions::StateMachine', {
    DefinitionString: {
      'Fn::Join': [
        '',
        [
          '{"StartAt":"Task","States":{"Task":{"End":true,"Type":"Task","Resource":"',
          {
            'Fn::GetAtt': [evalFnLogicalId(), 'Arn'],
          },
          '","Parameters":{"expression":"$.a_b + $.c-d + $[_e]","expressionAttributeValues":{"$.a_b.$":"$.a_b","$.c-d.$":"$.c-d","$[_e].$":"$[_e]"}}}}}',
        ],
      ],
    },
  });
});

test('With Node.js 20.x', () => {
  // WHEN
  const task = new tasks.EvaluateExpression(stack, 'Task', {
    expression: '$.a + $.b',
    runtime: new Runtime('nodejs20.x', RuntimeFamily.NODEJS),
  });
  new sfn.StateMachine(stack, 'SM', {
    definition: task,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
    Runtime: 'nodejs20.x',
  });
});

test('With Node.js 22.x', () => {
  // WHEN
  const task = new tasks.EvaluateExpression(stack, 'Task', {
    expression: '$.a + $.b',
    runtime: Runtime.NODEJS_22_X,
  });
  new sfn.StateMachine(stack, 'SM', {
    definition: task,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
    Runtime: 'nodejs22.x',
  });
});

test('With Node.js 24.x', () => {
  // WHEN
  const task = new tasks.EvaluateExpression(stack, 'Task', {
    expression: '$.a + $.b',
    runtime: Runtime.NODEJS_24_X,
  });
  new sfn.StateMachine(stack, 'SM', {
    definition: task,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
    Runtime: 'nodejs24.x',
  });
});

test('With ARM64 architecture', () => {
  // WHEN
  const task = new tasks.EvaluateExpression(stack, 'Task', {
    expression: '$.a + $.b',
    architecture: Architecture.ARM_64,
  });
  new sfn.StateMachine(stack, 'SM', {
    definition: task,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
    Architectures: ['arm64'],
  });
});

test('With X86_64 architecture', () => {
  // WHEN
  const task = new tasks.EvaluateExpression(stack, 'Task', {
    expression: '$.a + $.b',
    architecture: Architecture.X86_64,
  });
  new sfn.StateMachine(stack, 'SM', {
    definition: task,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
    Architectures: ['x86_64'],
  });
});

describe('fails when a referenced path is inside a string or template literal', () => {
  test.each([
    ['single-quoted string', "'year=$.year'"],
    ['double-quoted string', '"year=$.year"'],
    ['template literal text (no ${})', '`year=$.year`'],
    ['bare-brace template', '`{$.year}`'],
    ['JSON.parse of a quoted path', "JSON.parse('$.year')"],
  ])('fails for a path inside a %s', (_name, expression) => {
    expect(() => new tasks.EvaluateExpression(stack, 'Task', { expression }))
      .toThrow(/are used as literal text inside a (plain string|template literal)/);
  });

  test('fails and names the offending path with a migration hint', () => {
    expect(() => new tasks.EvaluateExpression(stack, 'Task', { expression: "'hello $.user'" }))
      .toThrow(/\$\.user.*e\.g\. `\.\.\.\$\{\$\.user\}\.\.\.`/);
  });
});

describe('accepts paths in code position', () => {
  test.each([
    ['arithmetic', '$.a + $.b'],
    ['division (slash is just an operator now)', '$.a / $.b'],
    ['template interpolation ${$.x}', '`year=${$.year}`'],
    ['method call arguments', 'Math.max($.a, $.b)'],
    ['JSON.parse of a value (no quotes)', 'JSON.parse($.body)'],
    ['array literal element', '[$.a, $.b]'],
    ['string concat with path outside the quotes', "$.first + ' ' + $.last"],
    ['no referenced paths', '2 + 2'],
  ])('does not throw for %s', (_name, expression) => {
    expect(() => {
      const task = new tasks.EvaluateExpression(stack, 'Task', { expression });
      new sfn.StateMachine(stack, 'SM', { definitionBody: sfn.DefinitionBody.fromChainable(task) });
    }).not.toThrow();
  });
});

describe('skips validation for tokenized expressions', () => {
  test('does not validate a tokenized expression', () => {
    // A token cannot be inspected at synth time, so the check is skipped even for a
    // shape that would otherwise be rejected.
    expect(() => {
      const task = new tasks.EvaluateExpression(stack, 'Task', {
        expression: Lazy.string({ produce: () => "'year=$.year'" }),
      });
      new sfn.StateMachine(stack, 'SM', { definitionBody: sfn.DefinitionBody.fromChainable(task) });
    }).not.toThrow();
  });
});

describe('template literals: interpolation is accepted, bare paths are rejected', () => {
  // Happy paths: state paths referenced via `${...}` interpolation are code position and
  // resolve at runtime, so the construct accepts them.
  test.each([
    ['a single interpolation', '`Now waiting ${$.waitSeconds} seconds`'],
    ['multiple interpolations', '`${$.first} ${$.last}`'],
    ['interpolation inside an S3 path', '`s3://bucket/year=${$.year}/month=${$.month}/`'],
  ])('accepts %s', (_name, expression) => {
    expect(() => {
      const task = new tasks.EvaluateExpression(stack, 'Task', { expression });
      new sfn.StateMachine(stack, 'SM', { definitionBody: sfn.DefinitionBody.fromChainable(task) });
    }).not.toThrow();
  });

  // Failure paths: a bare path in template text (not inside `${...}`) is never interpolated,
  // so the construct rejects it at synth with the migration hint.
  test.each([
    ['a bare path in template text', '`total: $.n`'],
    ['a bare path in an S3-path template', '`s3://bucket/year=$.year/`'],
    ['a bare-brace path that looks like interpolation but is not', '`{$.x}`'],
  ])('fails for %s', (_name, expression) => {
    expect(() => new tasks.EvaluateExpression(stack, 'Task', { expression }))
      .toThrow(/are used as literal text inside a template literal/);
  });
});

describe('EvaluateExpression expression shapes', () => {
  // Synthesizes one EvaluateExpression task and returns its `expression` and
  // `expressionAttributeValues` so tests can assert the construct emits them correctly.
  // Those two fields live inside the state machine's DefinitionString, which renders as an
  // Fn::Join around the eval Lambda ARN. We're not testing the join itself; we just keep its
  // string parts (dropping the ARN token, which sits in `Resource`, not the fields we check)
  // and rejoin them to recover parseable JSON.
  function synth(expression: string): { expression: string; expressionAttributeValues: Record<string, string> } {
    const task = new tasks.EvaluateExpression(stack, 'Task', { expression });
    new sfn.StateMachine(stack, 'SM', { definitionBody: sfn.DefinitionBody.fromChainable(task) });

    const resources = Template.fromStack(stack).findResources('AWS::StepFunctions::StateMachine');
    const def = Object.values(resources)[0].Properties.DefinitionString;
    const combined: string = typeof def === 'string'
      ? def
      : def['Fn::Join'][1].map((part: unknown) => (typeof part === 'string' ? part : '')).join('');
    return JSON.parse(combined).States.Task.Parameters;
  }

  describe('synthesizes and binds each referenced path', () => {
    test.each<[string, string, string[]]>([
      ['arithmetic', '$.a + $.b', ['$.a', '$.b']],
      ['string-concat multi-line', 'const t = $.runDate;\n' + '({ regionId: $.regionId })', ['$.runDate', '$.regionId']],
      ['template literal interpolation', '`${$.Execution.Id}/requests/`', ['$.Execution.Id']],
      ['array bare elements', '[$.srcPath, $.destPath, 1]', ['$.srcPath', '$.destPath']],
      ['method chain', "($.list).filter(x => x.includes('a')).join(',')", ['$.list']],
      ['JSON.parse of a path value', 'JSON.parse($.body)', ['$.body']],
      ['JSON array built with interpolation', 'JSON.parse(`["submit","--id","${$.MarketplaceId}"]`)', ['$.MarketplaceId']],
      ['Date construction from a path', 'new Date($.epoch).toISOString()', ['$.epoch']],
      ['a self-invoking function returning a value', '(function(){ var d = new Date($.date); return { t: d.getTime() }; })()', ['$.date']],
      ['multiple statements returning an object', 'const t = $.runDate; ({ day: t })', ['$.runDate']],
      ['ternary', "$.type == 'Forward' ? 'A' : 'B'", ['$.type']],
      ['boolean comparison', "typeof $.Cause == 'string'", ['$.Cause']],
      ['a single referenced path', '$.IsPrimaryLocale', ['$.IsPrimaryLocale']],
      ['try/catch', "try { JSON.parse($.Cause).m } catch (e) { 'x' }", ['$.Cause']],
    ])('binds paths for %s', (_name, expression, paths) => {
      // Assert two things: (1) the expression lands in the task Parameters verbatim, and
      // (2) every referenced path is bound as an expressionAttributeValues key (bound via
      // JsonPath, so the key gains a `.$` suffix and the value is the path).
      const params = synth(expression);

      expect(params.expression).toEqual(expression);

      for (const path of paths) {
        expect(params.expressionAttributeValues[`${path}.$`]).toEqual(path);
      }
      expect(Object.keys(params.expressionAttributeValues)).toHaveLength(paths.length);
    });

    test('synth-time TS interpolation bakes the const into the resolved path', () => {
      const DATE_PATH = '$.currentDate';
      const params = synth(`(${DATE_PATH}).split('-')`);

      expect(params.expression).toEqual("($.currentDate).split('-')");
      expect(params.expressionAttributeValues['$.currentDate.$']).toEqual('$.currentDate');
    });

    test('synth-time TS interpolation in a path suffix', () => {
      const WF = 'Job';
      const params = synth(`$.${WF}-Result.items`);

      expect(params.expression).toEqual('$.Job-Result.items');
      expect(params.expressionAttributeValues['$.Job-Result.items.$']).toEqual('$.Job-Result.items');
    });

    test('a constant with no path binds nothing', () => {
      const params = synth('0');

      expect(params.expression).toEqual('0');
      expect(params.expressionAttributeValues).toEqual({});
    });
  });

  describe('rejects a path used as literal text inside a string or template', () => {
    test.each<[string, string]>([
      ['single-quoted string', "'x=$.count'"],
      ['double-quoted string', '"hello $.user"'],
      ['array with quoted path elements', "['--flag', '$.input.x']"],
      ['bare path in template text', '`Processing $.documentId`'],
      ['brace-wrapped bare path in template text', '`{$.Payload.Path}`'],
      ['JSON.parse of a quoted path', "JSON.parse('$.a')"],
    ])('fails for a %s', (_name, expression) => {
      expect(() => new tasks.EvaluateExpression(stack, 'Task', { expression }))
        .toThrow(/are used as literal text inside a (plain string|template literal)/);
    });

    test('fails with a plain-string message that points at a template literal', () => {
      const expression = "'x=$.count'";
      expect(() => new tasks.EvaluateExpression(stack, 'T1', { expression })).toThrow(/inside a plain string/);
      expect(() => new tasks.EvaluateExpression(stack, 'T2', { expression })).toThrow(/template literal with interpolation/);
    });

    test('fails with a template-text message that points at ${...} interpolation', () => {
      const expression = '`Processing $.documentId`';
      expect(() => new tasks.EvaluateExpression(stack, 'T1', { expression })).toThrow(/inside a template literal/);
      expect(() => new tasks.EvaluateExpression(stack, 'T2', { expression })).toThrow(/interpolation like \$\{/);
    });
  });

  describe('skips the literal-text check for tokenized expressions', () => {
    test('does not throw when the expression is an unresolved token', () => {
      // An ASL intrinsic (here JsonPath.array) is an unresolved token, so the synth-time
      // literal-text scan is skipped.
      const expression = sfn.JsonPath.array('spark-submit', '--id', sfn.JsonPath.stringAt('$.id'));

      expect(() => {
        const task = new tasks.EvaluateExpression(stack, 'Task', { expression });
        new sfn.StateMachine(stack, 'SM', { definitionBody: sfn.DefinitionBody.fromChainable(task) });
        Template.fromStack(stack);
      }).not.toThrow();
    });
  });
});

const DEDICATED_FUNCTION_FLAG = { [cxapi.STEPFUNCTIONS_TASKS_EVALUATE_EXPRESSION_DEDICATED_FUNCTION]: true };
const SHARED_FUNCTION_FLAG = { [cxapi.STEPFUNCTIONS_TASKS_EVALUATE_EXPRESSION_DEDICATED_FUNCTION]: false };

test.each([false, true])('fails for a runtime that is not supported (dedicated function flag %s)', (flag) => {
  const flagStack = new Stack(new App({ context: { [cxapi.STEPFUNCTIONS_TASKS_EVALUATE_EXPRESSION_DEDICATED_FUNCTION]: flag } }));
  expect(() => new tasks.EvaluateExpression(flagStack, 'Task', {
    expression: '$.a + $.b',
    runtime: Runtime.PYTHON_3_12,
  })).toThrow('The runtime python3.12 is currently not supported.');
});

test('accepts a Node.js runtime that has no shared function with the dedicated function flag', () => {
  // GIVEN
  const runtime = new Runtime('nodejs26.x', RuntimeFamily.NODEJS);

  // THEN
  const sharedStack = new Stack(new App({ context: SHARED_FUNCTION_FLAG }));
  expect(() => new tasks.EvaluateExpression(sharedStack, 'Shared', { expression: '$.a + $.b', runtime }))
    .toThrow('The runtime nodejs26.x is currently not supported.');

  const flagStack = new Stack(new App({ context: DEDICATED_FUNCTION_FLAG }));
  new tasks.EvaluateExpression(flagStack, 'Dedicated', { expression: '$.a + $.b', runtime });
  Template.fromStack(flagStack).hasResourceProperties('AWS::Lambda::Function', { Runtime: 'nodejs26.x' });
});

test.each([false, true])('accepts a Node.js runtime created without a family (dedicated function flag %s)', (flag) => {
  // GIVEN
  const flagStack = new Stack(new App({ context: { [cxapi.STEPFUNCTIONS_TASKS_EVALUATE_EXPRESSION_DEDICATED_FUNCTION]: flag } }));

  // WHEN
  const task = new tasks.EvaluateExpression(flagStack, 'Task', { expression: '$.a + $.b', runtime: new Runtime('nodejs20.x') });
  new sfn.StateMachine(flagStack, 'SM', { definitionBody: sfn.DefinitionBody.fromChainable(task) });

  // THEN
  Template.fromStack(flagStack).hasResourceProperties('AWS::Lambda::Function', { Runtime: 'nodejs20.x' });
});

describe('shared function when the dedicated function flag is disabled', () => {
  beforeEach(() => {
    stack = new Stack(new App({ context: SHARED_FUNCTION_FLAG }));
  });

  test('tasks in different state machines share one function', () => {
    // WHEN
    for (const id of ['SM1', 'SM2']) {
      const task = new tasks.EvaluateExpression(stack, `${id}Task`, { expression: '$.a + $.b' });
      new sfn.StateMachine(stack, id, { definitionBody: sfn.DefinitionBody.fromChainable(task) });
    }

    // THEN
    const functions = Template.fromStack(stack).findResources('AWS::Lambda::Function');
    expect(Object.keys(functions)).toHaveLength(1);
  });

  test('warns that the function is shared', () => {
    // WHEN
    const task = new tasks.EvaluateExpression(stack, 'Task', { expression: '$.a + $.b' });
    new sfn.StateMachine(stack, 'SM', { definitionBody: sfn.DefinitionBody.fromChainable(task) });

    // THEN
    Annotations.fromStack(stack).hasWarning('/Default/Task', Match.stringLikeRegexp(
      '^The feature flag \'@aws-cdk/aws-stepfunctions-tasks:evaluateExpressionDedicatedFunction\' is disabled, .* share one Lambda function, ' +
      'including tasks in different state machines. Remove the flag or set it to true',
    ));
  });
});

describe('function isolation', () => {
  test('does not warn about a shared function', () => {
    // WHEN
    const task = new tasks.EvaluateExpression(stack, 'Task', { expression: '$.a + $.b' });
    new sfn.StateMachine(stack, 'SM', { definitionBody: sfn.DefinitionBody.fromChainable(task) });

    // THEN
    Annotations.fromStack(stack).hasNoWarning('*', Match.stringLikeRegexp('share one Lambda function'));
  });

  function addStateMachine(id: string, expression: string) {
    const task = new tasks.EvaluateExpression(stack, `${id}Task`, { expression });
    return new sfn.StateMachine(stack, id, { definitionBody: sfn.DefinitionBody.fromChainable(task) });
  }

  /** The functions that the given state machine role is allowed to invoke. */
  function invokedFunctions(stateMachine: sfn.StateMachine): string[] {
    const policies = Template.fromStack(stack).findResources('AWS::IAM::Policy', {
      Properties: { Roles: [{ Ref: stack.getLogicalId(stateMachine.role.node.defaultChild as CfnRole) }] },
    });
    return Object.values(policies)
      .flatMap((policy: any) => policy.Properties.PolicyDocument.Statement)
      .filter((statement: any) => statement.Action === 'lambda:InvokeFunction')
      .flatMap((statement: any) => [statement.Resource].flat())
      .map((resource: any) => JSON.stringify(resource));
  }

  test('creates a function for each task', () => {
    // WHEN
    const task1 = new tasks.EvaluateExpression(stack, 'Task1', { expression: '$.a + $.b' });
    const task2 = new tasks.EvaluateExpression(stack, 'Task2', { expression: '$.a * $.b' });
    new sfn.StateMachine(stack, 'SM', { definitionBody: sfn.DefinitionBody.fromChainable(task1.next(task2)) });

    // THEN
    Template.fromStack(stack).resourceCountIs('AWS::Lambda::Function', 2);
    expect(stack.resolve(task1.toStateJson()).Resource).not.toEqual(stack.resolve(task2.toStateJson()).Resource);
  });

  test('creates a function for each task with the same runtime and architecture', () => {
    // WHEN
    for (const id of ['Task1', 'Task2']) {
      const task = new tasks.EvaluateExpression(stack, id, {
        expression: '$.a + $.b',
        runtime: Runtime.NODEJS_22_X,
        architecture: Architecture.ARM_64,
      });
      new sfn.StateMachine(stack, `${id}SM`, { definitionBody: sfn.DefinitionBody.fromChainable(task) });
    }

    // THEN
    Template.fromStack(stack).resourceCountIs('AWS::Lambda::Function', 2);
  });

  test('each state machine can only invoke the functions of its own tasks', () => {
    // WHEN
    const attacker = addStateMachine('AttackerSM', '$.a + $.b');
    const victim = addStateMachine('VictimSM', '$.secret');

    // THEN
    const attackerFunctions = invokedFunctions(attacker);
    const victimFunctions = invokedFunctions(victim);
    expect(attackerFunctions).toHaveLength(2); // the function ARN and its versions
    expect(victimFunctions).toHaveLength(2);
    expect(attackerFunctions.some((fn) => victimFunctions.includes(fn))).toBe(false);
  });

  test('functions in a stack share one execution role that can only write logs', () => {
    // WHEN
    addStateMachine('SM1', '$.a + $.b');
    addStateMachine('SM2', '$.a * $.b');
    // adding a permission through one task's function must not widen the shared role
    const evalFn = stack.node.findChild('SM1Task').node.findChild('EvalFunction') as IFunction;
    evalFn.addToRolePolicy(new PolicyStatement({ actions: ['s3:GetObject'], resources: ['*'] }));

    // THEN
    const template = Template.fromStack(stack);
    const functionRoles = Object.values(template.findResources('AWS::Lambda::Function'))
      .map((fn: any) => JSON.stringify(fn.Properties.Role));
    expect(new Set(functionRoles).size).toBe(1);

    const lambdaRoles = template.findResources('AWS::IAM::Role', {
      Properties: {
        AssumeRolePolicyDocument: {
          Statement: [{ Action: 'sts:AssumeRole', Effect: 'Allow', Principal: { Service: 'lambda.amazonaws.com' } }],
        },
      },
    });
    expect(Object.values(lambdaRoles)).toEqual([{
      Type: 'AWS::IAM::Role',
      Properties: {
        AssumeRolePolicyDocument: {
          Statement: [{ Action: 'sts:AssumeRole', Effect: 'Allow', Principal: { Service: 'lambda.amazonaws.com' } }],
          Version: '2012-10-17',
        },
        ManagedPolicyArns: [{
          'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole']],
        }],
      },
    }]);
    // The permission added above was ignored: no policy is attached to the shared role.
    template.resourcePropertiesCountIs('AWS::IAM::Policy', {
      Roles: [{ Ref: Object.keys(lambdaRoles)[0] }],
    }, 0);
  });

  test('stacks do not share an execution role', () => {
    // GIVEN
    const app = new App();
    const stack1 = new Stack(app, 'Stack1');
    const stack2 = new Stack(app, 'Stack2');

    // WHEN
    for (const s of [stack1, stack2]) {
      const task = new tasks.EvaluateExpression(s, 'Task', { expression: '$.a + $.b' });
      new sfn.StateMachine(s, 'SM', { definitionBody: sfn.DefinitionBody.fromChainable(task) });
    }

    // THEN
    for (const s of [stack1, stack2]) {
      const fn = Object.values(Template.fromStack(s).findResources('AWS::Lambda::Function'))[0] as any;
      expect(Object.keys(Template.fromStack(s).findResources('AWS::IAM::Role'))).toContain(fn.Properties.Role['Fn::GetAtt'][0]);
    }
  });
});
