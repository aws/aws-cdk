import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Construct } from 'constructs';
import { ComprehendMethod, getComprehendResourceArn } from './private/utils';

/**
 * Properties for ComprehendDetectDominantLanguage Task
 * 
 * @see https://docs.aws.amazon.com/comprehend/latest/dg/API_DetectDominantLanguage.html#API_DetectDominantLanguage_RequestSyntax
 */
export interface ComprehendDetectDominantLanguageProps extends sfn.TaskStateBaseProps {
  /**
   * A UTF-8 text string. Each string should contain at least 20 characters and must
   * contain fewer that 5,000 bytes of UTF-8 encoded characters.
   */
  readonly text: string;
}

/**
 * A StepFunctions task to call ComprehendDetectDominantLanguage
 */
export class ComprehendDetectDominantLanguage extends sfn.TaskStateBase {
  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];

  constructor(scope: Construct, id: string, private readonly props: ComprehendDetectDominantLanguageProps) {
    super(scope, id, props);

    this.taskPolicies = [
      new iam.PolicyStatement({
        actions: ['comprehend:DetectDominantLanguage'],
        resources: ['*'],
      }),
    ];
  }

  /**
    * @internal
    */
  protected _renderTask(): any {
    return {
      Resource: getComprehendResourceArn(ComprehendMethod.DETECT_DOMINANT_LANGUAGE),
      Parameters: sfn.FieldUtils.renderObject({
        Text: this.props.text,
      }),
    };
  }
}


