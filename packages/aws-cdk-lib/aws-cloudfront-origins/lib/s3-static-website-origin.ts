import { HttpOrigin, HttpOriginProps } from './http-origin';
import * as cloudfront from '../../aws-cloudfront';
import { IBucket } from '../../aws-s3';

/**
 * Properties for configuring a origin using a S3 bucket configured as a website endpoint
 */
export interface S3StaticWebsiteOriginProps extends HttpOriginProps {
  /**
  * The S3 bucket used as the origin
  */
  readonly bucket: IBucket;
}

/**
 * An Origin for a S3 bucket configured as a website endpoint
 */
export class S3StaticWebsiteOrigin extends HttpOrigin {
  constructor(props: S3StaticWebsiteOriginProps) {
    super(props.bucket.bucketWebsiteDomainName, {
      // S3 only supports HTTP for website buckets. See https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteEndpoints.html
      protocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
      ...props,
    });
  }
}
