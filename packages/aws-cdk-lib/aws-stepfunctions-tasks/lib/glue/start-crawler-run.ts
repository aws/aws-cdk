import { Construct } from 'constructs';
import * as iam from '../../../aws-iam';
import * as sfn from '../../../aws-stepfunctions';
import { Stack } from '../../../core';
import { integrationResourceArn } from '../private/task-utils';

interface GlueStartCrawlerRunOptions {
  /**
   * Glue crawler name
   */
  readonly crawlerName: string;
}

/**
 * Properties for starting an AWS Glue Crawler as a task that using JSONPath
 */
export interface GlueStartCrawlerRunJsonPathProps extends sfn.TaskStateJsonPathBaseProps, GlueStartCrawlerRunOptions { }

/**
 * Properties for starting an AWS Glue Crawler as a task that using JSONata
 */
export interface GlueStartCrawlerRunJsonataProps extends sfn.TaskStateJsonataBaseProps, GlueStartCrawlerRunOptions { }

/**
 * Properties for starting an AWS Glue Crawler as a task
 */
export interface GlueStartCrawlerRunProps extends sfn.TaskStateBaseProps, GlueStartCrawlerRunOptions { }

/**
 * Starts an AWS Glue Crawler in a Task state
 *
 * @see https://docs.aws.amazon.com/glue/latest/dg/aws-glue-api-crawler-crawling.html#aws-glue-api-crawler-crawling-StartCrawler
 */
export class GlueStartCrawlerRun extends sfn.TaskStateBase {
  /**
   * Starts an AWS Glue Crawler using JSONPath in a Task state
   *
   * @see https://docs.aws.amazon.com/glue/latest/dg/aws-glue-api-crawler-crawling.html#aws-glue-api-crawler-crawling-StartCrawler
   */
  public static jsonPath(scope: Construct, id: string, props: GlueStartCrawlerRunJsonPathProps) {
    return new GlueStartCrawlerRun(scope, id, props);
  }
  /**
   * Starts an AWS Glue Crawler using JSONata in a Task state
   *
   * @see https://docs.aws.amazon.com/glue/latest/dg/aws-glue-api-crawler-crawling.html#aws-glue-api-crawler-crawling-StartCrawler
   */
  public static jsonata(scope: Construct, id: string, props: GlueStartCrawlerRunJsonataProps) {
    return new GlueStartCrawlerRun(scope, id, {
      ...props,
      queryLanguage: sfn.QueryLanguage.JSONATA,
    });
  }
  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];

  private readonly integrationPattern: sfn.IntegrationPattern;

  constructor(scope: Construct, id: string, private readonly props: GlueStartCrawlerRunProps) {
    super(scope, id, props);

    this.integrationPattern = props.integrationPattern ?? sfn.IntegrationPattern.REQUEST_RESPONSE;
    this.taskPolicies = [new iam.PolicyStatement({
      resources: [
        Stack.of(this).formatArn({
          service: 'glue',
          resource: 'crawler',
          resourceName: this.props.crawlerName,
        }),
      ],
      actions: [
        'glue:StartCrawler',
        'glue:GetCrawler',
      ],
    })];
  }

  /**
   * @internal
   */
  protected _renderTask(topLevelQueryLanguage?: sfn.QueryLanguage): any {
    const queryLanguage = sfn._getActualQueryLanguage(topLevelQueryLanguage, this.props.queryLanguage);
    return {
      Resource: integrationResourceArn('aws-sdk:glue', 'startCrawler', this.integrationPattern),
      ...this._renderParametersOrArguments({
        Name: this.props.crawlerName,
      }, queryLanguage),
    };
  }
}
