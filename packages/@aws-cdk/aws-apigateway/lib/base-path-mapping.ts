import { Resource, Token } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnBasePathMapping } from './apigateway.generated';
import { IDomainName } from './domain-name';
import { IRestApi, RestApiBase } from './restapi';
import { Stage } from './stage';

export interface BasePathMappingOptions {
  /**
   * The base path name that callers of the API must provide in the URL after
   * the domain name (e.g. `example.com/base-path`). If you specify this
   * property, it can't be an empty string.
   *
   * @default - map requests from the domain root (e.g. `example.com`). If this
   * is undefined, no additional mappings will be allowed on this domain name.
   */
  readonly basePath?: string;

  /**
   * The Deployment stage of API
   * [disable-awslint:ref-via-interface]
   * @default - map to deploymentStage of restApi otherwise stage needs to pass in URL
   */
  readonly stage?: Stage;
}

export interface BasePathMappingProps extends BasePathMappingOptions {
  /**
   * The DomainName to associate with this base path mapping.
   */
  readonly domainName: IDomainName;

  /**
   * The RestApi resource to target.
   */
  readonly restApi: IRestApi;
}

/**
 * This resource creates a base path that clients who call your API must use in
 * the invocation URL.
 *
 * Unless you're importing a domain with `DomainName.fromDomainNameAttributes()`,
 * you can use `DomainName.addBasePathMapping()` to define mappings.
 */
export class BasePathMapping extends Resource {
  constructor(scope: Construct, id: string, props: BasePathMappingProps) {
    super(scope, id);

    if (props.basePath && !Token.isUnresolved(props.basePath)) {
      if (!props.basePath.match(/^[a-zA-Z0-9$_.+!*'()-]+$/)) {
        throw new Error(`A base path may only contain letters, numbers, and one of "$-_.+!*'()", received: ${props.basePath}`);
      }
    }

    // if restApi is an owned API and it has a deployment stage, map all requests
    // to that stage. otherwise, the stage will have to be specified in the URL.
    const stage = props.stage ?? (props.restApi instanceof RestApiBase
      ? props.restApi.deploymentStage
      : undefined);

    new CfnBasePathMapping(this, 'Resource', {
      basePath: props.basePath,
      domainName: props.domainName.domainName,
      restApiId: props.restApi.restApiId,
      stage: stage && stage.stageName,
    });
  }
}
