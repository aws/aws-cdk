import { Construct, IResource, Resource, Stack } from '@aws-cdk/core';
import { IHttpApi } from './api';
import { CfnStage } from './apigatewayv2.generated';

export interface IStage extends IResource {
  readonly stageName: string;
}

export class StageName {
  public static readonly DEFAULT = new StageName('$default');

  public static of(stageName: string) {
    return new StageName(stageName);
  }

  private constructor(public readonly stageName: string) {
  }
}

export interface StageOptions {
  readonly stageName?: StageName;
  readonly autoDeploy?: boolean;
}

export interface StageProps extends StageOptions {
  readonly httpApi: IHttpApi;
}

export class Stage extends Resource implements IStage {
  public static fromStageName(scope: Construct, id: string, stageName: string): IStage {
    class Import extends Resource implements IStage {
      public readonly stageName = stageName;
    }
    return new Import(scope, id);
  }

  public readonly stageName: string;
  private httpApi: IHttpApi;

  constructor(scope: Construct, id: string, props: StageProps) {
    super(scope, id, {
      physicalName: props.stageName ? props.stageName.stageName : StageName.DEFAULT.stageName,
    });

    const resource = new CfnStage(this, 'Resource', {
      apiId: props.httpApi.httpApiId,
      stageName: this.physicalName,
      autoDeploy: props.autoDeploy ?? true,
    });

    this.stageName = resource.ref;
    this.httpApi = props.httpApi;
  }

  /**
   * The URL to this stage.
   */
  public get url() {
    const s = Stack.of(this);
    const urlPath = this.stageName === StageName.DEFAULT.stageName ? '' : this.stageName;
    return `https://${this.httpApi.httpApiId}.execute-api.${s.region}.${s.urlSuffix}/${urlPath}`;
  }
}