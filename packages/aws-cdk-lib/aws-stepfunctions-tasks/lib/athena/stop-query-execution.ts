import { Construct } from 'constructs';
import * as iam from '../../../aws-iam';
import * as sfn from '../../../aws-stepfunctions';
import { integrationResourceArn, validatePatternSupported } from '../private/task-utils';

interface AthenaStopQueryExecutionOptions {
  /**
   * Query that will be stopped
   */
  readonly queryExecutionId: string;
}

/**
 * Properties for stopping a Query Execution using JSONPath
 */
export interface AthenaStopQueryExecutionJsonPathProps extends sfn.TaskStateJsonPathBaseProps, AthenaStopQueryExecutionOptions { }

/**
 * Properties for stopping a Query Execution using JSONata
 */
export interface AthenaStopQueryExecutionJsonataProps extends sfn.TaskStateJsonataBaseProps, AthenaStopQueryExecutionOptions { }

/**
 * Properties for stopping a Query Execution
 */
export interface AthenaStopQueryExecutionProps extends sfn.TaskStateBaseProps, AthenaStopQueryExecutionOptions { }

/**
 * Stop an Athena Query Execution as a Task
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-athena.html
 */
export class AthenaStopQueryExecution extends sfn.TaskStateBase {
  /**
   * Stop an Athena Query Execution as a Task using JSONPath
   */
  public static jsonPath(scope: Construct, id: string, props: AthenaStopQueryExecutionJsonPathProps) {
    return new AthenaStopQueryExecution(scope, id, props);
  }

  /**
   * Stop an Athena Query Execution as a Task using JSONata
   */
  public static jsonata(scope: Construct, id: string, props: AthenaStopQueryExecutionJsonataProps) {
    return new AthenaStopQueryExecution(scope, id, { ...props, queryLanguage: sfn.QueryLanguage.JSONATA });
  }

  private static readonly SUPPORTED_INTEGRATION_PATTERNS: sfn.IntegrationPattern[] = [
    sfn.IntegrationPattern.REQUEST_RESPONSE,
  ];

  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];

  private readonly integrationPattern: sfn.IntegrationPattern;

  constructor(scope: Construct, id: string, private readonly props: AthenaStopQueryExecutionProps) {
    super(scope, id, props);
    this.integrationPattern = props.integrationPattern ?? sfn.IntegrationPattern.REQUEST_RESPONSE;

    validatePatternSupported(this.integrationPattern, AthenaStopQueryExecution.SUPPORTED_INTEGRATION_PATTERNS);

    this.taskPolicies = [
      new iam.PolicyStatement({
        resources: ['*'], // Grant access to allow user to stop queries on all workgroups as no workgroup defined in request https://docs.aws.amazon.com/athena/latest/ug/workgroups-iam-policy.html
        actions: ['athena:stopQueryExecution'],
      }),
    ];
  }

  /**
   * Provides the Athena stop query execution service integration task configuration
   */
  /**
   * @internal
   */
  protected _renderTask(topLevelQueryLanguage?: sfn.QueryLanguage): any {
    const queryLanguage = sfn._getActualQueryLanguage(topLevelQueryLanguage, this.props.queryLanguage);
    return {
      Resource: integrationResourceArn('athena', 'stopQueryExecution', this.integrationPattern),
      ...this._renderParametersOrArguments({
        QueryExecutionId: this.props.queryExecutionId,
      }, queryLanguage),
    };
  }
}

