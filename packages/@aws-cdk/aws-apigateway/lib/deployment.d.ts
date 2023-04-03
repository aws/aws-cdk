import { Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { Method } from './method';
import { IRestApi } from './restapi';
export interface DeploymentProps {
    /**
     * The Rest API to deploy.
     */
    readonly api: IRestApi;
    /**
     * A description of the purpose of the API Gateway deployment.
     *
     * @default - No description.
     */
    readonly description?: string;
    /**
     * When an API Gateway model is updated, a new deployment will automatically be created.
     * If this is true, the old API Gateway Deployment resource will not be deleted.
     * This will allow manually reverting back to a previous deployment in case for example
     *
     * @default false
     */
    readonly retainDeployments?: boolean;
}
/**
 * A Deployment of a REST API.
 *
 * An immutable representation of a RestApi resource that can be called by users
 * using Stages. A deployment must be associated with a Stage for it to be
 * callable over the Internet.
 *
 * Normally, you don't need to define deployments manually. The RestApi
 * construct manages a Deployment resource that represents the latest model. It
 * can be accessed through `restApi.latestDeployment` (unless `deploy: false` is
 * set when defining the `RestApi`).
 *
 * If you manually define this resource, you will need to know that since
 * deployments are immutable, as long as the resource's logical ID doesn't
 * change, the deployment will represent the snapshot in time in which the
 * resource was created. This means that if you modify the RestApi model (i.e.
 * add methods or resources), these changes will not be reflected unless a new
 * deployment resource is created.
 *
 * To achieve this behavior, the method `addToLogicalId(data)` can be used to
 * augment the logical ID generated for the deployment resource such that it
 * will include arbitrary data. This is done automatically for the
 * `restApi.latestDeployment` deployment.
 *
 * Furthermore, since a deployment does not reference any of the REST API
 * resources and methods, CloudFormation will likely provision it before these
 * resources are created, which means that it will represent a "half-baked"
 * model. Use the `node.addDependency(dep)` method to circumvent that. This is done
 * automatically for the `restApi.latestDeployment` deployment.
 */
export declare class Deployment extends Resource {
    /** @attribute */
    readonly deploymentId: string;
    readonly api: IRestApi;
    private readonly resource;
    constructor(scope: Construct, id: string, props: DeploymentProps);
    /**
     * Adds a component to the hash that determines this Deployment resource's
     * logical ID.
     *
     * This should be called by constructs of the API Gateway model that want to
     * invalidate the deployment when their settings change. The component will
     * be resolve()ed during synthesis so tokens are welcome.
     */
    addToLogicalId(data: any): void;
    /**
     * Quoting from CloudFormation's docs:
     *
     *   If you create an AWS::ApiGateway::RestApi resource and its methods (using
     *   AWS::ApiGateway::Method) in the same template as your deployment, the
     *   deployment must depend on the RestApi's methods. To create a dependency,
     *   add a DependsOn attribute to the deployment. If you don't, AWS
     *   CloudFormation creates the deployment right after it creates the RestApi
     *   resource that doesn't contain any methods, and AWS CloudFormation
     *   encounters the following error: The REST API doesn't contain any methods.
     *
     * @param method The method to add as a dependency of the deployment
     * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-deployment.html
     * @see https://github.com/aws/aws-cdk/pull/6165
     * @internal
     */
    _addMethodDependency(method: Method): void;
}
