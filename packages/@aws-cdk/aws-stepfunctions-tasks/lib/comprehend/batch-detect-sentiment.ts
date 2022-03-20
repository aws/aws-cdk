import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Construct } from 'constructs';
import { ComprehendMethod, getComprehendResourceArn } from './private/utils';

/**
 * Properties for ComprehendBatchDetectSentiment Task
 *
 * @see https://docs.aws.amazon.com/comprehend/latest/dg/API_BatchDetectSentiment.html#API_BatchDetectSentiment_RequestSyntax
 */
export interface ComprehendBatchDetectSentimentProps extends sfn.TaskStateBaseProps {
  /**
   * The language of the input documents. You can specify any of the primary languages
   * supported by Amazon Comprehend. All documents must be in the same language.
   *
   * @see https://docs.aws.amazon.com/comprehend/latest/dg/API_BatchDetectSentiment.html#comprehend-BatchDetectSentiment-request-LanguageCode
   */
  readonly languageCode: string;

  /**
   * A list containing the text of the input documents. The list can contain a maximum of 25
   * documents. Each document should contain at least 20 characters and must contain fewer
   * than 5,000 bytes of UTF-8 encoded characters.
   *
   * @see https://docs.aws.amazon.com/comprehend/latest/dg/API_BatchDetectSentiment.html#comprehend-BatchDetectSentiment-request-TextList
   */
  readonly textList: string[];
}

/**
 * A StepFunctions task to call ComprehendBatchDetectSentiment
 */
export class ComprehendBatchDetectSentiment extends sfn.TaskStateBase {
  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];

  constructor(scope: Construct, id: string, private readonly props: ComprehendBatchDetectSentimentProps) {
    super(scope, id, props);

    this.taskPolicies = [
      new iam.PolicyStatement({
        actions: ['comprehend:batchDetectSentiment'],
        resources: ['*'],
      }),
    ];
  }

  /**
    * @internal
    */
  protected _renderTask(): any {
    return {
      Resource: getComprehendResourceArn(ComprehendMethod.BATCH_DETECT_SENTIMENT),
      Parameters: sfn.FieldUtils.renderObject({
        LanguageCode: this.props.languageCode,
        TextList: this.props.textList,
      }),
    };
  }
}
