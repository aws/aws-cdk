import { HttpOrigin } from './http-origin';
import type { HttpOriginProps } from './http-origin';

/**
 * Properties for an origin backed by an S3 Multi-Region Access Point.
 */
export interface S3MrapOriginProps extends HttpOriginProps { }

/**
 * An origin for an S3 Multi-Region Access Point.
 *
 * To restrict access with an origin access control, use an S3 origin access control
 * with SigV4A signing and grant access in the Multi-Region Access Point and bucket policies.
 */
export class S3MrapOrigin extends HttpOrigin {
  /**
   * @param multiRegionAccessPointAlias The Multi-Region Access Point alias, including the `.mrap` suffix.
   * @param props Options for the origin.
   */
  constructor(multiRegionAccessPointAlias: string, props: S3MrapOriginProps = {}) {
    super(`${multiRegionAccessPointAlias}.accesspoint.s3-global.amazonaws.com`, props);
  }
}
