import { Construct } from 'constructs';
import * as iam from '../../aws-iam';
import * as lambda from '../../aws-lambda';
import * as sfn from '../../aws-stepfunctions';
import { EvalNodejsSingletonFunction } from '../../custom-resource-handlers/dist/aws-stepfunctions-tasks/eval-nodejs-provider.generated';

/**
 * Properties for EvaluateExpression
 *
 */
export interface EvaluateExpressionProps extends sfn.TaskStateBaseProps {
  /**
   * The expression to evaluate. The expression may contain state paths.
   *
   * Example value: `'$.a + $.b'`
   */
  readonly expression: string;

  /**
   * The runtime language to use to evaluate the expression.
   *
   * @default lambda.Runtime.NODEJS_18_X
   */
  readonly runtime?: lambda.Runtime;
}

/**
 * The event received by the Lambda function
 *
 * Shared definition with packages/@aws-cdk/custom-resource-handlers/lib/custom-resources/aws-stepfunctions-tasks/index.ts
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
 */
export class EvaluateExpression extends sfn.TaskStateBase {
  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];

  private readonly evalFn: lambda.SingletonFunction;

  constructor(scope: Construct, id: string, private readonly props: EvaluateExpressionProps) {
    super(scope, id, props);

    this.evalFn = createEvalFn(this.props.runtime, this);

    this.taskPolicies = [
      new iam.PolicyStatement({
        resources: this.evalFn.resourceArnsForGrantInvoke,
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

function createEvalFn(runtime: lambda.Runtime | undefined, scope: Construct) {
  const NO_RUNTIME = Symbol.for('no-runtime');
  const lambdaPurpose = 'Eval';

  const nodeJsGuids = {
    [lambda.Runtime.NODEJS_18_X.name]: '078d40d3-fb4e-4d53-94a7-9c46fc11fe02',
    [lambda.Runtime.NODEJS_16_X.name]: '2a430b68-eb4b-4026-9232-ee39b71c1db8',
    [lambda.Runtime.NODEJS_14_X.name]: 'da2d1181-604e-4a45-8694-1a6abd7fe42d',
    [lambda.Runtime.NODEJS_12_X.name]: '2b81e383-aad2-44db-8aaf-b4809ae0e3b4',
    [lambda.Runtime.NODEJS_10_X.name]: 'a0d2ce44-871b-4e74-87a1-f5e63d7c3bdc',

    // UUID used when falling back to the default node runtime, which is a token and might be different per region
    [NO_RUNTIME]: '41256dc5-4457-4273-8ed9-17bc818694e5',
  };

  const uuid = nodeJsGuids[runtime?.name ?? NO_RUNTIME];
  if (!uuid) {
    throw new Error(`The runtime ${runtime?.name} is currently not supported.`);
  }

  return new EvalNodejsSingletonFunction(scope, 'EvalFunction', {
    uuid,
    lambdaPurpose,
  });
}
