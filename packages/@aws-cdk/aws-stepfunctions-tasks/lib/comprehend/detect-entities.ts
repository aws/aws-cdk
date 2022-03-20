import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Construct } from 'constructs';
import { ComprehendMethod, getComprehendResourceArn } from './private/utils';

/**
 * Properties for ComprehendDetectDominantLanguage Task
 */
export interface ComprehendDetectEntitiesProps extends sfn.TaskStateBaseProps {
  /**
   * The language of the input documents. You can specify any of the primary languages
   * supported by Amazon Comprehend. All documents must be in the same language.
   *
   * @see https://docs.aws.amazon.com/comprehend/latest/dg/API_DetectEntities.html#comprehend-DetectEntities-request-LanguageCode
   *
   * @default - No language required, valid values (en | es | fr | de | it | pt | ar | hi | ja | ko | zh | zh-TW)
   */
  readonly languageCode?: string;

  /**
   * A UTF-8 text string. Each string must contain fewer that 5,000 bytes of UTF-8
   * encoded characters.
   *
   * @see https://docs.aws.amazon.com/comprehend/latest/dg/API_DetectEntities.html#comprehend-DetectEntities-request-Text
   */
  readonly text: string;
}

/**
 * A StepFunctions task to call ComprehendDetectDominantLanguage
 */
export class ComprehendDetectEntities extends sfn.TaskStateBase {
  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];

  constructor(scope: Construct, id: string, private readonly props: ComprehendDetectEntitiesProps) {
    super(scope, id, props);

    this.taskPolicies = [
      new iam.PolicyStatement({
        actions: [`comprehend:${ComprehendMethod.DETECT_ENTITIES}`],
        resources: ['*'],
      }),
    ];
  }

  /**
    * @internal
    */
  protected _renderTask(): any {
    return {
      Resource: getComprehendResourceArn(ComprehendMethod.DETECT_ENTITIES),
      Parameters: sfn.FieldUtils.renderObject({
        LanguageCode: this.props.languageCode,
        Text: this.props.text,
      }),
    };
  }
}
