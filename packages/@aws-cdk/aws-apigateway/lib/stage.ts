import cdk = require('@aws-cdk/cdk');
import { cloudformation, StageName } from './apigateway.generated';
import { Deployment } from './deployment';

export interface CommonStageProps {
    /**
     * The name of the stage, which API Gateway uses as the first path segment
     * in the invoked Uniform Resource Identifier (URI).
     *
     * @default "prod"
     */
    stageName?: string;

    /**
     * Indicates whether cache clustering is enabled for the stage.
     */
    cacheClusterEnabled?: boolean;

    /**
     * The stage's cache cluster size.
     */
    cacheClusterSize?: string;

    /**
     * The identifier of the client certificate that API Gateway uses to call
     * your integration endpoints in the stage.
     *
     * @default None
     */
    clientCertificateId?: string;

    /**
     * A description of the purpose of the stage.
     */
    description?: string;

    /**
     * The version identifier of the API documentation snapshot.
     */
    documentationVersion?: string;

    /**
     * A map that defines the stage variables. Variable names must consist of
     * alphanumeric characters, and the values must match the following regular
     * expression: [A-Za-z0-9-._~:/?#&amp;=,]+.
     */
    variables?: { [key: string]: string };

    // TODO:
    // - MethodSettings
}

export interface StageProps extends CommonStageProps {
    /**
     * The deployment that this stage points to.
     */
    deployment: Deployment;
}

export class Stage extends cdk.Construct {
    public readonly stageName: StageName;

    constructor(parent: cdk.Construct, id: string, props: StageProps) {
        super(parent, id);

        const resource = new cloudformation.StageResource(this, 'Resource', {
            stageName: props.stageName || 'prod',
            cacheClusterEnabled: props.cacheClusterEnabled,
            cacheClusterSize: props.cacheClusterSize,
            clientCertificateId: props.clientCertificateId,
            deploymentId: props.deployment.deploymentId,
            restApiId: props.deployment.api.restApiId,
            description: props.description,
            documentationVersion: props.documentationVersion,
            variables: props.variables,
        });

        this.stageName = resource.ref;
    }
}