import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3_assets from '@aws-cdk/aws-s3-assets';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { Content } from './content';
import { CfnBuild } from './gamelift.generated';

/**
 * Represents a GameLift server build.
 */
export interface IBuild extends cdk.IResource, iam.IGrantable {

  /**
   * The Identifier of the build.
   *
   * @attribute
   */
  readonly buildId: string;
}

/**
 * Base class for new and imported GameLift server build.
 */
export abstract class BuildBase extends cdk.Resource implements IBuild {
  /**
     * The Identifier of the build.
     */
  public abstract readonly buildId: string;

  public abstract readonly grantPrincipal: iam.IPrincipal;
}

/**
 * The operating system that the game server binaries are built to run on.
 */
export enum OperatingSystem {
  AMAZON_LINUX = 'AMAZON_LINUX',
  AMAZON_LINUX_2 = 'AMAZON_LINUX_2',
  WINDOWS_2012 = 'WINDOWS_2012'
}


/**
 * Represents a Build content defined outside of this stack.
 */
export interface BuildAttributes {
  /**
     * The identifier of the build
     */
  readonly buildId: string;
  /**
   * The IAM role assumed by GameLift to access server build in S3.
   * @default - undefined
   */
  readonly role?: iam.IRole;
}

/**
 * Properties for a new build
 */
export interface BuildProps {
  /**
     * Name of this build
     *
     * @default No name
     */
  readonly buildName?: string;

  /**
     * Version of this build
     *
     * @default No version
     */
  readonly buildVersion?: string;

  /**
     * The operating system that the game server binaries are built to run on.
     *
     * @default No version
     */
  readonly operatingSystem?: OperatingSystem;

  /**
     * The game build file storage
     */
  readonly content: Content;

  /**
    * The IAM role assumed by GameLift to access server build in S3.
    * If providing a custom role, it needs to trust the GameLift service principal (gamelift.amazonaws.com) and be granted sufficient permissions
    * to have Read access to a specific key content into a specific S3 bucket.
    * Below an example of required permission:
    * {
    *  "Version": "2012-10-17",
    *  "Statement": [{
    *        "Effect": "Allow",
    *        "Action": [
    *            "s3:GetObject",
    *            "s3:GetObjectVersion"
    *        ],
    *        "Resource": "arn:aws:s3:::bucket-name/object-name"
    *  }]
    *}
    *
    * @see https://docs.aws.amazon.com/gamelift/latest/developerguide/security_iam_id-based-policy-examples.html#security_iam_id-based-policy-examples-access-storage-loc
    *
    * @default - a role will be created with default permissions.
    */
  readonly role?: iam.IRole;
}

/**
 * A GameLift build, that is installed and runs on instances in an Amazon GameLift fleet. It consists of
 * a zip file with all of the components of the game server build.
 *
 * @see https://docs.aws.amazon.com/gamelift/latest/developerguide/gamelift-build-cli-uploading.html
 *
 * @resource AWS::GameLift::Build
 */
export class Build extends BuildBase {

  /**
   * Create a new Build from s3 content
   */
  static fromBucket(scope: Construct, id: string, bucket: s3.IBucket, key: string, objectVersion?: string) {
    return new Build(scope, id, {
      content: Content.fromBucket(bucket, key, objectVersion),
    });
  }

  /**
   * Create a new Build from asset content
   */
  static fromAsset(scope: Construct, id: string, path: string, options?: s3_assets.AssetOptions) {
    return new Build(scope, id, {
      content: Content.fromAsset(path, options),
    });
  }

  /**
     * Import a build into CDK using its identifier
     */
  static fromBuildId(scope: Construct, id: string, buildId: string): IBuild {
    return this.fromBuildAttributes(scope, id, { buildId });
  }

  /**
   * Import an existing build from its attributes.
   */
  static fromBuildAttributes(scope: Construct, id: string, attrs: BuildAttributes): IBuild {
    class Import extends BuildBase {
      public readonly buildId = attrs.buildId;
      public readonly grantPrincipal = attrs.role ?? new iam.UnknownPrincipal({ resource: this });
    }

    return new Import(scope, id);
  }

  /**
   * The Identifier of the build.
   */
  public readonly buildId: string;

  /**
   * The IAM role GameLift assumes to acccess server build content.
   */
  public readonly role: iam.IRole;

  /**
   * The principal this GameLift Build is using.
   */
  public readonly grantPrincipal: iam.IPrincipal;

  constructor(scope: Construct, id: string, props: BuildProps) {
    super(scope, id, {
      physicalName: props.buildName,
    });

    if (props.buildName && !cdk.Token.isUnresolved(props.buildName)) {
      if (props.buildName.length > 1024) {
        throw new Error(`Build name can not be longer than 1024 characters but has ${props.buildName.length} characters.`);
      }
    }
    this.role = props.role ?? new iam.Role(this, 'ServiceRole', {
      assumedBy: new iam.ServicePrincipal('gamelift.amazonaws.com'),
    });
    this.grantPrincipal = this.role;
    const content = props.content.bind(this, this.role);

    const resource = new CfnBuild(this, 'Resource', {
      name: props.buildName,
      version: props.buildVersion,
      operatingSystem: props.operatingSystem,
      storageLocation: {
        bucket: content.s3Location && content.s3Location.bucketName,
        key: content.s3Location && content.s3Location.objectKey,
        objectVersion: content.s3Location && content.s3Location.objectVersion,
        roleArn: this.role.roleArn,
      },
    });

    this.buildId = resource.ref;
  }


}
