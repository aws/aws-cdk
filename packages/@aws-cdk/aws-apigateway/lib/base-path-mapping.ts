import { Construct, Resource, Token } from '@aws-cdk/core';
import { CfnBasePathMapping } from './apigateway.generated';
import { IDomainName } from './domain-name';
import { IRestApi, RestApi } from './restapi';

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
 * In most cases, you will probably want to use
 * `DomainName.addBasePathMapping()` to define mappings.
 */
export class BasePathMapping extends Resource {
  constructor(scope: Construct, id: string, props: BasePathMappingProps) {
    super(scope, id);

    if (props.basePath && !Token.isUnresolved(props.basePath)) {
      if (!props.basePath.match(/^[a-z0-9$_.+!*'()-]+$/)) {
        throw new Error(`A base path may only contain letters, numbers, and one of "$-_.+!*'()", received: ${props.basePath}`);
      }
    }

    // if this is an owned API and it has a deployment stage, map all requests
    // to that stage. otherwise, the stage will have to be specified in the URL.
    const stage = props.restApi instanceof RestApi
      ? props.restApi.deploymentStage
      : undefined;

    new CfnBasePathMapping(this, 'Resource', {
      basePath: props.basePath,
      domainName: props.domainName.domainName,
      restApiId: props.restApi.restApiId,
      stage: stage && stage.stageName,
    });
  }
}
