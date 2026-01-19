
import { Construct } from 'constructs';
import * as iam from '../../../aws-iam';
import { IKeyRef } from '../../../aws-kms';
import * as sfn from '../../../aws-stepfunctions';
import { CustomerManagedEncryptionConfiguration } from '../../../aws-stepfunctions/lib/customer-managed-key-encryption-configuration';

interface StepFunctionsInvokeActivityOptions {
  /**
   * Step Functions Activity to invoke
   */
  readonly activity: sfn.IActivity;
}

interface StepFunctionsInvokeActivityJsonPathOptions {
  /**
   * Parameters pass a collection of key-value pairs, either static values or JSONPath expressions that select from the input.
   *
   * @see https://docs.aws.amazon.com/step-functions/latest/dg/input-output-inputpath-params.html#input-output-parameters
   *
   * @default No parameters
   */
  readonly parameters?: { [name: string]: any };
}

/**
 * Properties for invoking an Activity worker using JSONPath
 */
export interface StepFunctionsInvokeActivityJsonPathProps
  extends sfn.TaskStateJsonPathBaseProps, StepFunctionsInvokeActivityOptions, StepFunctionsInvokeActivityJsonPathOptions {}

/**
 * Properties for invoking an Activity worker using JSONata
 */
export interface StepFunctionsInvokeActivityJsonataProps
  extends sfn.TaskStateJsonataBaseProps, StepFunctionsInvokeActivityOptions, sfn.JsonataStateOptions {}

/**
 * Properties for invoking an Activity worker
 */
export interface StepFunctionsInvokeActivityProps
  extends sfn.TaskStateBaseProps, StepFunctionsInvokeActivityOptions, StepFunctionsInvokeActivityJsonPathOptions, sfn.JsonataStateOptions {}

/**
 * A Step Functions Task to invoke an Activity worker.
 *
 * An Activity can be used directly as a Resource.
 */
export class StepFunctionsInvokeActivity extends sfn.TaskStateBase {
  /**
   * A Step Functions Task using JSONPath to invoke an Activity worker.
   *
   * An Activity can be used directly as a Resource.
   */
  public static jsonPath(scope: Construct, id: string, props: StepFunctionsInvokeActivityJsonPathProps) {
    return new StepFunctionsInvokeActivity(scope, id, props);
  }

  /**
   * A Step Functions Task using JSONata to invoke an Activity worker.
   *
   * An Activity can be used directly as a Resource.
   */
  public static jsonata(scope: Construct, id: string, props: StepFunctionsInvokeActivityJsonataProps) {
    return new StepFunctionsInvokeActivity(scope, id, {
      ...props,
      queryLanguage: sfn.QueryLanguage.JSONATA,
    });
  }

  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  // No IAM permissions necessary unless the Activity uses a customer managed KMS key
  protected readonly taskPolicies?: iam.PolicyStatement[];

  constructor(scope: Construct, id: string, private readonly props: StepFunctionsInvokeActivityProps) {
    super(scope, id, props);

    if (this.props.activity.encryptionConfiguration instanceof CustomerManagedEncryptionConfiguration) {
      this.taskPolicies = this.createPolicyStatements(this.props.activity.encryptionConfiguration.kmsKey);
    }
    this.taskMetrics = {
      metricDimensions: { ActivityArn: this.props.activity.activityArn },
      metricPrefixSingular: 'Activity',
      metricPrefixPlural: 'Activities',
    };
  }

  /**
   * @internal
   */
  protected _renderTask(topLevelQueryLanguage?: sfn.QueryLanguage): any {
    const queryLanguage = sfn._getActualQueryLanguage(topLevelQueryLanguage, this.props.queryLanguage);
    const paramOrArgProps = this.props.parameters ?? this.props.arguments;
    const paramOrArg = paramOrArgProps ? this._renderParametersOrArguments(paramOrArgProps, queryLanguage) : undefined;
    return {
      Resource: this.props.activity.activityArn,
      ...paramOrArg,
    };
  }

  // IAM policy for the State Machine execution role to use the Activity KMS key when encrypting inputs
  private createPolicyStatements(kmskey: IKeyRef): iam.PolicyStatement[] {
    return [
      new iam.PolicyStatement({
        actions: [
          'kms:Decrypt', 'kms:GenerateDataKey',
        ],
        resources: [kmskey.keyRef.keyArn],
        conditions: {
          StringEquals: {
            'kms:EncryptionContext:aws:states:activityArn': this.props.activity.activityArn,
          },
        },
      }),
    ];
  }
}
