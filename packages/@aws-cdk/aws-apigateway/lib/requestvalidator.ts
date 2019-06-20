import { Construct, Resource } from '@aws-cdk/cdk';
import { CfnRequestValidator, CfnRequestValidatorProps } from './apigateway.generated';
import { IRestApi, RestApi } from './restapi';

export interface IRequestValidatorRef {
  /** @attribute */
  readonly requestValidatorId: string;
}

export interface RequestValidatorOptions {
    /**
     * The name of this request validator.
     */
    readonly name?: string;

    /**
     * Indicates whether to validate the request body according to
     * the configured schema for the targeted API and method.
     */
    readonly validateRequestBody?: boolean;

    /**
     * Indicates whether to validate request parameters.
     */
    readonly validateRequestParameters?: boolean;
}

export interface RequestValidatorProps {
  /**
   * The rest API that this model is part of.
   *
   * The reason we need the RestApi object itself and not just the ID is because the model
   * is being tracked by the top-level RestApi object for the purpose of calculating it's
   * hash to determine the ID of the deployment. This allows us to automatically update
   * the deployment when the model of the REST API changes.
   */
  readonly restApi: IRestApi;

  /**
   * Validator options.
   */
  readonly options: RequestValidatorOptions;
}

export class RequestValidator extends Resource implements IRequestValidatorRef {
  /** @attribute */
  public readonly requestValidatorId: string;

  /** @attribute */
  public readonly restApi: IRestApi;

  constructor(scope: Construct, id: string, props: RequestValidatorProps) {
    super(scope, id);

    this.restApi = props.restApi;

    const options = props.options;

    const validatorProps: CfnRequestValidatorProps = {
      ...options,
      restApiId: this.restApi.restApiId
    };

    const resource = new CfnRequestValidator(this, 'Resource', validatorProps);

    this.requestValidatorId = resource.requestValidatorId;

    const deployment = (this.restApi instanceof RestApi) ? this.restApi.latestDeployment : undefined;
    if (deployment) {
      deployment.node.addDependency(resource);
      deployment.addToLogicalId({ validator: validatorProps });
    }
  }
}