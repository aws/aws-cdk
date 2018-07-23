import cdk = require('@aws-cdk/cdk');
import { LogGroup } from './log-group';
import { cloudformation } from './logs.generated';

/**
 * Properties for a new LogStream
 */
export interface LogStreamProps {
    /**
     * The log group to create a log stream for.
     */
    logGroup: LogGroup;

    /**
     * The name of the log stream to create.
     *
     * The name must be unique within the log group.
     *
     * @default Automatically generated
     */
    logStreamName?: string;

    /**
     * Retain the log stream if the stack or containing construct ceases to exist
     *
     * Normally you want to retain the log stream so you can diagnose issues
     * from logs even after a deployment that no longer includes the log stream.
     *
     * The date-based retention policy of your log group will age out the logs
     * after a certain time.
     *
     * @default true
     */
    retainLogStream?: boolean;
}

/**
 * A new Log Stream in a Log Group
 */
export class LogStream extends cdk.Construct {
    /**
     * The name of this log stream
     */
    public readonly logStreamName: LogStreamName;

    constructor(parent: cdk.Construct, id: string, props: LogStreamProps) {
        super(parent, id);

        const resource = new cloudformation.LogStreamResource(this, 'Resource', {
            logGroupName: props.logGroup.logGroupName,
            logStreamName: props.logStreamName
        });

        if (props.retainLogStream !== false) {
            resource.options.deletionPolicy = cdk.DeletionPolicy.Retain;
        }

        this.logStreamName = resource.ref;
    }
}

/**
 * The name of a log stream
 */
export class LogStreamName extends cdk.Token {
}
