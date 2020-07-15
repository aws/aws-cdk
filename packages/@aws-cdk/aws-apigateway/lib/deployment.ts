import { CfnResource, Construct, Lazy, RemovalPolicy, Resource, Stack } from '@aws-cdk/core';
import * as crypto from 'crypto';
import { CfnDeployment } from './apigateway.generated';
import { IRestApi, RestApi, SpecRestApi } from './restapi';

export interface DeploymentProps  {
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
export class Deployment extends Resource {
  /** @attribute */
  public readonly deploymentId: string;
  public readonly api: IRestApi;

  private readonly resource: LatestDeploymentResource;

  constructor(scope: Construct, id: string, props: DeploymentProps) {
    super(scope, id);

    this.resource = new LatestDeploymentResource(this, 'Resource', {
      description: props.description,
      restApi: props.api,
    });

    if (props.retainDeployments) {
      this.resource.applyRemovalPolicy(RemovalPolicy.RETAIN);
    }

    this.api = props.api;
    this.deploymentId = Lazy.stringValue({ produce: () => this.resource.ref });
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

  /**
   * Hook into synthesis before it occurs and make any final adjustments.
   */
  protected prepare() {
    if (this.api instanceof RestApi) {
      // Ignore IRestApi that are imported

      /*
       * https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-deployment.html
       * Quoting from CloudFormation's docs - "If you create an AWS::ApiGateway::RestApi resource and its methods (using AWS::ApiGateway::Method) in
       * the same template as your deployment, the deployment must depend on the RestApi's methods. To create a dependency, add a DependsOn attribute
       * to the deployment. If you don't, AWS CloudFormation creates the deployment right after it creates the RestApi resource that doesn't contain
       * any methods, and AWS CloudFormation encounters the following error: The REST API doesn't contain any methods."
       */

      /*
       * Adding a dependency between LatestDeployment and Method construct, using ConstructNode.addDependencies(), creates additional dependencies
       * between AWS::ApiGateway::Deployment and the AWS::Lambda::Permission nodes (children under Method), causing cyclic dependency errors. Hence,
       * falling back to declaring dependencies between the underlying CfnResources.
       */
      this.api.methods.map(m => m.node.defaultChild as CfnResource).forEach(m => this.resource.addDependsOn(m));
    }
  }
}

interface LatestDeploymentResourceProps {
  readonly description?: string;
  readonly restApi: IRestApi;
}

class LatestDeploymentResource extends CfnDeployment {
  private hashComponents = new Array<any>();
  private originalLogicalId: string;
  private api: IRestApi;

  constructor(scope: Construct, id: string, props: LatestDeploymentResourceProps) {
    super(scope, id, {
      description: props.description,
      restApiId: props.restApi.restApiId,
    });

    this.api = props.restApi;
    this.originalLogicalId = Stack.of(this).getLogicalId(this);
  }

  /**
   * Allows adding arbitrary data to the hashed logical ID of this deployment.
   * This can be used to couple the deployment to the API Gateway model.
   */
  public addToLogicalId(data: unknown) {
    // if the construct is locked, it means we are already synthesizing and then
    // we can't modify the hash because we might have already calculated it.
    if (this.node.locked) {
      throw new Error('Cannot modify the logical ID when the construct is locked');
    }

    this.hashComponents.push(data);
  }

  /**
   * Hooks into synthesis to calculate a logical ID that hashes all the components
   * add via `addToLogicalId`.
   */
  protected prepare() {
    if (this.api instanceof RestApi || this.api instanceof SpecRestApi) { // Ignore IRestApi that are imported

      // Add CfnRestApi to the logical id so a new deployment is triggered when any of its properties change.
      const cfnRestApiCF = (this.api.node.defaultChild as any)._toCloudFormation();
      this.addToLogicalId(Stack.of(this).resolve(cfnRestApiCF));
    }

    const stack = Stack.of(this);

    // if hash components were added to the deployment, we use them to calculate
    // a logical ID for the deployment resource.
    if (this.hashComponents.length > 0) {
      const md5 = crypto.createHash('md5');
      this.hashComponents.map(x => stack.resolve(x)).forEach(c => md5.update(JSON.stringify(c)));
      this.overrideLogicalId(this.originalLogicalId + md5.digest('hex'));
    }
    super.prepare();
  }
}
