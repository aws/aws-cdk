import { Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnStage } from '../apigatewayv2.generated';
import { CommonStageOptions, StageBase } from '../common';
import { IApi } from '../common/api';
import { IHttpApi } from './api';


const DEFAULT_STAGE_NAME = '$default';

/**
 * The options to create a new Stage for an HTTP API
 */
export interface HttpStageOptions extends CommonStageOptions {
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
 * Represents a stage where an instance of the API is deployed.
 * @resource AWS::ApiGatewayV2::Stage
 */
export class HttpStage extends StageBase {
  public readonly stageName: string;
  protected readonly api: IApi;

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
