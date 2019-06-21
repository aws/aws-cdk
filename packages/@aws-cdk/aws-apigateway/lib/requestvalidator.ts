import { Construct, PhysicalName, Resource } from '@aws-cdk/cdk';
import { CfnRequestValidator, CfnRequestValidatorProps } from './apigateway.generated';
import { IRestApi, RestApi } from './restapi';

export interface IRequestValidatorRef {
  /** @attribute */
  readonly requestValidatorId: string;
}

export interface RequestValidatorProps {
  /**
   * The rest API that this model is part of.
   *
   * The reason we need the RestApi object itself and not just the ID is because the model
   * is being tracked by the top-level RestApi object for the purpose of calculating it's
   * hash to determine the ID of the deployment. This allows us to automatically update
   * the deployment when the model of the REST API changes.
   *
   * @default None: This is automatically populated by the api.addRequestValidator method
   */
  readonly restApi?: IRestApi;

  /**
   * The name of this request validator.
   *
   * @default None
   */
  readonly requestValidatorName?: PhysicalName;

  /**
   * Indicates whether to validate the request body according to
   * the configured schema for the targeted API and method.
   *
   * @default false
   */
  readonly validateRequestBody?: boolean;

  /**
   * Indicates whether to validate request parameters.
   *
   * @default false
   */
  readonly validateRequestParameters?: boolean;
}

export class RequestValidator extends Resource implements IRequestValidatorRef {
  /** @attribute */
  public readonly requestValidatorId: string;

  /** @attribute */
  public readonly restApi: IRestApi;

  constructor(scope: Construct, id: string, props?: RequestValidatorProps) {
    if (props === undefined) {
      props = {};
    }

    super(scope, id, {
      physicalName: props.requestValidatorName || PhysicalName.of(id),
    });

    if (props.restApi === undefined) {
      throw Error("You must define a parent rest Api");
    } else {
      this.restApi = props.restApi;
    }

    const validatorProps: CfnRequestValidatorProps = {
      name: this.physicalName,
      restApiId: this.restApi.restApiId,
      validateRequestBody: props.validateRequestBody,
      validateRequestParameters: props.validateRequestParameters
    };

    const resource = new CfnRequestValidator(this, 'Resource', validatorProps);

    this.requestValidatorId = resource.ref;

    const deployment = (this.restApi instanceof RestApi) ? this.restApi.latestDeployment : undefined;
    if (deployment) {
      deployment.node.addDependency(resource);
      deployment.addToLogicalId({ validator: validatorProps });
    }
  }
}