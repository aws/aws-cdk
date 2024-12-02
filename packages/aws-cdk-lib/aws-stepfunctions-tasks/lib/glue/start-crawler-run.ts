import { Construct } from 'constructs';
import * as iam from '../../../aws-iam';
import * as sfn from '../../../aws-stepfunctions';
import { Stack } from '../../../core';
import { integrationResourceArn } from '../private/task-utils';

/**
 * Properties for starting an AWS Glue Crawler as a task
 */
export interface GlueStartCrawlerRunProps extends sfn.TaskStateBaseProps {

  /**
   * Glue crawler name
   */
  readonly crawlerName: string;

}

/**
 * Starts an AWS Glue Crawler in a Task state
 *
 * @see https://docs.aws.amazon.com/glue/latest/dg/aws-glue-api-crawler-crawling.html#aws-glue-api-crawler-crawling-StartCrawler
 */
export class GlueStartCrawlerRun extends sfn.TaskStateBase {

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
  protected _renderTask(): any {
    return {
      Resource: integrationResourceArn('aws-sdk:glue', 'startCrawler', this.integrationPattern),
      Parameters: {
        Name: this.props.crawlerName,
      },
    };
  }
}
