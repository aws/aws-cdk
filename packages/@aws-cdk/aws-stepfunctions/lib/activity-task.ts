import cdk = require('@aws-cdk/cdk');
import { IActivity } from './activity';
import { BasicTaskProps, Task } from './states/task';

/**
 * Properties for FunctionTask
 */
export interface ActivityTaskProps extends BasicTaskProps {
  /**
   * The function to run
   */
  activity: IActivity;

  /**
   * Maximum time between heart beats
   *
   * If the time between heart beats takes longer than this, a 'Timeout' error is raised.
   *
   * This is only relevant when using an Activity type as resource.
   *
   * @default No heart beat timeout
   */
  heartbeatSeconds?: number;
}

/**
 * A StepFunctions Task to invoke a Lambda function.
 *
 * A Function can be used directly as a Resource, but this class mirrors
 * integration with other AWS services via a specific class instance.
 */
export class ActivityTask extends Task {
  constructor(scope: cdk.Construct, id: string, props: ActivityTaskProps) {
    super(scope, id, {
      ...props,
      resource: props.activity,
      heartbeatSeconds: props.heartbeatSeconds
    });
  }
}
