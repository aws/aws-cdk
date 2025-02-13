import { Construct } from 'constructs';
import * as iam from '../../../aws-iam';
import * as sfn from '../../../aws-stepfunctions';
import { integrationResourceArn, validatePatternSupported } from '../private/task-utils';

interface AthenaGetQueryExecutionOptions {
  /**
   * Query that will be retrieved
   *
   * Example value: `adfsaf-23trf23-f23rt23`
   */
  readonly queryExecutionId: string;
}

/**
 * Properties for getting a Query Execution using JSONPath
 */
export interface AthenaGetQueryExecutionJsonPathProps extends sfn.TaskStateJsonPathBaseProps, AthenaGetQueryExecutionOptions { }

/**
 * Properties for getting a Query Execution using JSONata
 */
export interface AthenaGetQueryExecutionJsonataProps extends sfn.TaskStateJsonataBaseProps, AthenaGetQueryExecutionOptions { }

/**
 * Properties for getting a Query Execution
 */
export interface AthenaGetQueryExecutionProps extends sfn.TaskStateBaseProps, AthenaGetQueryExecutionOptions { }

/**
 * Get an Athena Query Execution as a Task
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-athena.html
 */
export class AthenaGetQueryExecution extends sfn.TaskStateBase {
  /**
   * Get an Athena Query Execution as a Task that using JSONPath
   *
   * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-athena.html
   */
  public static jsonPath(scope: Construct, id: string, props: AthenaGetQueryExecutionJsonPathProps) {
    return new AthenaGetQueryExecution(scope, id, props);
  }
  /**
   * Get an Athena Query Execution as a Task that using JSONata
   *
   * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-athena.html
   */
  public static jsonata(scope: Construct, id: string, props: AthenaGetQueryExecutionJsonataProps) {
    return new AthenaGetQueryExecution(scope, id, {
      ...props,
      queryLanguage: sfn.QueryLanguage.JSONATA,
    });
  }

  private static readonly SUPPORTED_INTEGRATION_PATTERNS: sfn.IntegrationPattern[] = [
    sfn.IntegrationPattern.REQUEST_RESPONSE,
  ];

  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];

  private readonly integrationPattern: sfn.IntegrationPattern;

  constructor(scope: Construct, id: string, private readonly props: AthenaGetQueryExecutionProps) {
    super(scope, id, props);
    this.integrationPattern = props.integrationPattern ?? sfn.IntegrationPattern.REQUEST_RESPONSE;

    validatePatternSupported(this.integrationPattern, AthenaGetQueryExecution.SUPPORTED_INTEGRATION_PATTERNS);

    this.taskPolicies = [
      new iam.PolicyStatement({
        resources: ['*'], // Grant access to all workgroups as it can not be specified in the request https://docs.aws.amazon.com/athena/latest/ug/workgroups-iam-policy.html
        actions: ['athena:getQueryExecution'],
      }),
    ];
  }

  /**
   * Provides the Athena get query execution service integration task configuration
   * @internal
   */
  protected _renderTask(topLevelQueryLanguage?: sfn.QueryLanguage): any {
    const queryLanguage = sfn._getActualQueryLanguage(topLevelQueryLanguage, this.props.queryLanguage);
    return {
      Resource: integrationResourceArn('athena', 'getQueryExecution', this.integrationPattern),
      ...this._renderParametersOrArguments({
        QueryExecutionId: this.props.queryExecutionId,
      }, queryLanguage),
    };
  }
}

