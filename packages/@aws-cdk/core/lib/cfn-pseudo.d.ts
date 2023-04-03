import { Construct } from 'constructs';
/**
 * Accessor for pseudo parameters
 *
 * Since pseudo parameters need to be anchored to a stack somewhere in the
 * construct tree, this class takes an scope parameter; the pseudo parameter
 * values can be obtained as properties from an scoped object.
 */
export declare class Aws {
    static readonly ACCOUNT_ID: string;
    static readonly URL_SUFFIX: string;
    static readonly NOTIFICATION_ARNS: string[];
    static readonly PARTITION: string;
    static readonly REGION: string;
    static readonly STACK_ID: string;
    static readonly STACK_NAME: string;
    static readonly NO_VALUE: string;
    private constructor();
}
/**
 * Accessor for scoped pseudo parameters
 *
 * These pseudo parameters are anchored to a stack somewhere in the construct
 * tree, and their values will be exported automatically.
 */
export declare class ScopedAws {
    private readonly scope;
    constructor(scope: Construct);
    get accountId(): string;
    get urlSuffix(): string;
    get notificationArns(): string[];
    get partition(): string;
    get region(): string;
    get stackId(): string;
    get stackName(): string;
    private asString;
}
