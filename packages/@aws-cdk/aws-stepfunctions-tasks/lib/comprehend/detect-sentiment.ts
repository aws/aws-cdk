import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Construct } from 'constructs';
import { ComprehendMethod, getComprehendResourceArn } from './private/utils';

/**
 * Properties for ComprehendDetectSentiment Task
 *
 * @see https://docs.aws.amazon.com/comprehend/latest/dg/API_BatchDetectSentiment.html#API_BatchDetectSentiment_RequestSyntax
 */
export interface ComprehendDetectSentimentProps extends sfn.TaskStateBaseProps {
  /**
   * The language of the input documents. You can specify any of the primary languages
   * supported by Amazon Comprehend. All documents must be in the same language.
   *
   * @see https://docs.aws.amazon.com/comprehend/latest/dg/API_DetectSentiment.html#comprehend-DetectSentiment-request-LanguageCode
   */
  readonly languageCode: string;

  /**
   * A UTF-8 text string. Each string must contain fewer that 5,000 bytes of UTF-8 encoded characters.
   *
   * @see https://docs.aws.amazon.com/comprehend/latest/dg/API_DetectSentiment.html#comprehend-DetectSentiment-request-Text
   */
  readonly text: string;
}

/**
 * A StepFunctions task to call ComprehendDetectSentiment
 */
export class ComprehendDetectSentiment extends sfn.TaskStateBase {
  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];

  constructor(scope: Construct, id: string, private readonly props: ComprehendDetectSentimentProps) {
    super(scope, id, props);

    this.taskPolicies = [
      new iam.PolicyStatement({
        actions: ['comprehend:DetectSentiment'],
        resources: ['*'],
      }),
    ];
  }

  /**
    * @internal
    */
  protected _renderTask(): any {
    return {
      Resource: getComprehendResourceArn(ComprehendMethod.DETECT_SENTIMENT),
      Parameters: sfn.FieldUtils.renderObject({
        LanguageCode: this.props.languageCode,
        Text: this.props.text,
      }),
    };
  }
}
