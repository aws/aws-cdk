import cdk = require('@aws-cdk/cdk');
import { IStepFunctionsTaskResource, StepFunctionsTaskResourceProps, Task } from './states/task';
import { ActivityArn, ActivityName, cloudformation } from './stepfunctions.generated';

export interface ActivityProps {
    /**
     * The name for this activity.
     *
     * @default If not supplied, a name is generated
     */
    activityName?: string;
}

/**
 * Define a new StepFunctions activity
 */
export class Activity extends cdk.Construct implements IStepFunctionsTaskResource {
    public readonly activityArn: ActivityArn;
    public readonly activityName: ActivityName;

    constructor(parent: cdk.Construct, id: string, props: ActivityProps = {}) {
        super(parent, id);

        const resource = new cloudformation.ActivityResource(this, 'Resource', {
            activityName: props.activityName || this.uniqueId
        });

        this.activityArn = resource.ref;
        this.activityName = resource.activityName;
    }

    public asStepFunctionsTaskResource(_callingTask: Task): StepFunctionsTaskResourceProps {
        // No IAM permissions necessary, execution role implicitly has Activity permissions.
        return {
            resourceArn: this.activityArn
        };
    }
}