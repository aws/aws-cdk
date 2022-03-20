import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Construct } from 'constructs';
import { ComprehendMethod, getComprehendResourceArn } from './private/utils';

/**
 * Properties for ComprehendBatchDetectDominantLanguage Task
 */
export interface ComprehendBatchDetectDominantLanguageProps extends sfn.TaskStateBaseProps {
  /**
   * A list containing the text of the input documents. The list can contain a maximum of 25
   * documents. Each document should contain at least 20 characters and must contain fewer
   * than 5,000 bytes of UTF-8 encoded characters.
   *
   * @see https://docs.aws.amazon.com/comprehend/latest/dg/API_BatchDetectDominantLanguage.html#comprehend-BatchDetectDominantLanguage-request-TextList
   */
  readonly textList: string[];
}

/**
 * A StepFunctions task to call ComprehendBatchDetectDominantLanguage
 */
export class ComprehendBatchDetectDominantLanguage extends sfn.TaskStateBase {
  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];

  constructor(scope: Construct, id: string, private readonly props: ComprehendBatchDetectDominantLanguageProps) {
    super(scope, id, props);

    this.taskPolicies = [
      new iam.PolicyStatement({
        actions: ['comprehend:BatchDetectDominantLanguage'],
        resources: ['*'],
      }),
    ];
  }

  /**
    * @internal
    */
  protected _renderTask(): any {
    return {
      Resource: getComprehendResourceArn(ComprehendMethod.BATCH_DETECT_DOMINANT_LANGUAGE),
      Parameters: sfn.FieldUtils.renderObject({
        TextList: this.props.textList,
      }),
    };
  }
}


