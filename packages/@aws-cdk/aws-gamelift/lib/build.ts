import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3_assets from '@aws-cdk/aws-s3-assets';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { Content } from './content';
import { CfnBuild } from './gamelift.generated';

/**
 * Your custom-built game server software that runs on GameLift and hosts game sessions for your players.
 * A game build represents the set of files that run your game server on a particular operating system.
 * You can have many different builds, such as for different flavors of your game.
 * The game build must be integrated with the GameLift service.
 * You upload game build files to the GameLift service in the Regions where you plan to set up fleets.
 *
 * @see https://docs.aws.amazon.com/gamelift/latest/developerguide/gamelift-build-cli-uploading.html
 */
export interface IBuild extends cdk.IResource, iam.IGrantable {

  /**
   * The Identifier of the build.
   *
   * @attribute
   */
  readonly buildId: string;

  /**
   * The ARN of the build
   *
   * @attribute
   */
  readonly buildArn: string;
}

/**
 * Base class for new and imported GameLift server build.
 */
export abstract class BuildBase extends cdk.Resource implements IBuild {
  /**
     * The Identifier of the build.
     */
  public abstract readonly buildId: string;
  /**
     * The ARN of the build.
     */
  public abstract readonly buildArn: string;

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
     * The ARN of the build
     *
     * At least one of `buildArn` and `buildId` must be provided.
     *
     * @default derived from `buildId`.
     */
  readonly buildArn?: string;

  /**
    * The identifier of the build
    *
    * At least one of `buildId` and `buildArn`  must be provided.
    *
    * @default derived from `buildArn`.
    */
  readonly buildId?: string;
  /**
   * The IAM role assumed by GameLift to access server build in S3.
   * @default the imported fleet cannot be granted access to other resources as an `iam.IGrantable`.
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
     * Import a build into CDK using its ARN
     */
  static fromBuildArn(scope: Construct, id: string, buildArn: string): IBuild {
    return this.fromBuildAttributes(scope, id, { buildArn });
  }

  /**
   * Import an existing build from its attributes.
   */
  static fromBuildAttributes(scope: Construct, id: string, attrs: BuildAttributes): IBuild {
    if (!attrs.buildId && !attrs.buildArn) {
      throw new Error('Either buildId or buildArn must be provided in BuildAttributes');
    }
    const buildId = attrs.buildId ??
      cdk.Stack.of(scope).splitArn(attrs.buildArn!, cdk.ArnFormat.SLASH_RESOURCE_NAME).resourceName;

    if (!buildId) {
      throw new Error(`No build identifier found in ARN: '${attrs.buildArn}'`);
    }

    const buildArn = attrs.buildArn ?? cdk.Stack.of(scope).formatArn({
      service: 'gamelift',
      resource: 'build',
      resourceName: attrs.buildId,
      arnFormat: cdk.ArnFormat.SLASH_RESOURCE_NAME,
    });
    class Import extends BuildBase {
      public readonly buildId = buildId!;
      public readonly buildArn = buildArn;
      public readonly grantPrincipal = attrs.role ?? new iam.UnknownPrincipal({ resource: this });
      public readonly role = attrs.role;

      constructor(s: Construct, i: string) {
        super(s, i, {
          environmentFromArn: buildArn,
        });
      }
    }
    return new Import(scope, id);
  }

  /**
   * The Identifier of the build.
   */
  public readonly buildId: string;

  /**
   * The ARN of the build.
   */
  public readonly buildArn: string;

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

    resource.node.addDependency(this.role);

    this.buildId = this.getResourceNameAttribute(resource.ref);
    this.buildArn = cdk.Stack.of(scope).formatArn({
      service: 'gamelift',
      resource: 'build',
      resourceName: this.buildId,
      arnFormat: cdk.ArnFormat.SLASH_RESOURCE_NAME,
    });
  }


}
