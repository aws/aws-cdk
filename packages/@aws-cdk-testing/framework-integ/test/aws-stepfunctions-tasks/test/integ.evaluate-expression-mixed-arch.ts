import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-sfn-evaluate-expression-mixed-arch-integ');

const evalTaskArm = new tasks.EvaluateExpression(stack, 'EvalExpressionArm', {
  expression: '$.a + $.b',
  runtime: lambda.Runtime.NODEJS_20_X,
  architecture: lambda.Architecture.ARM_64,
});

const evalTaskX86 = new tasks.EvaluateExpression(stack, 'EvalExpressionX86', {
  expression: '$.a * $.b',
  runtime: lambda.Runtime.NODEJS_20_X,
  architecture: lambda.Architecture.X86_64,
});

const definition = new sfn.Pass(stack, 'Start', {
  result: sfn.Result.fromObject({ a: 3, b: 4 }),
}).next(new sfn.Parallel(stack, 'ParallelEval')
  .branch(evalTaskArm)
  .branch(evalTaskX86),
);

new sfn.StateMachine(stack, 'StateMachine', {
  definitionBody: sfn.DefinitionBody.fromChainable(definition),
});

new integ.IntegTest(app, 'EvaluateExpressionMixedArchTest', {
  testCases: [stack],
});
