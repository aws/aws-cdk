import { Construct, Token } from '@aws-cdk/core';
import { LogGroup } from './loggroup';
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

export class LogStream extends Construct {
    public readonly logStreamName: LogStreamName;

    constructor(parent: Construct, name: string, props: LogStreamProps) {
        super(parent, name);

        const resource = new cloudformation.LogStreamResource(this, 'Resource', {
            logGroupName: props.logGroup.logGroupName,
            logStreamName: props.logStreamName
        });

        this.logStreamName = resource.ref;
    }
}

export class LogStreamName extends Token {
}
