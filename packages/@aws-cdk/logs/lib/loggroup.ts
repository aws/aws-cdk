import { Construct, Token } from '@aws-cdk/core';
import { cloudformation, LogGroupArn } from './logs.generated';

/**
 * Properties for a new LogGroup
 */
export interface LogGroupProps {
    /**
     * Name of the log group.
     *
     * @default Automatically generated
     */
    logGroupName?: string;

    /**
     * How long, in days, the log contents will be retained.
     *
     * To retain all logs, set this value to Infinity.
     *
     * @default 730 days (2 years)
     */
    retentionInDays?: number;
}

/**
 * Create a new CloudWatch Log Group
 */
export class LogGroup extends Construct {
    public readonly logGroupArn: LogGroupArn;
    public readonly logGroupName: LogGroupName;

    constructor(parent: Construct, name: string, props?: LogGroupProps) {
        super(parent, name);

        let retentionInDays = props && props.retentionInDays;
        if (retentionInDays === undefined) { retentionInDays = 365; }
        if (retentionInDays === Infinity) { retentionInDays = undefined; }

        if (retentionInDays !== undefined && retentionInDays <= 0) {
            throw new Error(`retentionInDays must be positive, got ${retentionInDays}`);
        }

        const resource = new cloudformation.LogGroupResource(this, 'Resource', {
            logGroupName: props && props.logGroupName,
            retentionInDays,
        });

        this.logGroupArn = resource.logGroupArn;
        this.logGroupName = resource.ref;
    }
}

/**
 * Name of a log group
 */
export class LogGroupName extends Token {
}
