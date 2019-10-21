import iam = require('@aws-cdk/aws-iam');
import lambda = require('@aws-cdk/aws-lambda');
import sfn = require('@aws-cdk/aws-stepfunctions');
import cdk = require('@aws-cdk/core');
import path = require('path');

/**
 * Properties for EvalTask
 */
export interface EvalTaskProps {
  /**
   * The expression to evaluate. It must contain state paths.
   *
   * @example '$.a + $.b'
   */
  readonly expression: string;

  /**
   * The runtime language to use to evaluate the expression.
   *
   * @default lambda.Runtime.NODEJS_10_X
   */
  readonly runtime?: lambda.Runtime;
}

/**
 * The event received by the Lambda function
 */
export interface Event {
  /**
   * The expression to evaluate
   */
  readonly expression: string;

  /**
   * The expression attribute values
   */
  readonly expressionAttributeValues: { [key: string]: any };
}

/**
 * A Step Functions Task to evaluate an expression
 *
 * OUTPUT: the output of this task is the evaluated expression.
 */
export class EvalTask implements sfn.IStepFunctionsTask {
  constructor(private readonly props: EvalTaskProps) {
  }

  public bind(task: sfn.Task): sfn.StepFunctionsTaskConfig {
    const matches = this.props.expression.match(/\$[.\[][.a-zA-Z[\]0-9]+/g);

    if (!matches) {
      throw new Error('No paths found in expression');
    }

    const expressionAttributeValues = matches.reduce(
      (acc, m) => ({
        ...acc,
        [m]: sfn.Data.stringAt(m) // It's okay to always use `stringAt` here
      }),
      {}
    );

    const evalFn = createEvalFn(this.props.runtime || lambda.Runtime.NODEJS_10_X, task);

    return {
      resourceArn: evalFn.functionArn,
      policyStatements: [new iam.PolicyStatement({
        resources: [evalFn.functionArn],
        actions: ['lambda:InvokeFunction'],
      })],
      parameters: {
        expression: this.props.expression,
        expressionAttributeValues,
      } as Event
    };
  }
}

function createEvalFn(runtime: lambda.Runtime, scope: cdk.Construct) {
  const code = lambda.Code.asset(path.join(__dirname, `eval-${runtime.name}-handler`));
  const lambdaPurpose = 'Eval';

  switch (runtime) {
    case lambda.Runtime.NODEJS_10_X:
      return new lambda.SingletonFunction(scope, 'EvalFunction', {
        runtime,
        handler: 'index.handler',
        uuid: 'a0d2ce44-871b-4e74-87a1-f5e63d7c3bdc',
        lambdaPurpose,
        code,
      });
    // TODO: implement other runtimes
    default:
      throw new Error(`The runtime ${runtime.name} is currently not supported.`);
  }
}
