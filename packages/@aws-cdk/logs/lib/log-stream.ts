import cdk = require('@aws-cdk/core');
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

        this.logStreamName = resource.ref;
    }
}

/**
 * The name of a log stream
 */
export class LogStreamName extends cdk.Token {
}
