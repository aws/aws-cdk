import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3_assets from 'aws-cdk-lib/aws-s3-assets';
import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { Content } from './content';
import { CfnScript } from 'aws-cdk-lib/aws-gamelift';

/**
 * Your configuration and custom game logic for use with Realtime Servers.
 * Realtime Servers are provided by GameLift to use instead of a custom-built game server.
 * You configure Realtime Servers for your game clients by creating a script using JavaScript,
 * and add custom game logic as appropriate to host game sessions for your players.
 * You upload the Realtime script to the GameLift service in the Regions where you plan to set up fleets.
 *
 * @see https://docs.aws.amazon.com/gamelift/latest/developerguide/realtime-script-uploading.html
 */
export interface IScript extends cdk.IResource, iam.IGrantable {
  /**
   * The Identifier of the realtime server script.
   *
   * @attribute
   */
  readonly scriptId: string;

  /**
   * The ARN of the realtime server script.
   *
   * @attribute
   */
  readonly scriptArn: string;
}

/**
 * Base class for new and imported GameLift realtime server script.
 */
export abstract class ScriptBase extends cdk.Resource implements IScript {
  /**
   * The Identifier of the realtime server script.
   */
  public abstract readonly scriptId: string;
  public abstract readonly scriptArn: string;

  public abstract readonly grantPrincipal: iam.IPrincipal;
}

/**
 * Represents a Script content defined outside of this stack.
 */
export interface ScriptAttributes {
  /**
   * The ARN of the realtime server script
   */
  readonly scriptArn: string;

  /**
   * The IAM role assumed by GameLift to access server script in S3.
   * @default - undefined
   */
  readonly role?: iam.IRole;
}

/**
 * Properties for a new realtime server script
 */
export interface ScriptProps {
  /**
   * Name of this realtime server script
   *
   * @default No name
   */
  readonly scriptName?: string;

  /**
   * Version of this realtime server script
   *
   * @default No version
   */
  readonly scriptVersion?: string;

  /**
   * The game content
   */
  readonly content: Content;

  /**
   * The IAM role assumed by GameLift to access server script in S3.
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
   * }
   *
   * @see https://docs.aws.amazon.com/gamelift/latest/developerguide/security_iam_id-based-policy-examples.html#security_iam_id-based-policy-examples-access-storage-loc
   *
   * @default - a role will be created with default permissions.
   */
  readonly role?: iam.IRole;
}

/**
 * A GameLift script, that is installed and runs on instances in an Amazon GameLift fleet. It consists of
 * a zip file with all of the components of the realtime game server script.
 *
 * @see https://docs.aws.amazon.com/gamelift/latest/developerguide/realtime-script-uploading.html
 *
 * @resource AWS::GameLift::Script
 */
export class Script extends ScriptBase {
  /**
   * Create a new realtime server script from s3 content
   */
  static fromBucket(scope: Construct, id: string, bucket: s3.IBucket, key: string, objectVersion?: string) {
    return new Script(scope, id, {
      content: Content.fromBucket(bucket, key, objectVersion),
    });
  }

  /**
   * Create a new realtime server script from asset content
   */
  static fromAsset(scope: Construct, id: string, path: string, options?: s3_assets.AssetOptions) {
    return new Script(scope, id, {
      content: Content.fromAsset(path, options),
    });
  }

  /**
   * Import a script into CDK using its ARN
   */
  static fromScriptArn(scope: Construct, id: string, scriptArn: string): IScript {
    return this.fromScriptAttributes(scope, id, { scriptArn });
  }

  /**
   * Import an existing realtime server script from its attributes.
   */
  static fromScriptAttributes(scope: Construct, id: string, attrs: ScriptAttributes): IScript {
    const scriptArn = attrs.scriptArn;
    const scriptId = extractIdFromArn(attrs.scriptArn);
    const role = attrs.role;

    class Import extends ScriptBase {
      public readonly scriptArn = scriptArn;
      public readonly scriptId = scriptId;
      public readonly grantPrincipal:iam.IPrincipal;
      public readonly role = role;

      constructor(s: Construct, i: string) {
        super(s, i, {
          environmentFromArn: scriptArn,
        });

        this.grantPrincipal = this.role || new iam.UnknownPrincipal({ resource: this });
      }
    }

    return new Import(scope, id);
  }

  /**
   * The Identifier of the realtime server script.
   */
  public readonly scriptId: string;

  /**
   * The ARN of the realtime server script.
   */
  public readonly scriptArn: string;

  /**
   * The IAM role GameLift assumes to acccess server script content.
   */
  public readonly role: iam.IRole;

  /**
   * The principal this GameLift script is using.
   */
  public readonly grantPrincipal: iam.IPrincipal;

  constructor(scope: Construct, id: string, props: ScriptProps) {
    super(scope, id, {
      physicalName: props.scriptName,
    });

    if (props.scriptName && !cdk.Token.isUnresolved(props.scriptName)) {
      if (props.scriptName.length > 1024) {
        throw new Error(`Script name can not be longer than 1024 characters but has ${props.scriptName.length} characters.`);
      }
    }
    this.role = props.role ?? new iam.Role(this, 'ServiceRole', {
      assumedBy: new iam.ServicePrincipal('gamelift.amazonaws.com'),
    });
    this.grantPrincipal = this.role;
    const content = props.content.bind(this, this.role);

    const resource = new CfnScript(this, 'Resource', {
      name: props.scriptName,
      version: props.scriptVersion,
      storageLocation: {
        bucket: content.s3Location && content.s3Location.bucketName,
        key: content.s3Location && content.s3Location.objectKey,
        objectVersion: content.s3Location && content.s3Location.objectVersion,
        roleArn: this.role.roleArn,
      },
    });

    this.scriptId = this.getResourceNameAttribute(resource.ref);
    this.scriptArn = this.getResourceArnAttribute(resource.attrArn, {
      service: 'gamelift',
      resource: `script/${this.physicalName}`,
      arnFormat: cdk.ArnFormat.COLON_RESOURCE_NAME,
    });
  }
}

/**
 * Given an opaque (token) ARN, returns a CloudFormation expression that extracts the script
 * identifier from the ARN.
 *
 * Script ARNs look like this:
 *
 *   arn:aws:gamelift:region:account-id:script/script-identifier
 *
 * ..which means that in order to extract the `script-identifier` component from the ARN, we can
 * split the ARN using ":" and select the component in index 5 then split using "/" and select the component in index 1.
 *
 * @returns the script identifier from his ARN
 */
function extractIdFromArn(arn: string) {
  const splitValue = cdk.Fn.select(5, cdk.Fn.split(':', arn));
  return cdk.Fn.select(1, cdk.Fn.split('/', splitValue));
}
