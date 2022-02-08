import * as codepipeline from '@aws-cdk/aws-codepipeline';
import { Action } from '../action';
import { SingletonPolicy } from '../private/cloudformation/_singleton-policy';
import { StackInstances, StackSetParameters } from './stackset-types';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct as CoreConstruct } from '@aws-cdk/core';

/**
 * Properties for the CloudFormationStackInstancesAction
 */
export interface CloudFormationStackInstancesActionProps extends codepipeline.CommonAwsActionProps {
  /**
   * The AWS Region the StackSet resides in.
   *
   * Note that a cross-region Pipeline requires replication buckets to function correctly.
   * You can provide their names with the `PipelineProps.crossRegionReplicationBuckets` property.
   * If you don't, the CodePipeline Construct will create new Stacks in your CDK app containing those buckets,
   * that you will need to `cdk deploy` before deploying the main, Pipeline-containing Stack.
   *
   * @default - the same region as the Pipeline
   */
  readonly region?: string;

  /**
   * The name of the StackSet we are adding instances to
   */
  readonly stackSetName: string;

  /**
   * Specify where to create or update Stack Instances
   *
   * You can specify either AWS Accounts Ids or AWS Organizations Organizational Units.
   */
  readonly stackInstances: StackInstances;

  /**
   * Parameter values that only apply to the current Stack Instances
   *
   * These parameters are shared between all instances added by this action.
   *
   * @default - no parameters will be overridden
   */
  readonly parameterOverrides?: StackSetParameters;

  /**
   * The percentage of accounts per Region for which this stack operation can fail before AWS CloudFormation stops the operation in that Region. If
   * the operation is stopped in a Region, AWS CloudFormation doesn't attempt the operation in subsequent Regions. When calculating the number
   * of accounts based on the specified percentage, AWS CloudFormation rounds down to the next whole number.
   *
   * @default 0%
   */
  readonly failureTolerancePercentage?: number;

  /**
   * The maximum percentage of accounts in which to perform this operation at one time. When calculating the number of accounts based on the specified
   * percentage, AWS CloudFormation rounds down to the next whole number. If rounding down would result in zero, AWS CloudFormation sets the number as
   * one instead. Although you use this setting to specify the maximum, for large deployments the actual number of accounts acted upon concurrently
   * may be lower due to service throttling.
   *
   * @default 1%
   */
  readonly maxAccountConcurrencyPercentage?: number;
}

/**
 * CodePipeline action to create/update Stack Instances of a StackSet
 *
 * After the initial creation of a stack set, you can add new stack instances by
 * using CloudFormationStackInstances. Template parameter values can be
 * overridden at the stack instance level during create or update stack set
 * instance operations.
 *
 * Each stack set has one template and set of template parameters. When you
 * update the template or template parameters, you update them for the entire
 * set. Then all instance statuses are set to OUTDATED until the changes are
 * deployed to that instance.
 */
export class CloudFormationStackInstancesAction extends Action {
  private readonly props: CloudFormationStackInstancesActionProps;

  constructor(props: CloudFormationStackInstancesActionProps) {
    super({
      ...props,
      provider: 'CloudFormationStackInstances',
      category: codepipeline.ActionCategory.DEPLOY,
      artifactBounds: {
        minInputs: 0,
        maxInputs: 3,
        minOutputs: 0,
        maxOutputs: 0,
      },
      inputs: [
        ...props.parameterOverrides?.artifactsReferenced ?? [],
        ...props.stackInstances?.artifactsReferenced ?? [],
      ],
    });

    this.props = props;
  }

  protected bound(scope: CoreConstruct, _stage: codepipeline.IStage, options: codepipeline.ActionBindOptions): codepipeline.ActionConfig {
    const singletonPolicy = SingletonPolicy.forRole(options.role);
    singletonPolicy.grantCreateUpdateStackSet(this.props);

    const instancesResult = this.props.stackInstances?.bind(scope);

    if ((this.actionProperties.inputs || []).length > 0) {
      options.bucket.grantRead(singletonPolicy);
    }

    return {
      configuration: {
        StackSetName: this.props.stackSetName,
        ParameterOverrides: this.props.parameterOverrides?.render(),
        FailureTolerancePercentage: this.props.failureTolerancePercentage,
        MaxConcurrentPercentage: this.props.maxAccountConcurrencyPercentage,
        ...instancesResult?.stackSetConfiguration,
      },
    };
  }
}
