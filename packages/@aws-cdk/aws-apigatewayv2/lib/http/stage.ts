import { Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnStage } from '../apigatewayv2.generated';
import { StageOptions, IStage, StageAttributes } from '../common';
import { IApi } from '../common/api';
import { StageBase } from '../common/base';
import { IHttpApi } from './api';

const DEFAULT_STAGE_NAME = '$default';

/**
 * Represents the HttpStage
 */
export interface IHttpStage extends IStage {
  /**
   * The API this stage is associated to.
   */
  readonly api: IHttpApi;
}

/**
 * The options to create a new Stage for an HTTP API
 */
export interface HttpStageOptions extends StageOptions {
  /**
   * The name of the stage. See `StageName` class for more details.
   * @default '$default' the default stage of the API. This stage will have the URL at the root of the API endpoint.
   */
  readonly stageName?: string;
}

/**
 * Properties to initialize an instance of `HttpStage`.
 */
export interface HttpStageProps extends HttpStageOptions {
  /**
   * The HTTP API to which this stage is associated.
   */
  readonly httpApi: IHttpApi;
}

/**
 * The attributes used to import existing HttpStage
 */
export interface HttpStageAttributes extends StageAttributes {
  /**
   * The API to which this stage is associated
   */
  readonly api: IHttpApi;
}

/**
 * Represents a stage where an instance of the API is deployed.
 * @resource AWS::ApiGatewayV2::Stage
 */
export class HttpStage extends StageBase implements IHttpStage {
  /**
   * Import an existing stage into this CDK app.
   */
  public static fromHttpStageAttributes(scope: Construct, id: string, attrs: HttpStageAttributes): IHttpStage {
    class Import extends StageBase implements IHttpStage {
      protected readonly baseApi = attrs.api;
      public readonly stageName = attrs.stageName;
      public readonly api = attrs.api;

      get url(): string {
        throw new Error('url is not available for imported stages.');
      }
    }
    return new Import(scope, id);
  }

  protected readonly baseApi: IApi;
  public readonly stageName: string;
  public readonly api: IHttpApi;

  constructor(scope: Construct, id: string, props: HttpStageProps) {
    super(scope, id, {
      physicalName: props.stageName ? props.stageName : DEFAULT_STAGE_NAME,
    });

    new CfnStage(this, 'Resource', {
      apiId: props.httpApi.apiId,
      stageName: this.physicalName,
      autoDeploy: props.autoDeploy,
    });

    this.stageName = this.physicalName;
    this.baseApi = props.httpApi;
    this.api = props.httpApi;

    if (props.domainMapping) {
      this._addDomainMapping(props.domainMapping);
    }
  }

  /**
   * The URL to this stage.
   */
  public get url(): string {
    const s = Stack.of(this);
    const urlPath = this.stageName === DEFAULT_STAGE_NAME ? '' : this.stageName;
    return `https://${this.api.apiId}.execute-api.${s.region}.${s.urlSuffix}/${urlPath}`;
  }
}
