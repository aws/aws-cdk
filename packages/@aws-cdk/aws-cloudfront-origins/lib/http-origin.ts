import * as cloudfront from '@aws-cdk/aws-cloudfront';

/**
 * Properties for an Origin backed by any HTTP server.
 *
 * @experimental
 */
export interface HttpOriginProps extends cloudfront.HttpOriginOptions { }

/**
 * An Origin for an HTTP server.
 *
 * @experimental
 */
export class HttpOrigin extends cloudfront.HttpOrigin {

  constructor(domainName: string, props: HttpOriginProps = {}) {
    super({
      domainName,
      ...props,
    });
  }

}
