import '@aws-cdk/assert/jest';
import lambda = require('@aws-cdk/aws-lambda');
import sfn = require('@aws-cdk/aws-stepfunctions');
import { Stack } from '@aws-cdk/cdk';
import tasks = require('../lib');

test('Supports invoke mode', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  const fn = new lambda.Function(stack, 'Fn', {
    code: lambda.Code.inline('hello'),
    handler: 'index.hello',
    runtime: lambda.Runtime.Python27,
  });
  new sfn.StateMachine(stack, 'SM', {
    definition: new sfn.Task(stack, 'Task', {
      task: tasks.RunLambdaTask.fromFunction(fn, {
          payload: { test: "test" }
        }),
      outputPath: tasks.LambdaTaskKnownPath.InvokePayloadOutputPath
    })
  });

  // THEN
  expect(stack).toHaveResource('AWS::StepFunctions::StateMachine', {
    DefinitionString: {
      "Fn::Join": ["", [
        "{\"StartAt\":\"Task\",\"States\":{\"Task\":{\"End\":true,\"Parameters\":{\"FunctionName\":\"",
        { Ref: "Fn9270CBC0" },
        "\",\"InvocationStyle\":\"RequestResponse\",\"Payload\":{\"test\":\"test\"}},\"OutputPath\":\"$.Payload\",\"Type\":\"Task\"," +
        "\"Resource\":\"arn:aws:states:::lambda:invoke\"}}}"
      ]]
    },
  });
});

test('Supports invoke event mode', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  const fn = new lambda.Function(stack, 'Fn', {
    code: lambda.Code.inline('hello'),
    handler: 'index.hello',
    runtime: lambda.Runtime.Python27,
  });
  new sfn.StateMachine(stack, 'SM', {
    definition: new sfn.Task(stack, 'Task', {
      task: tasks.RunLambdaTask.fromFunction(fn, {
          payload: { test: "test" },
          fireAndForget: true
        }),
      outputPath: tasks.LambdaTaskKnownPath.InvokePayloadOutputPath
    })
  });

  // THEN
  expect(stack).toHaveResource('AWS::StepFunctions::StateMachine', {
    DefinitionString: {
      "Fn::Join": ["", [
        "{\"StartAt\":\"Task\",\"States\":{\"Task\":{\"End\":true,\"Parameters\":{\"FunctionName\":\"",
        { Ref: "Fn9270CBC0" },
        "\",\"InvocationStyle\":\"Event\",\"Payload\":{\"test\":\"test\"}},\"OutputPath\":\"$.Payload\",\"Type\":\"Task\"," +
        "\"Resource\":\"arn:aws:states:::lambda:invoke\"}}}"
      ]]
    },
  });
});

test('Supports invoke mode with alias', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  const fn = new lambda.Function(stack, 'Fn', {
    code: lambda.Code.inline('hello'),
    handler: 'index.hello',
    runtime: lambda.Runtime.Python27,
  });
  const version = fn.addVersion('v1');
  new sfn.StateMachine(stack, 'SM', {
    definition: new sfn.Task(stack, 'Task', {
      task: tasks.RunLambdaTask.fromVersion(version, {
          payload: { test: "test" }
        }),
      outputPath: tasks.LambdaTaskKnownPath.InvokePayloadOutputPath
    })
  });

  // THEN
  expect(stack).toHaveResource('AWS::StepFunctions::StateMachine', {
    DefinitionString: {
      "Fn::Join": ["", [
        "{\"StartAt\":\"Task\",\"States\":{\"Task\":{\"End\":true,\"Parameters\":{\"FunctionName\":\"",
        { Ref: "Fn9270CBC0" },
        "\",\"Qualifier\":\"",
        { "Fn::GetAtt": [ "FnVersionv18BAE864D", "Version" ] },
        "\",\"InvocationStyle\":\"RequestResponse\",\"Payload\":{\"test\":\"test\"}},\"OutputPath\":\"$.Payload\",\"Type\":\"Task\"," +
        "\"Resource\":\"arn:aws:states:::lambda:invoke\"}}}"
      ]]
    },
  });
});

test('Supports invoke mode with alias', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  const fn = new lambda.Function(stack, 'Fn', {
    code: lambda.Code.inline('hello'),
    handler: 'index.hello',
    runtime: lambda.Runtime.Python27,
  });
  const version = fn.addVersion('v1');
  const alias = new lambda.Alias(stack, 'Alias', {
    aliasName: 'TEST',
    version
  });
  new sfn.StateMachine(stack, 'SM', {
    definition: new sfn.Task(stack, 'Task', {
      task: tasks.RunLambdaTask.fromAlias(fn, alias, {
          payload: { test: "test" }
        }),
      outputPath: tasks.LambdaTaskKnownPath.InvokePayloadOutputPath
    })
  });

  // THEN
  expect(stack).toHaveResource('AWS::StepFunctions::StateMachine', {
    DefinitionString: {
      "Fn::Join": ["", [
        "{\"StartAt\":\"Task\",\"States\":{\"Task\":{\"End\":true,\"Parameters\":{\"FunctionName\":\"",
        { Ref: "Fn9270CBC0" }, "\",\"Qualifier\":\"TEST\"," +
        "\"InvocationStyle\":\"RequestResponse\",\"Payload\":{\"test\":\"test\"}},\"OutputPath\":\"$.Payload\",\"Type\":\"Task\"," +
        "\"Resource\":\"arn:aws:states:::lambda:invoke\"}}}"
      ]]
    },
  });
});

test('Supports Callback mode', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  const fn = new lambda.Function(stack, 'Fn', {
    code: lambda.Code.inline('hello'),
    handler: 'index.hello',
    runtime: lambda.Runtime.Python27,
  });

  new sfn.StateMachine(stack, 'SM', {
    definition: new sfn.Task(stack, 'Task', {
      task: tasks.RunLambdaTask.fromFunction(fn, {
          waitForTaskToken: true,
          payload: { "test": "test", "token.$": tasks.LambdaTaskKnownPath.TokenInputPath }
        })
    })
  });

  // THEN
  expect(stack).toHaveResource('AWS::StepFunctions::StateMachine', {
    DefinitionString: {
      "Fn::Join": ["", [
        "{\"StartAt\":\"Task\",\"States\":{\"Task\":{\"End\":true,\"Parameters\":{\"FunctionName\":\"",
        { Ref: "Fn9270CBC0" },
        "\",\"InvocationStyle\":\"RequestResponse\",\"Payload\":{\"test\":\"test\",\"token.$\":\"$$.Task.Token\"}},\"Type\":\"Task\"," +
        "\"Resource\":\"arn:aws:states:::lambda:invoke.waitForTaskToken\"}}}"
      ]]
    },
  });
});

test('Supports Callback event mode', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  const fn = new lambda.Function(stack, 'Fn', {
    code: lambda.Code.inline('hello'),
    handler: 'index.hello',
    runtime: lambda.Runtime.Python27,
  });

  new sfn.StateMachine(stack, 'SM', {
    definition: new sfn.Task(stack, 'Task', {
      task: tasks.RunLambdaTask.fromFunction(fn, {
          waitForTaskToken: true,
          fireAndForget: true,
          payload: { "test": "test", "token.$": tasks.LambdaTaskKnownPath.TokenInputPath }
        })
    })
  });

  // THEN
  expect(stack).toHaveResource('AWS::StepFunctions::StateMachine', {
    DefinitionString: {
      "Fn::Join": ["", [
        "{\"StartAt\":\"Task\",\"States\":{\"Task\":{\"End\":true,\"Parameters\":{\"FunctionName\":\"",
        { Ref: "Fn9270CBC0" },
        "\",\"InvocationStyle\":\"Event\",\"Payload\":{\"test\":\"test\",\"token.$\":\"$$.Task.Token\"}},\"Type\":\"Task\"," +
        "\"Resource\":\"arn:aws:states:::lambda:invoke.waitForTaskToken\"}}}"
      ]]
    },
  });
});

test('WaitForTaskToken fails when no token is provided', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  const fn = new lambda.Function(stack, 'Fn', {
    code: lambda.Code.inline('hello'),
    handler: 'index.hello',
    runtime: lambda.Runtime.Python27,
  });

  try {
    new sfn.StateMachine(stack, 'SM', {
      definition: new sfn.Task(stack, 'Task', {
        task: tasks.RunLambdaTask.fromFunction(fn, {
            waitForTaskToken: true,
            payload: { test: "test", token: [ tasks.LambdaTaskKnownPath.TokenInputPath, 0, '$.Task.Token' ] }
          })
      })
    });
  } catch (err) {
    // THEN
    expect(err.message).toMatch(/^You must have.*"\$\$\.Task\.Token".*$/m);
    expect(err.message).toMatch(/^.*found it in the following places: "token\[0\]".*$/m);
    expect(err.message).toMatch(/^.*found a similar symbol "\$\.Task\.Token" in the following places: "token\[2\]".*$/m);
  }
});

test('WaitForTaskToken fails when no payload is provided', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  const fn = new lambda.Function(stack, 'Fn', {
    code: lambda.Code.inline('hello'),
    handler: 'index.hello',
    runtime: lambda.Runtime.Python27,
  });

  try {
    new sfn.StateMachine(stack, 'SM', {
      definition: new sfn.Task(stack, 'Task', {
        task: tasks.RunLambdaTask.fromFunction(fn, {
            waitForTaskToken: true
          })
      })
    });
  } catch (err) {
    // THEN
    expect(err.message).toMatch(/^You must have.*"\$\$\.Task\.Token"$/);
  }
});