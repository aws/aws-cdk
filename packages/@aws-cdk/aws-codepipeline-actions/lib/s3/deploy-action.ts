import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as s3 from '@aws-cdk/aws-s3';
import { Duration } from '@aws-cdk/core';
import { kebab as toKebabCase } from 'case';
import { Construct } from 'constructs';
import { Action } from '../action';
import { deployArtifactBounds } from '../common';

// Class copied verbatim from the aws-s3-deployment module.
// Yes, it sucks that we didn't abstract this properly in a common class,
// but having 2 different CacheControl classes that behave differently would be worse I think.
// Something to do when CDK 2.0.0 comes out.
/**
 * Used for HTTP cache-control header, which influences downstream caches.
 * Use the provided static factory methods to construct instances of this class.
 * Used in the `S3DeployActionProps.cacheControl` property.
 *
 * @see https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9
 */
export class CacheControl {
  /** The 'must-revalidate' cache control directive. */
  public static mustRevalidate() { return new CacheControl('must-revalidate'); }
  /** The 'no-cache' cache control directive. */
  public static noCache() { return new CacheControl('no-cache'); }
  /** The 'no-transform' cache control directive. */
  public static noTransform() { return new CacheControl('no-transform'); }
  /** The 'public' cache control directive. */
  public static setPublic() { return new CacheControl('public'); }
  /** The 'private' cache control directive. */
  public static setPrivate() { return new CacheControl('private'); }
  /** The 'proxy-revalidate' cache control directive. */
  public static proxyRevalidate() { return new CacheControl('proxy-revalidate'); }
  /** The 'max-age' cache control directive. */
  public static maxAge(t: Duration) { return new CacheControl(`max-age=${t.toSeconds()}`); }
  /** The 's-max-age' cache control directive. */
  public static sMaxAge(t: Duration) { return new CacheControl(`s-maxage=${t.toSeconds()}`); }
  /**
   * Allows you to create an arbitrary cache control directive,
   * in case our support is missing a method for a particular directive.
   */
  public static fromString(s: string) { return new CacheControl(s); }

  /** @param value the actual text value of the created directive */
  private constructor(public value: string) {}
}

/**
 * Construction properties of the `S3DeployAction S3 deploy Action`.
 */
export interface S3DeployActionProps extends codepipeline.CommonAwsActionProps {
  /**
   * Should the deploy action extract the artifact before deploying to Amazon S3.
   *
   * @default true
   */
  readonly extract?: boolean;

  /**
   * The key of the target object. This is required if extract is false.
   */
  readonly objectKey?: string;

  /**
   * The input Artifact to deploy to Amazon S3.
   */
  readonly input: codepipeline.Artifact;

  /**
   * The Amazon S3 bucket that is the deploy target.
   */
  readonly bucket: s3.IBucket;

  /**
   * The specified canned ACL to objects deployed to Amazon S3.
   * This overwrites any existing ACL that was applied to the object.
   *
   * @default - the original object ACL
   */
  readonly accessControl?: s3.BucketAccessControl;

  /**
   * The caching behavior for requests/responses for objects in the bucket.
   * The final cache control property will be the result of joining all of the provided array elements with a comma
   * (plus a space after the comma).
   *
   * @default - none, decided by the HTTP client
   */
  readonly cacheControl?: CacheControl[];
}

/**
 * Deploys the sourceArtifact to Amazon S3.
 */
export class S3DeployAction extends Action {
  private readonly props: S3DeployActionProps;

  constructor(props: S3DeployActionProps) {
    super({
      ...props,
      resource: props.bucket,
      category: codepipeline.ActionCategory.DEPLOY,
      provider: 'S3',
      artifactBounds: deployArtifactBounds(),
      inputs: [props.input],
    });

    this.props = props;
  }

  protected bound(_scope: Construct, _stage: codepipeline.IStage, options: codepipeline.ActionBindOptions):
  codepipeline.ActionConfig {
    // pipeline needs permissions to write to the S3 bucket
    this.props.bucket.grantWrite(options.role);

    if (this.props.accessControl !== undefined) {
      // we need to modify the ACL settings of objects within the Bucket,
      // so grant the Action's Role permissions to do that
      this.props.bucket.grantPutAcl(options.role);
    }

    // the Action Role also needs to read from the Pipeline's bucket
    options.bucket.grantRead(options.role);

    const acl = this.props.accessControl;
    return {
      configuration: {
        BucketName: this.props.bucket.bucketName,
        Extract: this.props.extract === false ? 'false' : 'true',
        ObjectKey: this.props.objectKey,
        CannedACL: acl ? toKebabCase(acl.toString()) : undefined,
        CacheControl: this.props.cacheControl && this.props.cacheControl.map(ac => ac.value).join(', '),
      },
    };
  }
}
