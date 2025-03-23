import { Construct } from 'constructs';
import * as iam from '../../../aws-iam';
import * as sfn from '../../../aws-stepfunctions';
import { integrationResourceArn, validatePatternSupported } from '../private/task-utils';

interface AthenaGetQueryResultsOptions {
  /**
   * Query that will be retrieved
   *
   * Example value: `adfsaf-23trf23-f23rt23`
   */
  readonly queryExecutionId: string;

  /**
   * Pagination token
   *
   * @default - No next token
   */
  readonly nextToken?: string;

  /**
   * Max number of results
   *
   * @default 1000
   */
  readonly maxResults?: number;
}

/**
 * Properties for getting a Query Results using JSONPath
 */
export interface AthenaGetQueryResultsJsonPathProps extends sfn.TaskStateJsonPathBaseProps, AthenaGetQueryResultsOptions { }

/**
 * Properties for getting a Query Results using JSONata
 */
export interface AthenaGetQueryResultsJsonataProps extends sfn.TaskStateJsonataBaseProps, AthenaGetQueryResultsOptions { }

/**
 * Properties for getting a Query Results
 */
export interface AthenaGetQueryResultsProps extends sfn.TaskStateBaseProps, AthenaGetQueryResultsOptions { }

/**
 * Get an Athena Query Results as a Task
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-athena.html
 */
export class AthenaGetQueryResults extends sfn.TaskStateBase {
  /**
   * Get an Athena Query Results as a Task that using JSONPath
   *
   * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-athena.html
   */
  public static jsonPath(scope: Construct, id: string, props: AthenaGetQueryResultsJsonPathProps) {
    return new AthenaGetQueryResults(scope, id, props);
  }
  /**
   * Get an Athena Query Results as a Task that using JSONata
   *
   * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-athena.html
   */
  public static jsonata(scope: Construct, id: string, props: AthenaGetQueryResultsJsonataProps) {
    return new AthenaGetQueryResults(scope, id, {
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

  constructor(scope: Construct, id: string, private readonly props: AthenaGetQueryResultsProps) {
    super(scope, id, props);
    this.integrationPattern = props.integrationPattern ?? sfn.IntegrationPattern.REQUEST_RESPONSE;

    validatePatternSupported(this.integrationPattern, AthenaGetQueryResults.SUPPORTED_INTEGRATION_PATTERNS);

    const policyStatements = [
      new iam.PolicyStatement({
        resources: ['*'], // Workgroup can not be specified in the request https://docs.aws.amazon.com/athena/latest/ug/workgroups-iam-policy.html
        actions: ['athena:getQueryResults'],
      }),
    ];

    policyStatements.push(
      new iam.PolicyStatement({
        actions: ['s3:GetObject'],
        resources: ['*'], // To stream query results successfully the IAM principal must have permissions to the Amazon S3 GetObject action for the Athena query results location https://docs.amazonaws.cn/en_us/athena/latest/APIReference/API_GetQueryResults.html
      }),
    );

    this.taskPolicies = policyStatements;
  }

  /**
   * Provides the Athena get query results service integration task configuration
   * @internal
   */
  protected _renderTask(topLevelQueryLanguage?: sfn.QueryLanguage): any {
    const queryLanguage = sfn._getActualQueryLanguage(topLevelQueryLanguage, this.props.queryLanguage);
    return {
      Resource: integrationResourceArn('athena', 'getQueryResults', this.integrationPattern),
      ...this._renderParametersOrArguments({
        QueryExecutionId: this.props.queryExecutionId,
        NextToken: this.props.nextToken,
        MaxResults: this.props.maxResults,
      }, queryLanguage),
    };
  }
}

