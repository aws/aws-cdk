import * as sns from '@aws-cdk/aws-sns';
import * as core from '@aws-cdk/core';
import { Construct } from 'constructs';

/**
 * Initialization props for the `NestedStack` construct.
 *
 * @deprecated use core.NestedStackProps instead
 */
export interface NestedStackProps {
  /**
   * The set value pairs that represent the parameters passed to CloudFormation
   * when this nested stack is created. Each parameter has a name corresponding
   * to a parameter defined in the embedded template and a value representing
   * the value that you want to set for the parameter.
   *
   * The nested stack construct will automatically synthesize parameters in order
   * to bind references from the parent stack(s) into the nested stack.
   *
   * @default - no user-defined parameters are passed to the nested stack
   */
  readonly parameters?: { [key: string]: string };

  /**
   * The length of time that CloudFormation waits for the nested stack to reach
   * the CREATE_COMPLETE state.
   *
   * When CloudFormation detects that the nested stack has reached the
   * CREATE_COMPLETE state, it marks the nested stack resource as
   * CREATE_COMPLETE in the parent stack and resumes creating the parent stack.
   * If the timeout period expires before the nested stack reaches
   * CREATE_COMPLETE, CloudFormation marks the nested stack as failed and rolls
   * back both the nested stack and parent stack.
   *
   * @default - no timeout
   */
  readonly timeout?: core.Duration;

  /**
   * The Simple Notification Service (SNS) topics to publish stack related
   * events.
   *
   * @default - notifications are not sent for this stack.
   */
  readonly notifications?: sns.ITopic[];
}

/**
 * A CloudFormation nested stack.
 *
 * When you apply template changes to update a top-level stack, CloudFormation
 * updates the top-level stack and initiates an update to its nested stacks.
 * CloudFormation updates the resources of modified nested stacks, but does not
 * update the resources of unmodified nested stacks.
 *
 * Furthermore, this stack will not be treated as an independent deployment
 * artifact (won't be listed in "cdk list" or deployable through "cdk deploy"),
 * but rather only synthesized as a template and uploaded as an asset to S3.
 *
 * Cross references of resource attributes between the parent stack and the
 * nested stack will automatically be translated to stack parameters and
 * outputs.
 *
 * @deprecated use core.NestedStack instead
 */
export class NestedStack extends core.NestedStack {
  constructor(scope: Construct, id: string, props: NestedStackProps = { }) {
    super(scope, id, {
      parameters: props.parameters,
      timeout: props.timeout,
      notificationArns: props.notifications?.map(n => n.topicArn),
    });
  }
}
