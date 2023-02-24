import * as fs from 'fs';
import * as path from 'path';
import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '@aws-cdk/cx-api';
import { addStackArtifactToAssembly, contentHash, resolvedOr } from './_shared';
import { IStackSynthesizer, ISynthesisSession } from './types';
import { DockerImageAssetLocation, DockerImageAssetSource, FileAssetLocation, FileAssetSource, FileAssetPackaging } from '../assets';
import { Fn } from '../cfn-fn';
import { CfnParameter } from '../cfn-parameter';
import { CfnRule } from '../cfn-rule';
import { Stack } from '../stack';

/**
 * Base class for implementing an IStackSynthesizer
 *
 * This class needs to exist to provide public surface area for external
 * implementations of stack synthesizers. The protected methods give
 * access to functions that are otherwise @_internal to the framework
 * and could not be accessed by external implementors.
 */
export abstract class StackSynthesizer implements IStackSynthesizer {

  /**
   * The qualifier used to bootstrap this stack
   */
  public get bootstrapQualifier(): string | undefined {
    return undefined;
  }

  private _boundStack?: Stack;

  /**
   * Bind to the stack this environment is going to be used on
   *
   * Must be called before any of the other methods are called.
   */
  public bind(stack: Stack): void {
    if (this._boundStack !== undefined) {
      throw new Error('A StackSynthesizer can only be used for one Stack: create a new instance to use with a different Stack');
    }

    this._boundStack = stack;
  }

  /**
   * Register a File Asset
   *
   * Returns the parameters that can be used to refer to the asset inside the template.
   *
   * The synthesizer must rely on some out-of-band mechanism to make sure the given files
   * are actually placed in the returned location before the deployment happens. This can
   * be by writing the intructions to the asset manifest (for use by the `cdk-assets` tool),
   * by relying on the CLI to upload files (legacy behavior), or some other operator controlled
   * mechanism.
   */
  public abstract addFileAsset(asset: FileAssetSource): FileAssetLocation;

  /**
   * Register a Docker Image Asset
   *
   * Returns the parameters that can be used to refer to the asset inside the template.
   *
   * The synthesizer must rely on some out-of-band mechanism to make sure the given files
   * are actually placed in the returned location before the deployment happens. This can
   * be by writing the intructions to the asset manifest (for use by the `cdk-assets` tool),
   * by relying on the CLI to upload files (legacy behavior), or some other operator controlled
   * mechanism.
   */
  public abstract addDockerImageAsset(asset: DockerImageAssetSource): DockerImageAssetLocation;

  /**
   * Synthesize the associated stack to the session
   */
  public abstract synthesize(session: ISynthesisSession): void;

  /**
   * Have the stack write out its template
   *
   * @deprecated Use `synthesizeTemplate` instead
   */
  protected synthesizeStackTemplate(stack: Stack, session: ISynthesisSession): void {
    stack._synthesizeTemplate(session);
  }

  /**
   * Write the stack template to the given session
   *
   * Return a descriptor that represents the stack template as a file asset
   * source, for adding to an asset manifest (if desired). This can be used to
   * have the asset manifest system (`cdk-assets`) upload the template to S3
   * using the appropriate role, so that afterwards only a CloudFormation
   * deployment is necessary.
   *
   * If the template is uploaded as an asset, the `stackTemplateAssetObjectUrl`
   * property should be set when calling `emitArtifact.`
   *
   * If the template is *NOT* uploaded as an asset first and the template turns
   * out to be >50KB, it will need to be uploaded to S3 anyway. At that point
   * the credentials will be the same identity that is doing the `UpdateStack`
   * call, which may not have the right permissions to write to S3.
   */
  protected synthesizeTemplate(session: ISynthesisSession, lookupRoleArn?: string): FileAssetSource {
    this.boundStack._synthesizeTemplate(session, lookupRoleArn);
    return stackTemplateFileAsset(this.boundStack, session);
  }

  /**
   * Write the stack artifact to the session
   *
   * Use default settings to add a CloudFormationStackArtifact artifact to
   * the given synthesis session.
   *
   * @deprecated Use `emitArtifact` instead
   */
  protected emitStackArtifact(stack: Stack, session: ISynthesisSession, options: SynthesizeStackArtifactOptions = {}) {
    addStackArtifactToAssembly(session, stack, options ?? {}, options.additionalDependencies ?? []);
  }

  /**
   * Write the CloudFormation stack artifact to the session
   *
   * Use default settings to add a CloudFormationStackArtifact artifact to
   * the given synthesis session. The Stack artifact will control the settings for the
   * CloudFormation deployment.
   */
  protected emitArtifact(session: ISynthesisSession, options: SynthesizeStackArtifactOptions = {}) {
    addStackArtifactToAssembly(session, this.boundStack, options ?? {}, options.additionalDependencies ?? []);
  }

  /**
   * Add a CfnRule to the bound stack that checks whether an SSM parameter exceeds a given version
   *
   * This will modify the template, so must be called before the stack is synthesized.
   */
  protected addBootstrapVersionRule(requiredVersion: number, bootstrapStackVersionSsmParameter: string) {
    addBootstrapVersionRule(this.boundStack, requiredVersion, bootstrapStackVersionSsmParameter);
  }

  /**
   * Retrieve the bound stack
   *
   * Fails if the stack hasn't been bound yet.
   */
  protected get boundStack(): Stack {
    if (!this._boundStack) {
      throw new Error('The StackSynthesizer must be bound to a Stack first before boundStack() can be called');
    }
    return this._boundStack;
  }

  /**
   * Turn a file asset location into a CloudFormation representation of that location
   *
   * If any of the fields contain placeholders, the result will be wrapped in a `Fn.sub`.
   */
  protected cloudFormationLocationFromFileAsset(location: cxschema.FileDestination): FileAssetLocation {
    const { region, urlSuffix } = stackLocationOrInstrinsics(this.boundStack);
    const httpUrl = cfnify(
      `https://s3.${region}.${urlSuffix}/${location.bucketName}/${location.objectKey}`,
    );
    const s3ObjectUrlWithPlaceholders = `s3://${location.bucketName}/${location.objectKey}`;

    // Return CFN expression
    //
    // 's3ObjectUrlWithPlaceholders' is intended for the CLI. The CLI ultimately needs a
    // 'https://s3.REGION.amazonaws.com[.cn]/name/hash' URL to give to CloudFormation.
    // However, there's no way for us to actually know the URL_SUFFIX in the framework, so
    // we can't construct that URL. Instead, we record the 's3://.../...' form, and the CLI
    // transforms it to the correct 'https://.../' URL before calling CloudFormation.
    return {
      bucketName: cfnify(location.bucketName),
      objectKey: cfnify(location.objectKey),
      httpUrl,
      s3ObjectUrl: cfnify(s3ObjectUrlWithPlaceholders),
      s3ObjectUrlWithPlaceholders,
      s3Url: httpUrl,
    };
  }

  /**
   * Turn a docker asset location into a CloudFormation representation of that location
   *
   * If any of the fields contain placeholders, the result will be wrapped in a `Fn.sub`.
   */
  protected cloudFormationLocationFromDockerImageAsset(dest: cxschema.DockerImageDestination): DockerImageAssetLocation {
    const { account, region, urlSuffix } = stackLocationOrInstrinsics(this.boundStack);

    // Return CFN expression
    return {
      repositoryName: cfnify(dest.repositoryName),
      imageUri: cfnify(
        `${account}.dkr.ecr.${region}.${urlSuffix}/${dest.repositoryName}:${dest.imageTag}`,
      ),
      imageTag: cfnify(dest.imageTag),
    };
  }

}

/**
 * Stack artifact options
 *
 * A subset of `cxschema.AwsCloudFormationStackProperties` of optional settings that need to be
 * configurable by synthesizers, plus `additionalDependencies`.
 */
export interface SynthesizeStackArtifactOptions {
  /**
   * Identifiers of additional dependencies
   *
   * @default - No additional dependencies
   */
  readonly additionalDependencies?: string[];

  /**
   * Values for CloudFormation stack parameters that should be passed when the stack is deployed.
   *
   * @default - No parameters
   */
  readonly parameters?: { [id: string]: string };

  /**
   * The role that needs to be assumed to deploy the stack
   *
   * @default - No role is assumed (current credentials are used)
   */
  readonly assumeRoleArn?: string;

  /**
   * The externalID to use with the assumeRoleArn
   *
   * @default - No externalID is used
   */
  readonly assumeRoleExternalId?: string;

  /**
   * The role that is passed to CloudFormation to execute the change set
   *
   * @default - No role is passed (currently assumed role/credentials are used)
   */
  readonly cloudFormationExecutionRoleArn?: string;

  /**
   * The role to use to look up values from the target AWS account
   *
   * @default - None
   */
  readonly lookupRole?: cxschema.BootstrapRole;

  /**
   * If the stack template has already been included in the asset manifest, its asset URL
   *
   * @default - Not uploaded yet, upload just before deploying
   */
  readonly stackTemplateAssetObjectUrl?: string;

  /**
   * Version of bootstrap stack required to deploy this stack
   *
   * @default - No bootstrap stack required
   */
  readonly requiresBootstrapStackVersion?: number;

  /**
   * SSM parameter where the bootstrap stack version number can be found
   *
   * Only used if `requiresBootstrapStackVersion` is set.
   *
   * - If this value is not set, the bootstrap stack name must be known at
   *   deployment time so the stack version can be looked up from the stack
   *   outputs.
   * - If this value is set, the bootstrap stack can have any name because
   *   we won't need to look it up.
   *
   * @default - Bootstrap stack version number looked up
   */
  readonly bootstrapStackVersionSsmParameter?: string;
}

function stackTemplateFileAsset(stack: Stack, session: ISynthesisSession): FileAssetSource {
  const templatePath = path.join(session.assembly.outdir, stack.templateFile);

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Stack template ${stack.stackName} not written yet: ${templatePath}`);
  }

  const template = fs.readFileSync(templatePath, { encoding: 'utf-8' });

  const sourceHash = contentHash(template);

  return {
    fileName: stack.templateFile,
    packaging: FileAssetPackaging.FILE,
    sourceHash,
  };
}

/**
 * Add a CfnRule to the Stack which checks the current version of the bootstrap stack this template is targeting
 *
 * The CLI normally checks this, but in a pipeline the CLI is not involved
 * so we encode this rule into the template in a way that CloudFormation will check it.
 */
function addBootstrapVersionRule(stack: Stack, requiredVersion: number, bootstrapStackVersionSsmParameter: string) {
  // Because of https://github.com/aws/aws-cdk/blob/main/packages/assert-internal/lib/synth-utils.ts#L74
  // synthesize() may be called more than once on a stack in unit tests, and the below would break
  // if we execute it a second time. Guard against the constructs already existing.
  if (stack.node.tryFindChild('BootstrapVersion')) { return; }

  const param = new CfnParameter(stack, 'BootstrapVersion', {
    type: 'AWS::SSM::Parameter::Value<String>',
    description: `Version of the CDK Bootstrap resources in this environment, automatically retrieved from SSM Parameter Store. ${cxapi.SSMPARAM_NO_INVALIDATE}`,
    default: bootstrapStackVersionSsmParameter,
  });

  // There is no >= check in CloudFormation, so we have to check the number
  // is NOT in [1, 2, 3, ... <required> - 1]
  const oldVersions = range(1, requiredVersion).map(n => `${n}`);

  new CfnRule(stack, 'CheckBootstrapVersion', {
    assertions: [
      {
        assert: Fn.conditionNot(Fn.conditionContains(oldVersions, param.valueAsString)),
        assertDescription: `CDK bootstrap stack version ${requiredVersion} required. Please run 'cdk bootstrap' with a recent version of the CDK CLI.`,
      },
    ],
  });
}

function range(startIncl: number, endExcl: number) {
  const ret = new Array<number>();
  for (let i = startIncl; i < endExcl; i++) {
    ret.push(i);
  }
  return ret;
}

/**
 * Return the stack locations if they're concrete, or the original CFN intrisics otherwise
 *
 * We need to return these instead of the tokenized versions of the strings,
 * since we must accept those same ${AWS::AccountId}/${AWS::Region} placeholders
 * in bucket names and role names (in order to allow environment-agnostic stacks).
 *
 * We'll wrap a single {Fn::Sub} around the final string in order to replace everything,
 * but we can't have the token system render part of the string to {Fn::Join} because
 * the CFN specification doesn't allow the {Fn::Sub} template string to be an arbitrary
 * expression--it must be a string literal.
 */
function stackLocationOrInstrinsics(stack: Stack) {
  return {
    account: resolvedOr(stack.account, '${AWS::AccountId}'),
    region: resolvedOr(stack.region, '${AWS::Region}'),
    urlSuffix: resolvedOr(stack.urlSuffix, '${AWS::URLSuffix}'),
  };
}

/**
 * If the string still contains placeholders, wrap it in a Fn::Sub so they will be substituted at CFN deployment time
 *
 * (This happens to work because the placeholders we picked map directly onto CFN
 * placeholders. If they didn't we'd have to do a transformation here).
 */
function cfnify(s: string): string {
  return s.indexOf('${') > -1 ? Fn.sub(s) : s;
}
