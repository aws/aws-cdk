import * as codepipeline from '@aws-cdk/aws-codepipeline';
import { Construct } from 'constructs';
import { SingletonPolicy } from './private/singleton-policy';
import { CommonCloudFormationStackSetOptions, StackInstances, StackSetParameters } from './stackset-types';
import { Action } from '../action';
import { validatePercentage } from '../common';

/**
 * Properties for the CloudFormationDeployStackInstancesAction
 */
export interface CloudFormationDeployStackInstancesActionProps extends codepipeline.CommonAwsActionProps, CommonCloudFormationStackSetOptions {
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
export class CloudFormationDeployStackInstancesAction extends Action {
  private readonly props: CloudFormationDeployStackInstancesActionProps;

  constructor(props: CloudFormationDeployStackInstancesActionProps) {
    super({
      ...props,
      region: props.stackSetRegion,
      provider: 'CloudFormationStackInstances',
      category: codepipeline.ActionCategory.DEPLOY,
      artifactBounds: {
        minInputs: 0,
        maxInputs: 3,
        minOutputs: 0,
        maxOutputs: 0,
      },
      inputs: [
        ...props.parameterOverrides?._artifactsReferenced ?? [],
        ...props.stackInstances?._artifactsReferenced ?? [],
      ],
    });

    this.props = props;

    validatePercentage('failureTolerancePercentage', props.failureTolerancePercentage);
    validatePercentage('maxAccountConcurrencyPercentage', props.maxAccountConcurrencyPercentage);
  }

  protected bound(scope: Construct, _stage: codepipeline.IStage, options: codepipeline.ActionBindOptions): codepipeline.ActionConfig {
    const singletonPolicy = SingletonPolicy.forRole(options.role);
    singletonPolicy.grantCreateUpdateStackSet(this.props);

    const instancesResult = this.props.stackInstances?._bind(scope);

    if ((this.actionProperties.inputs || []).length > 0) {
      options.bucket.grantRead(singletonPolicy);
    }

    return {
      configuration: {
        StackSetName: this.props.stackSetName,
        ParameterOverrides: this.props.parameterOverrides?._render(),
        FailureTolerancePercentage: this.props.failureTolerancePercentage,
        MaxConcurrentPercentage: this.props.maxAccountConcurrencyPercentage,
        ...instancesResult?.stackSetConfiguration,
      },
    };
  }
}
