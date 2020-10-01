import { IResource, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnRequestValidator, CfnRequestValidatorProps } from './apigateway.generated';
import { IRestApi, RestApi } from './restapi';

export interface IRequestValidator extends IResource {
  /**
   * ID of the request validator, such as abc123
   *
   * @attribute
   */
  readonly requestValidatorId: string;
}

export interface RequestValidatorOptions {
  /**
   * The name of this request validator.
   *
   * @default None
   */
  readonly requestValidatorName?: string;

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

export interface RequestValidatorProps extends RequestValidatorOptions {
  /**
   * The rest API that this model is part of.
   *
   * The reason we need the RestApi object itself and not just the ID is because the model
   * is being tracked by the top-level RestApi object for the purpose of calculating it's
   * hash to determine the ID of the deployment. This allows us to automatically update
   * the deployment when the model of the REST API changes.
   */
  readonly restApi: IRestApi;
}

export class RequestValidator extends Resource implements IRequestValidator {
  public static fromRequestValidatorId(scope: Construct, id: string, requestValidatorId: string): IRequestValidator {
    class Import extends Resource implements IRequestValidator {
      public readonly requestValidatorId = requestValidatorId;
    }

    return new Import(scope, id);
  }

  /**
   * ID of the request validator, such as abc123
   *
   * @attribute
   */
  public readonly requestValidatorId: string;

  constructor(scope: Construct, id: string, props: RequestValidatorProps) {
    super(scope, id, {
      physicalName: props.requestValidatorName,
    });

    const validatorProps: CfnRequestValidatorProps = {
      name: this.physicalName,
      restApiId: props.restApi.restApiId,
      validateRequestBody: props.validateRequestBody,
      validateRequestParameters: props.validateRequestParameters,
    };

    const resource = new CfnRequestValidator(this, 'Resource', validatorProps);

    this.requestValidatorId = resource.ref;

    const deployment = (props.restApi instanceof RestApi) ? props.restApi.latestDeployment : undefined;
    if (deployment) {
      deployment.node.addDependency(resource);
      deployment.addToLogicalId({ validator: validatorProps });
    }
  }
}