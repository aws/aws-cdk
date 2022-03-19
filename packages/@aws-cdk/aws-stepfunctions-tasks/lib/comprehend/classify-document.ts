import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Construct } from 'constructs';
import { ComprehendMethod, getComprehendResourceArn } from './private/utils';

/**
 * Properties for ComprehendClassifyDocument Task
 * 
 * @see https://docs.aws.amazon.com/comprehend/latest/dg/API_ClassifyDocument.html#API_ClassifyDocument_RequestSyntax
 */
export interface ComprehendClassifyDocumentProps extends sfn.TaskStateBaseProps {
  /**
   * Amazon Resource Number (ARN) of the endpoint.
   */
  readonly endpointArn: string;

  /**
   * The document text to be analyzed.
   */
  readonly text: string;
}

/**
 * A StepFunctions task to call ComprehendClassifyDocument
 */
export class ComprehendClassifyDocument extends sfn.TaskStateBase {
  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];

  constructor(scope: Construct, id: string, private readonly props: ComprehendClassifyDocumentProps) {
    super(scope, id, props);

    this.taskPolicies = [
      new iam.PolicyStatement({
        actions: ['comprehend:classifyDocument'],
        resources: ['*'],
      }),
    ];
  }

  /**
    * @internal
    */
  protected _renderTask(): any {
    return {
      Resource: getComprehendResourceArn(ComprehendMethod.CLASSIFY_DOCUMENT),
      Parameters: sfn.FieldUtils.renderObject({
        EndpointArn: this.props.endpointArn,
        Text: this.props.text,
      }),
    };
  }
}


