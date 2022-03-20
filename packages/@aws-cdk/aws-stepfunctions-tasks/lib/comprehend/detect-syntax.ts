import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Construct } from 'constructs';
import { ComprehendLanguageCode } from './base-types';
import { ComprehendMethod, getComprehendResourceArn } from './private/utils';

/**
 * Properties for ComprehendDetectSyntax Task
 */
export interface ComprehendDetectSyntaxProps extends sfn.TaskStateBaseProps {
  /**
   * The language code of the input documents. You can specify any of the following languages
   * supported by Amazon Comprehend: German ("de"), English ("en"), Spanish ("es"), French ("fr"),
   * Italian ("it"), or Portuguese ("pt").
   *
   * @see https://docs.aws.amazon.com/comprehend/latest/dg/API_DetectSyntax.html#comprehend-DetectSyntax-request-LanguageCode
   */
  readonly languageCode: ComprehendLanguageCode;

  /**
   * A UTF-8 string. Each string must contain fewer that 5,000 bytes of UTF encoded characters.
   *
   * @see https://docs.aws.amazon.com/comprehend/latest/dg/API_DetectSyntax.html#comprehend-DetectSyntax-request-Text
   */
  readonly text: string;
}

/**
 * A StepFunctions task to call ComprehendDetectSyntax
 */
export class ComprehendDetectSyntax extends sfn.TaskStateBase {
  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];

  constructor(scope: Construct, id: string, private readonly props: ComprehendDetectSyntaxProps) {
    super(scope, id, props);

    this.taskPolicies = [
      new iam.PolicyStatement({
        actions: ['comprehend:detectSyntax'],
        resources: ['*'],
      }),
    ];
  }

  /**
    * @internal
    */
  protected _renderTask(): any {
    return {
      Resource: getComprehendResourceArn(ComprehendMethod.DETECT_SYNTAX),
      Parameters: sfn.FieldUtils.renderObject({
        LanguageCode: this.props.languageCode,
        Text: this.props.text,
      }),
    };
  }
}


