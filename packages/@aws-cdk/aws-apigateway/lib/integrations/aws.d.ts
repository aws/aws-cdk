import { Integration, IntegrationConfig, IntegrationOptions } from '../integration';
import { Method } from '../method';
export interface AwsIntegrationProps {
    /**
     * Use AWS_PROXY integration.
     *
     * @default false
     */
    readonly proxy?: boolean;
    /**
     * The name of the integrated AWS service (e.g. `s3`)
     */
    readonly service: string;
    /**
     * A designated subdomain supported by certain AWS service for fast
     * host-name lookup.
     */
    readonly subdomain?: string;
    /**
     * The path to use for path-base APIs.
     *
     * For example, for S3 GET, you can set path to `bucket/key`.
     * For lambda, you can set path to `2015-03-31/functions/${function-arn}/invocations`
     *
     * Mutually exclusive with the `action` options.
     */
    readonly path?: string;
    /**
     * The AWS action to perform in the integration.
     *
     * Use `actionParams` to specify key-value params for the action.
     *
     * Mutually exclusive with `path`.
     */
    readonly action?: string;
    /**
     * Parameters for the action.
     *
     * `action` must be set, and `path` must be undefined.
     * The action params will be URL encoded.
     */
    readonly actionParameters?: {
        [key: string]: string;
    };
    /**
     * The integration's HTTP method type.
     *
     * @default POST
     */
    readonly integrationHttpMethod?: string;
    /**
     * Integration options, such as content handling, request/response mapping, etc.
     */
    readonly options?: IntegrationOptions;
    /**
     * The region of the integrated AWS service.
     *
     * @default - same region as the stack
     */
    readonly region?: string;
}
/**
 * This type of integration lets an API expose AWS service actions. It is
 * intended for calling all AWS service actions, but is not recommended for
 * calling a Lambda function, because the Lambda custom integration is a legacy
 * technology.
 */
export declare class AwsIntegration extends Integration {
    private scope?;
    constructor(props: AwsIntegrationProps);
    bind(method: Method): IntegrationConfig;
}
