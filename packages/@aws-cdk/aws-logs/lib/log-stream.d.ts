import { IResource, RemovalPolicy, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { ILogGroup } from './log-group';
export interface ILogStream extends IResource {
    /**
     * The name of this log stream
     * @attribute
     */
    readonly logStreamName: string;
}
/**
 * Properties for a LogStream
 */
export interface LogStreamProps {
    /**
     * The log group to create a log stream for.
     */
    readonly logGroup: ILogGroup;
    /**
     * The name of the log stream to create.
     *
     * The name must be unique within the log group.
     *
     * @default Automatically generated
     */
    readonly logStreamName?: string;
    /**
     * Determine what happens when the log stream resource is removed from the
     * app.
     *
     * Normally you want to retain the log stream so you can diagnose issues from
     * logs even after a deployment that no longer includes the log stream.
     *
     * The date-based retention policy of your log group will age out the logs
     * after a certain time.
     *
     * @default RemovalPolicy.Retain
     */
    readonly removalPolicy?: RemovalPolicy;
}
/**
 * Define a Log Stream in a Log Group
 */
export declare class LogStream extends Resource implements ILogStream {
    /**
     * Import an existing LogGroup
     */
    static fromLogStreamName(scope: Construct, id: string, logStreamName: string): ILogStream;
    /**
     * The name of this log stream
     */
    readonly logStreamName: string;
    constructor(scope: Construct, id: string, props: LogStreamProps);
}
