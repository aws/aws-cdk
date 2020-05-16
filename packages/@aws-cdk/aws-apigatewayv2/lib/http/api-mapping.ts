// import { ICertificate } from '@aws-cdk/aws-certificatemanager';
import { Construct, IResource, Resource } from '@aws-cdk/core';
import { CfnApiMapping, CfnApiMappingProps } from '../apigatewayv2.generated';
import { IStage } from '../common';
import { IHttpApi } from './api';
import { DomainName } from './domain-name';

export interface IHttpApiMapping extends IResource {
  readonly httpApiMappingId: string;
}

export interface HttpApiMappingProps {
  readonly api: IHttpApi;
  readonly domainName: DomainName;
  readonly stage: IStage;
}

export class HttpApiMapping extends Resource implements IHttpApiMapping {
  public static fromApiId(scope: Construct, id: string, httpApiMappingId: string): IHttpApiMapping {
    class Import extends Resource implements IHttpApiMapping {
      public readonly httpApiMappingId = httpApiMappingId;
    }
    return new Import(scope, id);
  }

  public readonly httpApiMappingId: string;

  constructor(scope: Construct, id: string, props: HttpApiMappingProps) {
    super(scope, id);

    const apiMappingProps: CfnApiMappingProps = {
      apiId: props.api.httpApiId,
      domainName: props.domainName.domainName,
      stage: props.stage.stageName,
    };

    const resource = new CfnApiMapping(this, 'Resource', apiMappingProps);
    this.httpApiMappingId = resource.ref;
  }

}