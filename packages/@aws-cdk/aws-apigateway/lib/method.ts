import cdk = require('@aws-cdk/cdk');
import { cloudformation, MethodId } from './apigateway.generated';
import { MethodIntegration, MockMethodIntegration } from './integrations';
import { IRestApiResource } from './resource';
import { RestApi } from './restapi';
import { validateHttpMethod } from './util';

export interface MethodOptions {

    /**
     * The backend system that the method calls when it receives a request.
     */
    integration?: MethodIntegration;

    /**
     * A friendly operation name for the method. For example, you can assign the
     * OperationName of ListPets for the GET /pets method.
     */
    operationName?: string;

    /**
     * Method authorization.
     * @default None
     */
    authorization?: MethodAuthorization;

    /**
     * Indicates whether the method requires clients to submit a valid API key.
     * @default false
     */
    apiKeyRequired?: boolean;

    // TODO:
    // - Authorization (AuthorizationType, AuthorizerId)
    // - RequestValidatorId
    // - RequestModels
    // - RequestParameters
    // - MethodResponses
}

export interface MethodProps {
    /**
     * The resource this method is associated with. For root resource methods,
     * specify the `RestApi` object.
     */
    resource: IRestApiResource;

    /**
     * The HTTP method ("GET", "POST", "PUT", ...) that clients use to call this method.
     */
    httpMethod: string;

    /**
     * Method options.
     */
    options?: MethodOptions;
}

export class Method extends cdk.Construct {
    public readonly methodId: MethodId;

    private readonly resource: IRestApiResource;
    private readonly restApi: RestApi;
    private readonly httpMethod: string;

    constructor(parent: cdk.Construct, id: string, props: MethodProps) {
        super(parent, id);

        this.resource = props.resource;
        this.restApi = props.resource.resourceApi;
        this.httpMethod = props.httpMethod;

        validateHttpMethod(this.httpMethod);

        const options = props.options || { };
        const auth = options.authorization || MethodAuthorization.None;

        const resource = new cloudformation.MethodResource(this, 'Resource', {
            resourceId: props.resource.resourceId,
            restApiId: this.restApi.restApiId,
            httpMethod: props.httpMethod,
            operationName: options.operationName,
            apiKeyRequired: options.apiKeyRequired,
            authorizationType: auth.authorizationType,
            authorizerId: auth.authorizerId,
            integration: this.renderIntegration(options.integration),
        });

        this.methodId = resource.ref;

        props.resource.resourceApi._attachMethod(this);

        const deployment = props.resource.resourceApi.latestDeployment;
        if (deployment) {
            deployment.addDependency(resource);
            deployment.addToLogicalId({
                method: {
                    resourceId: props.resource.resourceId,
                    httpMethod: props.httpMethod,
                    operationName: options.operationName,
                    apiKeyRequired: options.apiKeyRequired,
                    authorizationType: auth.authorizationType,
                    authorizerId: auth.authorizerId
                }
            });
        }
    }

    /**
     * Returns an execute-api ARN for this method:
     *
     *     arn:aws:execute-api:{region}:{account}:{restApiId}/{stage}/{method}/{path}
     *
     * NOTE: {stage} will refer to the `restApi.deploymentStage`, which will
     * automatically set if auto-deploy is enabled.
     */
    public get methodArn(): cdk.Arn {
        if (!this.restApi.deploymentStage) {
            throw new Error('There is no stage associated with this restApi. Either use `autoDeploy` or explicitly assign `deploymentStage`');
        }

        return this.methodArnForStage(this.restApi.deploymentStage.stageName.toString());
    }

    /**
     * Returns an execute-api ARN for this method's "test-invoke-stage" stage.
     * This stage is used by the AWS Console UI when testing the method.
     */
    public get testMethodArn(): cdk.Arn {
        return this.methodArnForStage('test-invoke-stage');
    }

    private methodArnForStage(stage: string) {
        return cdk.Arn.fromComponents({
            service: 'execute-api',
            resource: this.restApi.restApiId,
            sep: '/',
            resourceName: `${stage}/${this.httpMethod}${this.resource.resourcePath}`
        });
    }

    private renderIntegration(integration?: MethodIntegration): cloudformation.MethodResource.IntegrationProperty {
        if (!integration) {
            return this.renderIntegration(new MockMethodIntegration());
        }

        integration.attachToMethod(this);

        const options = integration.props.options || { };

        let credentials;
        if (options.credentialsPassthrough && options.credentialsRole) {
            throw new Error(`'credentialsPassthrough' and 'credentialsRole' are mutually exclusive`);
        }

        if (options.credentialsRole) {
            credentials = options.credentialsRole.roleArn;
        } else if (options.credentialsPassthrough) {
            // arn:aws:iam::*:user/*
            credentials = cdk.Arn.fromComponents({ service: 'iam', region: '', account: '*', resource: 'user', sep: '/', resourceName: '*' });
        }

        return {
            type: integration.props.type,
            uri: integration.props.uri,
            cacheKeyParameters: options.cacheKeyParameters,
            cacheNamespace: options.cacheNamespace,
            contentHandling: options.contentHandling,
            integrationHttpMethod: integration.props.integrationHttpMethod,
            requestParameters: options.requestParameters,
            requestTemplates: options.requestTemplates,
            passthroughBehavior: options.passthroughBehavior,
            credentials,
        };
    }
}

export class MethodAuthorization {
    public static IAM = new MethodAuthorization('AWS_IAM');
    public static None = new MethodAuthorization('NONE');

    constructor(
        public readonly authorizationType: string,
        public readonly authorizerId?: string) { }
}
