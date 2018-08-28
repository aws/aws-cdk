import cdk = require('@aws-cdk/cdk');

import { cloudformation } from './stepfunctions.generated';

export interface ActivityProps {
    /**
     * The name for this activity.
     *
     * The name is required.
     */
    activityName: string;
}

export class Activity extends cdk.Construct {

}