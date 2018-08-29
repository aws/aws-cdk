import cdk = require('@aws-cdk/cdk');
import { ActivityArn, ActivityName, cloudformation } from './stepfunctions.generated';

export interface ActivityProps {
    /**
     * The name for this activity.
     *
     * The name is required.
     */
    activityName: string;
}

/**
 * Define a new StepFunctions activity
 */
export class Activity extends cdk.Construct {
    public readonly activityArn: ActivityArn;
    public readonly activityName: ActivityName;

    constructor(parent: cdk.Construct, id: string, props: ActivityProps) {
        super(parent, id);

        const resource = new cloudformation.ActivityResource(this, 'Resource', {
            activityName: props.activityName
        });

        this.activityArn = resource.ref;
        this.activityName = resource.activityName;
    }
}