import * as iam from '@aws-cdk/aws-iam';
import { CfnOutput, Construct, Resource, Stack } from '@aws-cdk/core';
import { CfnAccount, CfnRestApi } from '../apigateway.generated';
import { Deployment } from '../deployment';
import { DomainName, DomainNameOptions } from '../domain-name';
import { GatewayResponse, GatewayResponseOptions } from '../gateway-response';
import { Method } from '../method';
import { IResource } from '../resource';
import { IRestApi, RestApiOptions } from '../restapi';
import { Stage } from '../stage';
import { UsagePlan, UsagePlanProps } from '../usage-plan';

const RESTAPI_SYMBOL = Symbol.for('@aws-cdk/aws-apigateway.RestApiBase');

/**
 * @internal
 */
export abstract class RestApiBase extends Resource implements IRestApi {

  /**
   * API Gateway deployment that represents the latest changes of the API.
   * This resource will be automatically updated every time the REST API model changes.
   * This will be undefined if `deploy` is false.
   */
  public get latestDeployment() {
    return this._latestDeployment;
  }

  /**
   * The first domain name mapped to this API, if defined through the `domainName`
   * configuration prop, or added via `addDomainName`
   */
  public get domainName() {
    return this._domainName;
  }

  /**
   * Checks if the given object is an instance of RestApiBase.
   */
  public static isRestApiBase(x: any): x is IRestApi {
    return x !== null && typeof(x) === 'object' && RESTAPI_SYMBOL in x;
  }
  /**
   * The ID of this API Gateway RestApi.
   */
  public abstract readonly restApiId: string;

  /**
   * The resource ID of the root resource.
   *
   * @attribute
   */
  public abstract readonly restApiRootResourceId: string;

  /**
   * Represents the root resource of this API endpoint ('/').
   * Resources and Methods are added to this resource.
   */
  public abstract readonly root: IResource;

  /**
   * API Gateway stage that points to the latest deployment (if defined).
   *
   * If `deploy` is disabled, you will need to explicitly assign this value in order to
   * set up integrations.
   */
  public deploymentStage!: Stage;

  private _latestDeployment?: Deployment;
  private _domainName?: DomainName;

  constructor(scope: Construct, id: string, props: RestApiOptions = { }) {
    super(scope, id, {
      physicalName: props.restApiName || id,
    });

    Object.defineProperty(this, RESTAPI_SYMBOL, { value: true });
  }

  /**
   * Returns the URL for an HTTP path.
   *
   * Fails if `deploymentStage` is not set either by `deploy` or explicitly.
   */
  public urlForPath(path: string = '/'): string {
    if (!this.deploymentStage) {
      throw new Error('Cannot determine deployment stage for API from "deploymentStage". Use "deploy" or explicitly set "deploymentStage"');
    }

    return this.deploymentStage.urlForPath(path);
  }

  /**
   * Defines an API Gateway domain name and maps it to this API.
   * @param id The construct id
   * @param options custom domain options
   */
  public addDomainName(id: string, options: DomainNameOptions): DomainName {
    const domainName = new DomainName(this, id, {
      ...options,
      mapping: this,
    });
    if (!this._domainName) {
      this._domainName = domainName;
    }
    return domainName;
  }

  /**
   * Adds a usage plan.
   */
  public addUsagePlan(id: string, props: UsagePlanProps = {}): UsagePlan {
    return new UsagePlan(this, id, props);
  }

  /**
   * Gets the "execute-api" ARN
   * @returns The "execute-api" ARN.
   * @default "*" returns the execute API ARN for all methods/resources in
   * this API.
   * @param method The method (default `*`)
   * @param path The resource path. Must start with '/' (default `*`)
   * @param stage The stage (default `*`)
   */
  public arnForExecuteApi(method: string = '*', path: string = '/*', stage: string = '*') {
    if (!path.startsWith('/')) {
      throw new Error(`"path" must begin with a "/": '${path}'`);
    }

    if (method.toUpperCase() === 'ANY') {
      method = '*';
    }

    return Stack.of(this).formatArn({
      service: 'execute-api',
      resource: this.restApiId,
      sep: '/',
      resourceName: `${stage}/${method}${path}`,
    });
  }

  /**
   * Adds a new gateway response.
   */
  public addGatewayResponse(id: string, options: GatewayResponseOptions): GatewayResponse {
    return new GatewayResponse(this, id, {
      restApi: this,
      ...options,
    });
  }

  /**
   * Internal API used by `Method` to keep an inventory of methods at the API
   * level for validation purposes.
   *
   * @internal
   */
  public _attachMethod(method: Method) {
    ignore(method);
  }

  protected configureCloudWatchRole(apiResource: CfnRestApi) {
    const role = new iam.Role(this, 'CloudWatchRole', {
      assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
      managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonAPIGatewayPushToCloudWatchLogs')],
    });

    const resource = new CfnAccount(this, 'Account', {
      cloudWatchRoleArn: role.roleArn,
    });

    resource.node.addDependency(apiResource);
  }

  protected configureDeployment(props: RestApiOptions) {
    const deploy = props.deploy === undefined ? true : props.deploy;
    if (deploy) {

      this._latestDeployment = new Deployment(this, 'Deployment', {
        description: 'Automatically created by the RestApi construct',
        api: this,
        retainDeployments: props.retainDeployments,
      });

      // encode the stage name into the construct id, so if we change the stage name, it will recreate a new stage.
      // stage name is part of the endpoint, so that makes sense.
      const stageName = (props.deployOptions && props.deployOptions.stageName) || 'prod';

      this.deploymentStage = new Stage(this, `DeploymentStage.${stageName}`, {
        deployment: this._latestDeployment,
        ...props.deployOptions,
      });

      new CfnOutput(this, 'Endpoint', { exportName: props.endpointExportName, value: this.urlForPath() });
    } else {
      if (props.deployOptions) {
        throw new Error('Cannot set \'deployOptions\' if \'deploy\' is disabled');
      }
    }
  }
}

function ignore(_x: any) {
  return;
}