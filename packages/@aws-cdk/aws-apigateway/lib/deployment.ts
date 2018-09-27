import cdk = require('@aws-cdk/cdk');
import crypto = require('crypto');
import { cloudformation } from './apigateway.generated';
import { RestApiRef } from './restapi-ref';

export interface DeploymentProps  {
  /**
   * The Rest API to deploy.
   */
  api: RestApiRef;

  /**
   * A description of the purpose of the API Gateway deployment.
   */
  description?: string;

  /**
   * When an API Gateway model is updated, a new deployment will automatically be created.
   * If this is true (default), the old API Gateway Deployment resource will not be deleted.
   * This will allow manually reverting back to a previous deployment in case for example
   *
   * @default false
   */
  retainDeployments?: boolean;
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
 * model. Use the `addDependency(dep)` method to circumvent that. This is done
 * automatically for the `restApi.latestDeployment` deployment.
 */
export class Deployment extends cdk.Construct implements cdk.IDependable {
  public readonly deploymentId: string;
  public readonly api: RestApiRef;

  /**
   * Allows taking a dependency on this construct.
   */
  public readonly dependencyElements = new Array<cdk.IDependable>();

  private readonly resource: LatestDeploymentResource;

  constructor(parent: cdk.Construct, id: string, props: DeploymentProps) {
    super(parent, id);

    this.resource = new LatestDeploymentResource(this, 'Resource', {
      description: props.description,
      restApiId: props.api.restApiId,
    });

    if (props.retainDeployments) {
      this.resource.options.deletionPolicy = cdk.DeletionPolicy.Retain;
    }

    this.api = props.api;
    this.deploymentId = new cdk.Token(() => this.resource.deploymentId).toString();
    this.dependencyElements.push(this.resource);
  }

  /**
   * Adds a dependency for this deployment. Should be called by all resources and methods
   * so they are provisioned before this Deployment.
   */
  public addDependency(dep: cdk.IDependable) {
    this.resource.addDependency(dep);
  }

  /**
   * Adds a component to the hash that determines this Deployment resource's
   * logical ID.
   *
   * This should be called by constructs of the API Gateway model that want to
   * invalidate the deployment when their settings change. The component will
   * be resolve()ed during synthesis so tokens are welcome.
   */
  public addToLogicalId(data: any) {
    this.resource.addToLogicalId(data);
  }
}

class LatestDeploymentResource extends cloudformation.DeploymentResource {
  private originalLogicalId?: string;
  private lazyLogicalIdRequired: boolean;
  private lazyLogicalId?: string;
  private hashComponents = new Array<any>();

  constructor(parent: cdk.Construct, id: string, props: cloudformation.DeploymentResourceProps) {
    super(parent, id, props);

    // from this point, don't allow accessing logical ID before synthesis
    this.lazyLogicalIdRequired = true;
  }

  /**
   * Returns either the original or the custom logical ID of this resource.
   */
  public get logicalId() {
    if (!this.lazyLogicalIdRequired) {
      return this.originalLogicalId!;
    }

    if (!this.lazyLogicalId) {
      throw new Error('This resource has a lazy logical ID which is calculated just before synthesis. Use a cdk.Token to evaluate');
    }

    return this.lazyLogicalId;
  }

  /**
   * Sets the logical ID of this resource.
   */
  public set logicalId(v: string) {
    this.originalLogicalId = v;
  }

  /**
   * Returns a lazy reference to this resource (evaluated only upon synthesis).
   */
  public get ref() {
    return new cdk.Token(() => ({ Ref: this.lazyLogicalId })).toString();
  }

  /**
   * Does nothing.
   */
  public set ref(_v: string) {
    return;
  }

  /**
   * Allows adding arbitrary data to the hashed logical ID of this deployment.
   * This can be used to couple the deployment to the API Gateway model.
   */
  public addToLogicalId(data: unknown) {
    // if the construct is locked, it means we are already synthesizing and then
    // we can't modify the hash because we might have already calculated it.
    if (this.locked) {
      throw new Error('Cannot modify the logical ID when the construct is locked');
    }

    this.hashComponents.push(data);
  }

  /**
   * Hooks into synthesis to calculate a logical ID that hashes all the components
   * add via `addToLogicalId`.
   */
  public validate() {
    // if hash components were added to the deployment, we use them to calculate
    // a logical ID for the deployment resource.
    if (this.hashComponents.length === 0) {
      this.lazyLogicalId = this.originalLogicalId;
    } else {
      const md5 = crypto.createHash('md5');
      this.hashComponents
        .map(c => cdk.resolve(c))
        .forEach(c => md5.update(JSON.stringify(c)));

      this.lazyLogicalId = this.originalLogicalId + md5.digest("hex");
    }

    return [];
  }
}
