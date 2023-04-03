import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import { TargetBaseProps } from './util';
/**
 * Customize the EventBridge Api Destinations Target
 */
export interface ApiDestinationProps extends TargetBaseProps {
    /**
     * The event to send
     *
     * @default - the entire EventBridge event
     */
    readonly event?: events.RuleTargetInput;
    /**
     * The role to assume before invoking the target
     *
     * @default - a new role will be created
     */
    readonly eventRole?: iam.IRole;
    /**
     * Additional headers sent to the API Destination
     *
     * These are merged with headers specified on the Connection, with
     * the headers on the Connection taking precedence.
     *
     * You can only specify secret values on the Connection.
     *
     * @default - none
     */
    readonly headerParameters?: Record<string, string>;
    /**
     * Path parameters to insert in place of path wildcards (`*`).
     *
     * If the API destination has a wilcard in the path, these path parts
     * will be inserted in that place.
     *
     * @default - none
     */
    readonly pathParameterValues?: string[];
    /**
     * Additional query string parameters sent to the API Destination
     *
     * These are merged with headers specified on the Connection, with
     * the headers on the Connection taking precedence.
     *
     * You can only specify secret values on the Connection.
     *
     * @default - none
     */
    readonly queryStringParameters?: Record<string, string>;
}
/**
 * Use an API Destination rule target.
 */
export declare class ApiDestination implements events.IRuleTarget {
    private readonly apiDestination;
    private readonly props;
    constructor(apiDestination: events.IApiDestination, props?: ApiDestinationProps);
    /**
     * Returns a RuleTarget that can be used to trigger API destinations
     * from an EventBridge event.
     */
    bind(_rule: events.IRule, _id?: string): events.RuleTargetConfig;
}
