import { HttpOrigin, HttpOriginProps } from './http-origin';
import * as cloudfront from '../../aws-cloudfront';
import { IBucket } from '../../aws-s3';

/**
 * Properties for configuring a origin using a S3 bucket configured as a website endpoint
 */
export interface S3StaticWebsiteOriginProps extends HttpOriginProps { }

/**
 * An Origin for a S3 bucket configured as a website endpoint
 */
export class S3StaticWebsiteOrigin extends HttpOrigin {
  constructor(bucket: IBucket, props?: S3StaticWebsiteOriginProps) {
    super(bucket.bucketWebsiteDomainName, {
      // S3 only supports HTTP for website buckets. See https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteEndpoints.html
      protocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
      ...props,
    });
  }
}
