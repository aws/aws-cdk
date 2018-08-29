import cdk = require('@aws-cdk/cdk');
import { Task } from './asl-states';

/**
 * Interface for objects that can be invoked in a Task state
 */
export interface IStepFunctionsTaskResource {
    /**
     * Return the properties required for using this object as a Task resource
     */
    asStepFunctionsTaskResource(callingTask: Task): StepFunctionsTaskResourceProps;
}

export interface StepFunctionsTaskResourceProps {
    resourceArn: cdk.Arn;
}
