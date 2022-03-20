import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Construct } from 'constructs';
import { ComprehendMethod, getComprehendResourceArn } from './private/utils';

/**
 * Properties for ComprehendContainsPiiEntities Task
 */
export interface ComprehendContainsPiiEntitiesProps extends sfn.TaskStateBaseProps {
  /**
   * The language of the input documents.
   *
   * @see https://docs.aws.amazon.com/comprehend/latest/dg/API_ContainsPiiEntities.html#comprehend-ContainsPiiEntities-request-LanguageCode
   */
  readonly languageCode: string;

  /**
   * Creates a new document classification request to analyze a single document in real-time,
   * returning personally identifiable information (PII) entity labels.
   *
   * @see https://docs.aws.amazon.com/comprehend/latest/dg/API_ContainsPiiEntities.html#comprehend-ContainsPiiEntities-request-Text
   */
  readonly text: string;
}

/**
 * A StepFunctions task to call ComprehendContainsPiiEntities
 */
export class ComprehendContainsPiiEntities extends sfn.TaskStateBase {
  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];

  constructor(scope: Construct, id: string, private readonly props: ComprehendContainsPiiEntitiesProps) {
    super(scope, id, props);

    this.taskPolicies = [
      new iam.PolicyStatement({
        actions: [`comprehend:${ComprehendMethod.CONTAINS_PII_ENTITIES}`],
        resources: ['*'],
      }),
    ];
  }

  /**
    * @internal
    */
  protected _renderTask(): any {
    return {
      Resource: getComprehendResourceArn(ComprehendMethod.CONTAINS_PII_ENTITIES),
      Parameters: sfn.FieldUtils.renderObject({
        LanguageCode: this.props.languageCode,
        Text: this.props.text,
      }),
    };
  }
}
