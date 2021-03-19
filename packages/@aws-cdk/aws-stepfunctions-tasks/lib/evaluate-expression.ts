import * as path from 'path';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Construct } from 'constructs';

/**
 * Properties for EvaluateExpression
 *
 * @experimental
 */
export interface EvaluateExpressionProps extends sfn.TaskStateBaseProps {
  /**
   * The expression to evaluate. The expression may contain state paths.
   *
   * @example '$.a + $.b'
   */
  readonly expression: string;

  /**
   * The runtime language to use to evaluate the expression.
   *
   * @default lambda.Runtime.NODEJS_14_X
   */
  readonly runtime?: lambda.Runtime;
}

/**
 * The event received by the Lambda function
 *
 * @internal
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
 *
 * @experimental
 */
export class EvaluateExpression extends sfn.TaskStateBase {
  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];

  private readonly evalFn: lambda.SingletonFunction;

  constructor(scope: Construct, id: string, private readonly props: EvaluateExpressionProps) {
    super(scope, id, props);

    this.evalFn = createEvalFn(this.props.runtime ?? lambda.Runtime.NODEJS_14_X, this);

    this.taskPolicies = [
      new iam.PolicyStatement({
        resources: [this.evalFn.functionArn],
        actions: ['lambda:InvokeFunction'],
      }),
    ];
  }

  /**
   * @internal
   */
  protected _renderTask(): any {
    const matches = this.props.expression.match(/\$[.\[][.a-zA-Z[\]0-9-_]+/g);

    let expressionAttributeValues = {};
    if (matches) {
      expressionAttributeValues = matches.reduce(
        (acc, m) => ({
          ...acc,
          [m]: sfn.JsonPath.stringAt(m), // It's okay to always use `stringAt` here
        }),
        {},
      );
    }

    const parameters: Event = {
      expression: this.props.expression,
      expressionAttributeValues,
    };
    return {
      Resource: this.evalFn.functionArn,
      Parameters: sfn.FieldUtils.renderObject(parameters),
    };
  }
}

function createEvalFn(runtime: lambda.Runtime, scope: Construct) {
  const lambdaPurpose = 'Eval';

  const nodeJsGuids = {
    [lambda.Runtime.NODEJS_14_X.name]: 'da2d1181-604e-4a45-8694-1a6abd7fe42d',
    [lambda.Runtime.NODEJS_12_X.name]: '2b81e383-aad2-44db-8aaf-b4809ae0e3b4',
    [lambda.Runtime.NODEJS_10_X.name]: 'a0d2ce44-871b-4e74-87a1-f5e63d7c3bdc',
  };

  switch (runtime) {
    case lambda.Runtime.NODEJS_14_X:
    case lambda.Runtime.NODEJS_12_X:
    case lambda.Runtime.NODEJS_10_X:
      const uuid = nodeJsGuids[runtime.name];
      if (uuid) {
        return new lambda.SingletonFunction(scope, 'EvalFunction', {
          runtime,
          uuid,
          handler: 'index.handler',
          lambdaPurpose,
          code: lambda.Code.fromAsset(path.join(__dirname, 'eval-nodejs-handler')),
        });
      }
      break;
  }

  throw new Error(`The runtime ${runtime.name} is currently not supported.`);
}
