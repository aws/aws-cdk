import { CfnResource, Construct, IResource, Lazy, Resource } from '@aws-cdk/core';

import { IApi } from './api';
import { CfnDeployment } from './apigatewayv2.generated';

/**
 * Defines the contract for an Api Gateway V2 Deployment.
 */
export interface IDeployment extends IResource {
  /**
   * The ID of this API Gateway Deployment.
   * @attribute
   */
  readonly deploymentId: string;
}

/**
 * Defines the properties required for defining an Api Gateway V2 Deployment.
 */
export interface DeploymentProps {
  /**
   * Defines the api for this deployment.
   */
  readonly api: IApi;

  /**
   * A description for this Deployment.
   *
   * @default - No description.
   */
  readonly description?: string;

  /**
   * The stage name. Stage names can only contain alphanumeric characters, hyphens, and underscores. Maximum length is 128 characters.
   *
   * @default - All stages.
   */
  readonly stageName?: string;
}

/**
 * A Deployment of an API.
 *
 * An immutable representation of an Api resource that can be called by users
 * using Stages. A deployment must be associated with a Stage for it to be
 * callable over the Internet.
 *
 * Normally, you don't need to define deployments manually. The Api
 * construct manages a Deployment resource that represents the latest model. It
 * can be accessed through `api.latestDeployment` (unless `deploy: false` is
 * set when defining the `Api`).
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
 * `api.latestDeployment` deployment.
 *
 * Furthermore, since a deployment does not reference any of the API
 * resources and methods, CloudFormation will likely provision it before these
 * resources are created, which means that it will represent a "half-baked"
 * model. Use the `registerDependency(dep)` method to circumvent that. This is done
 * automatically for the `api.latestDeployment` deployment.
 */
export class Deployment extends Resource implements IDeployment {
  /**
   * Creates a new imported API Deployment
   *
   * @param scope scope of this imported resource
   * @param id identifier of the resource
   * @param deploymentId Identifier of the Deployment
   */
  public static fromDeploymentId(scope: Construct, id: string, deploymentId: string): IDeployment {
    class Import extends Resource implements IDeployment {
      public readonly deploymentId = deploymentId;
    }

    return new Import(scope, id);
  }

  /**
   * The ID of this API Gateway Deployment.
   */
  public readonly deploymentId: string;

  protected resource: CfnDeployment;

  constructor(scope: Construct, id: string, props: DeploymentProps) {
    super(scope, id);

    this.resource = new CfnDeployment(this, 'Resource', {
      apiId: props.api.apiId,
      description: props.description,
      stageName: props.stageName,
    });

    this.deploymentId = Lazy.stringValue({ produce: () => this.resource.ref });
  }

  /**
   * Adds a dependency to the Deployment node, avoiding partial deployments.
   *
   * This is done automatically for the `api.latestDeployment` deployment.
   *
   * @param dependency The construct to add in the dependency tree
   */
  public registerDependency(dependency: CfnResource) {
    this.resource.addDependsOn(dependency);
  }
}