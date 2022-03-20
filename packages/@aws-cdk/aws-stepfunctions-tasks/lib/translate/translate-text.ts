import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Construct } from 'constructs';
import { getTranslateResourceArn, TranslateMethod } from './private/utils';

/**
 * Properties for TranslateTranslateText Task
 */
export interface TranslateTranslateTextProps extends sfn.TaskStateBaseProps {
  /**
   * The language code for the language of the source text. The language must be a language supported by Amazon Translate.
   *
   * @see https://docs.aws.amazon.com/translate/latest/dg/API_TranslateText.html#Translate-TranslateText-request-SourceLanguageCode
   */
  readonly sourceLanguageCode: string;
  /**
   * The language code requested for the language of the target text. The language must be a language supported by Amazon Translate.
   *
   * @see https://docs.aws.amazon.com/translate/latest/dg/API_TranslateText.html#Translate-TranslateText-request-TargetLanguageCode
   */
  readonly targetLanguageCode: string;
  /**
   * The text to translate. The text string can be a maximum of 5,000 bytes long. Depending on your character set, this may be fewer
   * than 5,000 characters.
   *
   * @see https://docs.aws.amazon.com/translate/latest/dg/API_TranslateText.html#Translate-TranslateText-request-Text
   */
  readonly text: string;
}

/**
 * A StepFunctions task to call TranslateTranslateText
 */
export class TranslateTranslateText extends sfn.TaskStateBase {
  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];

  constructor(scope: Construct, id: string, private readonly props: TranslateTranslateTextProps) {
    super(scope, id, props);

    this.taskPolicies = [
      new iam.PolicyStatement({
        actions: [`translate:${TranslateMethod.TRANSLATE_TEXT}`],
        resources: ['*'],
      }),
    ];
  }

  /**
    * @internal
    */
  protected _renderTask(): any {
    return {
      Resource: getTranslateResourceArn(TranslateMethod.TRANSLATE_TEXT),
      Parameters: sfn.FieldUtils.renderObject({
        SourceLanguageCode: this.props.sourceLanguageCode,
        TargetLanguageCode: this.props.targetLanguageCode,
        Text: this.props.text,
      }),
    };
  }
}