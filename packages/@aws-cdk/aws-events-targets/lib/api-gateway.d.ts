import * as api from '@aws-cdk/aws-apigateway';
import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import { TargetBaseProps } from './util';
/**
 * Customize the API Gateway Event Target
 */
export interface ApiGatewayProps extends TargetBaseProps {
    /**
     * The method for api resource invoked by the rule.
     *
     * @default '*' that treated as ANY
     */
    readonly method?: string;
    /**
     * The api resource invoked by the rule.
     * We can use wildcards('*') to specify the path. In that case,
     * an equal number of real values must be specified for pathParameterValues.
     *
     * @default '/'
     */
    readonly path?: string;
    /**
     * The deploy stage of api gateway invoked by the rule.
     *
     * @default the value of deploymentStage.stageName of target api gateway.
     */
    readonly stage?: string;
    /**
     * The headers to be set when requesting API
     *
     * @default no header parameters
     */
    readonly headerParameters?: {
        [key: string]: (string);
    };
    /**
     * The path parameter values to be used to
     * populate to wildcards("*") of requesting api path
     *
     * @default no path parameters
     */
    readonly pathParameterValues?: string[];
    /**
     * The query parameters to be set when requesting API.
     *
     * @default no querystring parameters
     */
    readonly queryStringParameters?: {
        [key: string]: (string);
    };
    /**
     * This will be the post request body send to the API.
     *
     * @default the entire EventBridge event
     */
    readonly postBody?: events.RuleTargetInput;
    /**
     * The role to assume before invoking the target
     * (i.e., the pipeline) when the given rule is triggered.
     *
     * @default - a new role will be created
     */
    readonly eventRole?: iam.IRole;
}
/**
 * Use an API Gateway REST APIs as a target for Amazon EventBridge rules.
 */
export declare class ApiGateway implements events.IRuleTarget {
    readonly restApi: api.RestApi;
    private readonly props?;
    constructor(restApi: api.RestApi, props?: ApiGatewayProps | undefined);
    /**
     * Returns a RuleTarget that can be used to trigger this API Gateway REST APIs
     * as a result from an EventBridge event.
     *
     * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/resource-based-policies-eventbridge.html#sqs-permissions
     */
    bind(rule: events.IRule, _id?: string): events.RuleTargetConfig;
}
