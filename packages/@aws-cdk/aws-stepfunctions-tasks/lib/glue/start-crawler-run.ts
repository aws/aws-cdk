import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
// import { integrationResourceArn, validatePatternSupported } from '../private/task-utils';

/**
 * Properties for starting an AWS Glue Crawler as a task
 */
export interface GlueStartCrawlerRunProps extends sfn.TaskStateBaseProps {

  /**
   * Glue crawler name
   */
  readonly glueCrawlerName: string;

}

export class GlueStartCrawlerRun extends sfn.TaskStateBase {

  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];


  constructor(scope: Construct, id: string, private readonly props: GlueStartCrawlerRunProps) {
    super(scope, id, props);

    this.taskPolicies = this.getPolicies();

    this.taskMetrics = {
      metricPrefixSingular: 'GlueCrawler',
      metricPrefixPlural: 'GlueCrawlers',
      metricDimensions: { GlueCrawlerName: this.props.glueCrawlerName },
    };
  }

  /**
   * @internal
   */
  protected _renderTask(): any {
    return {
      Resource: 'arn:aws:states:::aws-sdk:glue:startCrawler',
      Parameters: {
        Name: this.props.glueCrawlerName,
      },
    };
  }

  private getPolicies(): iam.PolicyStatement[] {
    let iamActions: string[] | undefined;

    iamActions = [
      'glue:StartCrawler',
      'glue:GetCrawler',
    ];

    return [new iam.PolicyStatement({
      resources: [
        Stack.of(this).formatArn({
          service: 'glue',
          resource: 'crawler',
          resourceName: this.props.glueCrawlerName,
        }),
      ],
      actions: iamActions,
    })];
  }
}
