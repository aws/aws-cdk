import stepfunctions = require('@aws-cdk/aws-stepfunctions');
import cdk = require('@aws-cdk/cdk');
import { IFunction } from './lambda-ref';

/**
 * Properties for FunctionTask
 */
export interface FunctionTaskProps extends stepfunctions.BasicTaskProps {
  /**
   * The function to run
   */
  function: IFunction;
}

/**
 * A StepFunctions Task to invoke a Lambda function.
 *
 * A Function can be used directly as a Resource, but this class mirrors
 * integration with other AWS services via a specific class instance.
 */
export class FunctionTask extends stepfunctions.Task {
  constructor(scope: cdk.Construct, id: string, props: FunctionTaskProps) {
    super(scope, id, {
      ...props,
      resource: props.function,
    });
  }
}