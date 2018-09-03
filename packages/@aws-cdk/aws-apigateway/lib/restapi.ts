import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import { cloudformation, ResourceId, RestApiId } from './apigateway.generated';
import { RestApiBody } from './body';
import { CommonDeploymentProps, Deployment } from './deployment';
import { Method } from './method';
import { IRestApiResource, Resource } from './resource';
import { RestApiRef } from './restapi-ref';
import { Stage, StageOptions } from './stage';

export interface RestApiProps {
    /**
     * Indicates if a Deployment should be automatically created for this API,
     * and recreated when the API model (resources, methods) changes.
     *
     * Since API Gateway deployments are immutable, When this option is enabled
     * (by default), an AWS::ApiGateway::Deployment resource will automatically
     * created with a logical ID that hashes the API model (methods, resources
     * and options). This means that when the model changes, the logical ID of
     * this CloudFormation resource will change, and a new deployment will be
     * created.
     *
     * If this is set, `latestDeployment` will refer to the `Deployment` object
     * and `deploymentStage` will refer to a `Stage` that points to this
     * deployment. To customize the stage options, use the `autoDeployStage`
     * property.
     *
     * @default true
     */
    autoDeploy?: boolean;

    /**
     * Options for the latest deployment resource.
     * @default CommonDeploymentProps defaults
     */
    autoDeployOptions?: CommonDeploymentProps;

    /**
     * Options for the API Gateway stage that will always point to the latest
     * deployment when `autoDeploy` is enabled. If `autoDeploy` is disabled,
     * this value cannot be set.
     *
     * @default CommonStageProps defaults
     */
    autoDeployStageOptions?: StageOptions;

    /**
     * A name for the API Gateway RestApi resource.
     *
     * @default If this is not specified, and `body` (Open API definition)
     * doesn't include a name, the ID of the RestApi construct will be used.
     * Since this name doesn't need to be unique, that should be fine.
     */
    name?: string;

    /**
     * Custom header parameters for the request.
     * @see https://docs.aws.amazon.com/cli/latest/reference/apigateway/import-rest-api.html
     */
    parameters?: { [key: string]: string };

    /**
     * An OpenAPI specification that defines a set of RESTful APIs.
     */
    body?: RestApiBody;

    /**
     * A policy document that contains the permissions for this RestApi
     */
    policy?: cdk.PolicyDocument;

    /**
     * A description of the purpose of this API Gateway RestApi resource.
     * @default No description
     */
    description?: string;

    /**
     * The source of the API key for metering requests according to a usage
     * plan.
     * @default undefined metering is disabled
     */
    apiKeySourceType?: ApiKeySourceType;

    /**
     * The list of binary media mine-types that are supported by the RestApi
     * resource, such as "image/png" or "application/octet-stream"
     *
     * @default By default, RestApi supports only UTF-8-encoded text payloads
     */
    binaryMediaTypes?: string[];

    /**
     * A list of the endpoint types of the API. Use this property when creating
     * an API.
     */
    endpointTypes?: EndpointType[];

    /**
     * Indicates whether to roll back the resource if a warning occurs while API
     * Gateway is creating the RestApi resource.
     *
     * @default false
     */
    failOnWarnings?: boolean;

    /**
     * A nullable integer that is used to enable compression (with non-negative
     * between 0 and 10485760 (10M) bytes, inclusive) or disable compression
     * (when undefined) on an API. When compression is enabled, compression or
     * decompression is not applied on the payload if the payload size is
     * smaller than this value. Setting it to zero allows compression for any
     * payload size.
     *
     * @default undefined compression is disabled
     */
    minimumCompressionSize?: number;

    /**
     * The ID of the API Gateway RestApi resource that you want to clone.
     */
    cloneFrom?: RestApiRef;
}

export class RestApi extends RestApiRef implements IRestApiResource {
    /**
     * The ID of this API Gateway RestApi.
     */
    public readonly restApiId: RestApiId;

    /**
     * The ID of the root resource of this RestApi. To be used as a parent for
     * all top-level resources.
     */
    public readonly resourceId: ResourceId;

    /**
     * Points to /this/ RestApi.
     */
    public readonly resourceApi: RestApi;

    /**
     * The full path of this resource.
     */
    public readonly resourcePath = '/';

    /**
     * API Gateway deployment that represents the latest changes of the API.
     * This resource will be automatically updated every time the REST API model changes.
     * This will be undefined if `autoDeploy` is false.
     */
    public latestDeployment?: Deployment;

    /**
     * API Gateway stage that points to the latest deployment (if defined).
     *
     * If `autoDeploy` is disabled, you will need to explicitly assign this value in order to
     * set up integrations.
     */
    public deploymentStage?: Stage;

    private readonly methods = new Array<Method>();

    constructor(parent: cdk.Construct, id: string, props: RestApiProps = { }) {
        super(parent, id);

        // if 'body' (open api definition) is defined, it's okay for name to be undefined
        // otherwise, use the construct id as name (there are no restrictions on name, so that should be fine)
        const name = props.body ? props.name : id;

        const bodyProps = this.renderBody(props.body);

        const resource = new cloudformation.RestApiResource(this, 'Resource', {
            restApiName: name,
            description: props.description,
            policy: props.policy,
            failOnWarnings: props.failOnWarnings,
            minimumCompressionSize: props.minimumCompressionSize,
            binaryMediaTypes: props.binaryMediaTypes,
            endpointConfiguration: props.endpointTypes ? { types: props.endpointTypes } : undefined,
            apiKeySourceType: props.apiKeySourceType,
            cloneFrom: props.cloneFrom ? props.cloneFrom.restApiId : undefined,
            parameters: props.parameters,
            body: bodyProps && bodyProps.body,
            bodyS3Location: bodyProps && bodyProps.bodyS3Location,
        });

        this.restApiId = resource.ref;
        this.resourceId = new ResourceId(resource.restApiRootResourceId); // they are the same
        this.resourceApi = this;

        this.configureAutoDeploy(props);

        // TODO - determine which field of RestApi need to be added to the hash
        // of the Deployment resource - which are part of the model?

        this.configureCloudWatchRole(resource);
    }

    public addResource(pathPart: string): Resource {
        return new Resource(this, pathPart, { parent: this, pathPart });
    }

    public onMethod(httpMethod: string): Method {
        return new Method(this, httpMethod, { resource: this, httpMethod });
    }

    public _attachMethod(method: Method) {
        this.methods.push(method);
    }

    public validate() {
        if (this.methods.length === 0) {
            return [ `The REST API doesn't contain any methods` ];
        }

        return [];
    }

    private configureAutoDeploy(props: RestApiProps) {
        const autoDeploy = props.autoDeploy === undefined ? true : props.autoDeploy;
        if (autoDeploy) {
            this.latestDeployment = new Deployment(this, 'LatestDeployment', {
                api: this,
                ...props.autoDeployOptions
            });

            this.deploymentStage = new Stage(this, 'DeploymentStage', {
                deployment: this.latestDeployment,
                ...props.autoDeployStageOptions
            });
        } else {
            if (props.autoDeployStageOptions) {
                throw new Error(`Cannot set 'autoDeployStageOptions' if 'autoDeploy' is disabled`);
            }
            if (props.autoDeployOptions) {
                throw new Error(`Cannot set 'autoDeployOptions' if 'autoDeploy' is disabled`);
            }
        }
    }

    private configureCloudWatchRole(apiResource: cloudformation.RestApiResource) {
        const role = new iam.Role(this, 'CloudWatchRole', {
            assumedBy: new cdk.ServicePrincipal('apigateway.amazonaws.com'),
            managedPolicyArns: [ cdk.Arn.fromComponents({
                service: 'iam',
                region: '',
                account: 'aws',
                resource: 'policy',
                sep: '/',
                resourceName: 'service-role/AmazonAPIGatewayPushToCloudWatchLogs'
            }) ]
        });

        const resource = new cloudformation.AccountResource(this, 'Account', {
            cloudWatchRoleArn: role.roleArn
        });

        resource.addDependency(apiResource);
    }

    private renderBody(body?: RestApiBody): { body?: object, bodyS3Location?: cloudformation.RestApiResource.S3LocationProperty } | undefined {
        if (!body) {
            return undefined;
        }

        return {
            body: { },
            bodyS3Location : { }
        };
    }
}

export enum ApiKeySourceType {
    /**
     * To read the API key from the `X-API-Key` header of a request.
     */
    Header = 'HEADER',

    /**
     * To read the API key from the `UsageIdentifierKey` from a custom authorizer.
     */
    Authorizer = 'AUTHORIZER',
}

export enum EndpointType {
    /**
     * For an edge-optimized API and its custom domain name.
     */
    Edge = 'EDGE',

    /**
     * For a regional API and its custom domain name.
     */
    Regional = 'REGIONAL',

    /**
     * For a private API and its custom domain name.
     */
    Private = 'PRIVATE'
}
