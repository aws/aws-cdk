import cdk = require('@aws-cdk/cdk');
import { cloudformation, MethodId } from './apigateway.generated';
import { MethodIntegration } from './integrations';
import { IRestApiResource } from './resource';

const ALLOWED_METHODS = [ 'ANY', 'DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT' ];

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
     * Use `MethodAuthorization.None` or `MethodAuthorization.IAM`
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

export class Method extends cdk.Construct {
    public readonly methodId: MethodId;

    constructor(parent: cdk.Construct, id: string, props: MethodProps) {
        super(parent, id);

        if (!ALLOWED_METHODS.includes(props.httpMethod.toUpperCase())) {
            throw new Error(`Invalid HTTP method "${props.httpMethod}". Allowed methods: ${ALLOWED_METHODS.join(',')}`);
        }

        const auth = props.authorization || MethodAuthorization.None;

        const resource = new cloudformation.MethodResource(this, 'Resource', {
            resourceId: props.resource.resourceId,
            restApiId: props.resource.resourceApi.restApiId,
            httpMethod: props.httpMethod,
            operationName: props.operationName,
            apiKeyRequired: props.apiKeyRequired,
            authorizationType: auth.authorizationType,
            authorizerId: auth.authorizerId,
            integration: {
                type: 'MOCK'
            }
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
                    operationName: props.operationName,
                    apiKeyRequired: props.apiKeyRequired,
                    authorizationType: auth.authorizationType,
                    authorizerId: auth.authorizerId
                }
            });
        }
    }
}

export class MethodAuthorization {
    public static IAM = new MethodAuthorization('AWS_IAM');
    public static None = new MethodAuthorization('NONE');

    constructor(
        public readonly authorizationType: string,
        public readonly authorizerId?: string) { }
}
