import * as cxapi from '@aws-cdk/cx-api';
import * as chalk from 'chalk';
import * as fs from 'fs-extra';
import * as uuid from 'uuid';
import { addMetadataAssetsToManifest } from '../assets';
import { Tag } from '../cdk-toolkit';
import { debug, error, print } from '../logging';
import { toYAML } from '../serialize';
import { AssetManifestBuilder } from '../util/asset-manifest-builder';
import { publishAssets } from '../util/asset-publishing';
import { contentHash } from '../util/content-hash';
import { ISDK, SdkProvider } from './aws-auth';
import { CfnEvaluationException } from './evaluate-cloudformation-template';
import { tryHotswapDeployment } from './hotswap-deployments';
import { ICON } from './hotswap/common';
import { ToolkitInfo } from './toolkit-info';
import {
  changeSetHasNoChanges, CloudFormationStack, TemplateParameters, waitForChangeSet,
  waitForStackDeploy, waitForStackDelete, ParameterValues, ParameterChanges, ResourcesToImport,
} from './util/cloudformation';
import { StackActivityMonitor, StackActivityProgress } from './util/cloudformation/stack-activity-monitor';

type TemplateBodyParameter = {
  TemplateBody?: string
  TemplateURL?: string
};

export interface DeployStackResult {
  readonly noOp: boolean;
  readonly outputs: { [name: string]: string };
  readonly stackArn: string;
}

export interface DeployStackOptions {
  /**
   * The stack to be deployed
   */
  stack: cxapi.CloudFormationStackArtifact;

  /**
   * The environment to deploy this stack in
   *
   * The environment on the stack artifact may be unresolved, this one
   * must be resolved.
   */
  resolvedEnvironment: cxapi.Environment;

  /**
   * The SDK to use for deploying the stack
   *
   * Should have been initialized with the correct role with which
   * stack operations should be performed.
   */
  sdk: ISDK;

  /**
   * SDK provider (seeded with default credentials)
   *
   * Will exclusively be used to assume publishing credentials (which must
   * start out from current credentials regardless of whether we've assumed an
   * action role to touch the stack or not).
   *
   * Used for the following purposes:
   *
   * - Publish legacy assets.
   * - Upload large CloudFormation templates to the staging bucket.
   */
  sdkProvider: SdkProvider;

  /**
   * Information about the bootstrap stack found in the target environment
   */
  toolkitInfo: ToolkitInfo;

  /**
   * Role to pass to CloudFormation to execute the change set
   *
   * @default - Role specified on stack, otherwise current
   */
  roleArn?: string;

  /**
   * Notification ARNs to pass to CloudFormation to notify when the change set has completed
   *
   * @default - No notifications
   */
  notificationArns?: string[];

  /**
   * Name to deploy the stack under
   *
   * @default - Name from assembly
   */
  deployName?: string;

  /**
   * Quiet or verbose deployment
   *
   * @default false
   */
  quiet?: boolean;

  /**
   * List of asset IDs which shouldn't be built
   *
   * @default - Build all assets
   */
  reuseAssets?: string[];

  /**
   * Tags to pass to CloudFormation to add to stack
   *
   * @default - No tags
   */
  tags?: Tag[];

  /**
   * Whether to execute the changeset or leave it in review.
   *
   * @default true
   */
  execute?: boolean;

  /**
   * Optional name to use for the CloudFormation change set.
   * If not provided, a name will be generated automatically.
   */
  changeSetName?: string;

  /**
   * The collection of extra parameters
   * (in addition to those used for assets)
   * to pass to the deployed template.
   * Note that parameters with `undefined` or empty values will be ignored,
   * and not passed to the template.
   *
   * @default - no additional parameters will be passed to the template
   */
  parameters?: { [name: string]: string | undefined };

  /**
   * Use previous values for unspecified parameters
   *
   * If not set, all parameters must be specified for every deployment.
   *
   * @default false
   */
  usePreviousParameters?: boolean;

  /**
   * Display mode for stack deployment progress.
   *
   * @default StackActivityProgress.Bar stack events will be displayed for
   *   the resource currently being deployed.
   */
  progress?: StackActivityProgress;

  /**
   * Deploy even if the deployed template is identical to the one we are about to deploy.
   * @default false
   */
  force?: boolean;

  /**
   * Whether we are on a CI system
   *
   * @default false
   */
  readonly ci?: boolean;

  /**
   * Rollback failed deployments
   *
   * @default true
   */
  readonly rollback?: boolean;

  /*
   * Whether to perform a 'hotswap' deployment.
   * A 'hotswap' deployment will attempt to short-circuit CloudFormation
   * and update the affected resources like Lambda functions directly.
   *
   * @default - false for regular deployments, true for 'watch' deployments
   */
  readonly hotswap?: boolean;

  /**
   * The extra string to append to the User-Agent header when performing AWS SDK calls.
   *
   * @default - nothing extra is appended to the User-Agent header
   */
  readonly extraUserAgent?: string;

  /**
   * If set, change set of type IMPORT will be created, and resourcesToImport
   * passed to it.
   */
  readonly resourcesToImport?: ResourcesToImport;

  /**
   * If present, use this given template instead of the stored one
   *
   * @default - Use the stored template
   */
  readonly overrideTemplate?: any;
}

const LARGE_TEMPLATE_SIZE_KB = 50;

export async function deployStack(options: DeployStackOptions): Promise<DeployStackResult> {
  const stackArtifact = options.stack;

  const stackEnv = options.resolvedEnvironment;

  options.sdk.appendCustomUserAgent(options.extraUserAgent);
  const cfn = options.sdk.cloudFormation();
  const deployName = options.deployName || stackArtifact.stackName;
  let cloudFormationStack = await CloudFormationStack.lookup(cfn, deployName);

  if (cloudFormationStack.stackStatus.isCreationFailure) {
    debug(`Found existing stack ${deployName} that had previously failed creation. Deleting it before attempting to re-create it.`);
    await cfn.deleteStack({ StackName: deployName }).promise();
    const deletedStack = await waitForStackDelete(cfn, deployName);
    if (deletedStack && deletedStack.stackStatus.name !== 'DELETE_COMPLETE') {
      throw new Error(`Failed deleting stack ${deployName} that had previously failed creation (current state: ${deletedStack.stackStatus})`);
    }
    // Update variable to mark that the stack does not exist anymore, but avoid
    // doing an actual lookup in CloudFormation (which would be silly to do if
    // we just deleted it).
    cloudFormationStack = CloudFormationStack.doesNotExist(cfn, deployName);
  }

  // Detect "legacy" assets (which remain in the metadata) and publish them via
  // an ad-hoc asset manifest, while passing their locations via template
  // parameters.
  const legacyAssets = new AssetManifestBuilder();
  const assetParams = await addMetadataAssetsToManifest(stackArtifact, legacyAssets, options.toolkitInfo, options.reuseAssets);

  const finalParameterValues = { ...options.parameters, ...assetParams };

  const templateParams = TemplateParameters.fromTemplate(stackArtifact.template);
  const stackParams = options.usePreviousParameters
    ? templateParams.updateExisting(finalParameterValues, cloudFormationStack.parameters)
    : templateParams.supplyAll(finalParameterValues);

  if (await canSkipDeploy(options, cloudFormationStack, stackParams.hasChanges(cloudFormationStack.parameters))) {
    debug(`${deployName}: skipping deployment (use --force to override)`);
    // if we can skip deployment and we are performing a hotswap, let the user know
    // that no hotswap deployment happened
    if (options.hotswap) {
      print(`\n ${ICON} %s\n`, chalk.bold('hotswap deployment skipped - no changes were detected (use --force to override)'));
    }
    return {
      noOp: true,
      outputs: cloudFormationStack.outputs,
      stackArn: cloudFormationStack.stackId,
    };
  } else {
    debug(`${deployName}: deploying...`);
  }

  const bodyParameter = await makeBodyParameter(
    stackArtifact,
    options.resolvedEnvironment,
    legacyAssets,
    options.toolkitInfo,
    options.sdk,
    options.overrideTemplate);
  await publishAssets(legacyAssets.toManifest(stackArtifact.assembly.directory), options.sdkProvider, stackEnv);

  if (options.hotswap) {
    // attempt to short-circuit the deployment if possible
    try {
      const hotswapDeploymentResult = await tryHotswapDeployment(options.sdkProvider, assetParams, cloudFormationStack, stackArtifact);
      if (hotswapDeploymentResult) {
        return hotswapDeploymentResult;
      }
      print('Could not perform a hotswap deployment, as the stack %s contains non-Asset changes', stackArtifact.displayName);
    } catch (e) {
      if (!(e instanceof CfnEvaluationException)) {
        throw e;
      }
      print('Could not perform a hotswap deployment, because the CloudFormation template could not be resolved: %s', e.message);
    }
    print('Falling back to doing a full deployment');
  }

  // could not short-circuit the deployment, perform a full CFN deploy instead
  return prepareAndExecuteChangeSet(options, cloudFormationStack, stackArtifact, stackParams, bodyParameter);
}

async function prepareAndExecuteChangeSet(
  options: DeployStackOptions, cloudFormationStack: CloudFormationStack,
  stackArtifact: cxapi.CloudFormationStackArtifact, stackParams: ParameterValues, bodyParameter: TemplateBodyParameter,
): Promise<DeployStackResult> {
  // if we got here, and hotswap is enabled, that means changes couldn't be hotswapped,
  // and we had to fall back on a full deployment. Note that fact in our User-Agent
  if (options.hotswap) {
    options.sdk.appendCustomUserAgent('cdk-hotswap/fallback');
  }

  const cfn = options.sdk.cloudFormation();
  const deployName = options.deployName ?? stackArtifact.stackName;

  const changeSetName = options.changeSetName ?? 'cdk-deploy-change-set';
  if (cloudFormationStack.exists) {
    //Delete any existing change sets generated by CDK since change set names must be unique.
    //The delete request is successful as long as the stack exists (even if the change set does not exist).
    debug(`Removing existing change set with name ${changeSetName} if it exists`);
    await cfn.deleteChangeSet({ StackName: deployName, ChangeSetName: changeSetName }).promise();
  }

  const update = cloudFormationStack.exists && cloudFormationStack.stackStatus.name !== 'REVIEW_IN_PROGRESS';

  debug(`Attempting to create ChangeSet with name ${changeSetName} to ${update ? 'update' : 'create'} stack ${deployName}`);
  print('%s: creating CloudFormation changeset...', chalk.bold(deployName));
  const executionId = uuid.v4();
  const changeSet = await cfn.createChangeSet({
    StackName: deployName,
    ChangeSetName: changeSetName,
    ChangeSetType: options.resourcesToImport ? 'IMPORT' : update ? 'UPDATE' : 'CREATE',
    ResourcesToImport: options.resourcesToImport,
    Description: `CDK Changeset for execution ${executionId}`,
    TemplateBody: bodyParameter.TemplateBody,
    TemplateURL: bodyParameter.TemplateURL,
    Parameters: stackParams.apiParameters,
    RoleARN: options.roleArn,
    NotificationARNs: options.notificationArns,
    Capabilities: ['CAPABILITY_IAM', 'CAPABILITY_NAMED_IAM', 'CAPABILITY_AUTO_EXPAND'],
    Tags: options.tags,
  }).promise();

  const execute = options.execute ?? true;

  debug('Initiated creation of changeset: %s; waiting for it to finish creating...', changeSet.Id);
  // Fetching all pages if we'll execute, so we can have the correct change count when monitoring.
  const changeSetDescription = await waitForChangeSet(cfn, deployName, changeSetName, { fetchAll: execute });

  // Update termination protection only if it has changed.
  const terminationProtection = stackArtifact.terminationProtection ?? false;
  if (!!cloudFormationStack.terminationProtection !== terminationProtection) {
    debug('Updating termination protection from %s to %s for stack %s', cloudFormationStack.terminationProtection, terminationProtection, deployName);
    await cfn.updateTerminationProtection({
      StackName: deployName,
      EnableTerminationProtection: terminationProtection,
    }).promise();
    debug('Termination protection updated to %s for stack %s', terminationProtection, deployName);
  }

  if (changeSetHasNoChanges(changeSetDescription)) {
    debug('No changes are to be performed on %s.', deployName);
    if (options.execute) {
      debug('Deleting empty change set %s', changeSet.Id);
      await cfn.deleteChangeSet({ StackName: deployName, ChangeSetName: changeSetName }).promise();
    }
    return { noOp: true, outputs: cloudFormationStack.outputs, stackArn: changeSet.StackId! };
  }

  if (execute) {
    debug('Initiating execution of changeset %s on stack %s', changeSet.Id, deployName);

    const shouldDisableRollback = options.rollback === false;
    // Do a bit of contortions to only pass the `DisableRollback` flag if it's true. That way,
    // CloudFormation won't balk at the unrecognized option in regions where the feature is not available yet.
    const disableRollback = shouldDisableRollback ? { DisableRollback: true } : undefined;

    await cfn.executeChangeSet({ StackName: deployName, ChangeSetName: changeSetName, ...disableRollback }).promise();

    // eslint-disable-next-line max-len
    const changeSetLength: number = (changeSetDescription.Changes ?? []).length;
    const monitor = options.quiet ? undefined : StackActivityMonitor.withDefaultPrinter(cfn, deployName, stackArtifact, {
      // +1 for the extra event emitted from updates.
      resourcesTotal: cloudFormationStack.exists ? changeSetLength + 1 : changeSetLength,
      progress: options.progress,
      changeSetCreationTime: changeSetDescription.CreationTime,
    }).start();
    debug('Execution of changeset %s on stack %s has started; waiting for the update to complete...', changeSet.Id, deployName);
    try {
      const finalStack = await waitForStackDeploy(cfn, deployName);

      // This shouldn't really happen, but catch it anyway. You never know.
      if (!finalStack) { throw new Error('Stack deploy failed (the stack disappeared while we were deploying it)'); }
      cloudFormationStack = finalStack;
    } catch (e) {
      throw new Error(suffixWithErrors(e.message, monitor?.errors));
    } finally {
      await monitor?.stop();
    }
    debug('Stack %s has completed updating', deployName);
  } else {
    print('Changeset %s created and waiting in review for manual execution (--no-execute)', changeSet.Id);
  }

  return { noOp: false, outputs: cloudFormationStack.outputs, stackArn: changeSet.StackId! };
}

/**
 * Prepares the body parameter for +CreateChangeSet+.
 *
 * If the template is small enough to be inlined into the API call, just return
 * it immediately.
 *
 * Otherwise, add it to the asset manifest to get uploaded to the staging
 * bucket and return its coordinates. If there is no staging bucket, an error
 * is thrown.
 *
 * @param stack     the synthesized stack that provides the CloudFormation template
 * @param toolkitInfo information about the toolkit stack
 */
async function makeBodyParameter(
  stack: cxapi.CloudFormationStackArtifact,
  resolvedEnvironment: cxapi.Environment,
  assetManifest: AssetManifestBuilder,
  toolkitInfo: ToolkitInfo,
  sdk: ISDK,
  overrideTemplate?: any,
): Promise<TemplateBodyParameter> {

  // If the template has already been uploaded to S3, just use it from there.
  if (stack.stackTemplateAssetObjectUrl && !overrideTemplate) {
    return { TemplateURL: restUrlFromManifest(stack.stackTemplateAssetObjectUrl, resolvedEnvironment, sdk) };
  }

  // Otherwise, pass via API call (if small) or upload here (if large)
  const templateJson = toYAML(overrideTemplate ?? stack.template);

  if (templateJson.length <= LARGE_TEMPLATE_SIZE_KB * 1024) {
    return { TemplateBody: templateJson };
  }

  if (!toolkitInfo.found) {
    error(
      `The template for stack "${stack.displayName}" is ${Math.round(templateJson.length / 1024)}KiB. ` +
      `Templates larger than ${LARGE_TEMPLATE_SIZE_KB}KiB must be uploaded to S3.\n` +
      'Run the following command in order to setup an S3 bucket in this environment, and then re-deploy:\n\n',
      chalk.blue(`\t$ cdk bootstrap ${resolvedEnvironment.name}\n`));

    throw new Error('Template too large to deploy ("cdk bootstrap" is required)');
  }

  const templateHash = contentHash(templateJson);
  const key = `cdk/${stack.id}/${templateHash}.yml`;

  let templateFile = stack.templateFile;
  if (overrideTemplate) {
    // Add a variant of this template
    templateFile = `${stack.templateFile}-${templateHash}.yaml`;
    await fs.writeFile(templateFile, templateJson, { encoding: 'utf-8' });
  }

  assetManifest.addFileAsset(templateHash, {
    path: templateFile,
  }, {
    bucketName: toolkitInfo.bucketName,
    objectKey: key,
  });

  const templateURL = `${toolkitInfo.bucketUrl}/${key}`;
  debug('Storing template in S3 at:', templateURL);
  return { TemplateURL: templateURL };
}

/**
 * Prepare a body parameter for CFN, performing the upload
 *
 * Return it as-is if it is small enough to pass in the API call,
 * upload to S3 and return the coordinates if it is not.
 */
export async function makeBodyParameterAndUpload(
  stack: cxapi.CloudFormationStackArtifact,
  resolvedEnvironment: cxapi.Environment,
  toolkitInfo: ToolkitInfo,
  sdkProvider: SdkProvider,
  sdk: ISDK,
  overrideTemplate?: any): Promise<TemplateBodyParameter> {

  // We don't have access to the actual asset manifest here, so pretend that the
  // stack doesn't have a pre-published URL.
  const forceUploadStack = Object.create(stack, {
    stackTemplateAssetObjectUrl: { value: undefined },
  });

  const builder = new AssetManifestBuilder();
  const bodyparam = await makeBodyParameter(forceUploadStack, resolvedEnvironment, builder, toolkitInfo, sdk, overrideTemplate);
  const manifest = builder.toManifest(stack.assembly.directory);
  await publishAssets(manifest, sdkProvider, resolvedEnvironment, { quiet: true });
  return bodyparam;
}

export interface DestroyStackOptions {
  /**
   * The stack to be destroyed
   */
  stack: cxapi.CloudFormationStackArtifact;

  sdk: ISDK;
  roleArn?: string;
  deployName?: string;
  quiet?: boolean;
}

export async function destroyStack(options: DestroyStackOptions) {
  const deployName = options.deployName || options.stack.stackName;
  const cfn = options.sdk.cloudFormation();

  const currentStack = await CloudFormationStack.lookup(cfn, deployName);
  if (!currentStack.exists) {
    return;
  }
  const monitor = options.quiet ? undefined : StackActivityMonitor.withDefaultPrinter(cfn, deployName, options.stack).start();

  try {
    await cfn.deleteStack({ StackName: deployName, RoleARN: options.roleArn }).promise();
    const destroyedStack = await waitForStackDelete(cfn, deployName);
    if (destroyedStack && destroyedStack.stackStatus.name !== 'DELETE_COMPLETE') {
      throw new Error(`Failed to destroy ${deployName}: ${destroyedStack.stackStatus}`);
    }
  } catch (e) {
    throw new Error(suffixWithErrors(e.message, monitor?.errors));
  } finally {
    if (monitor) { await monitor.stop(); }
  }
}

/**
 * Checks whether we can skip deployment
 *
 * We do this in a complicated way by preprocessing (instead of just
 * looking at the changeset), because if there are nested stacks involved
 * the changeset will always show the nested stacks as needing to be
 * updated, and the deployment will take a long time to in effect not
 * do anything.
 */
async function canSkipDeploy(
  deployStackOptions: DeployStackOptions,
  cloudFormationStack: CloudFormationStack,
  parameterChanges: ParameterChanges): Promise<boolean> {

  const deployName = deployStackOptions.deployName || deployStackOptions.stack.stackName;
  debug(`${deployName}: checking if we can skip deploy`);

  // Forced deploy
  if (deployStackOptions.force) {
    debug(`${deployName}: forced deployment`);
    return false;
  }

  // Creating changeset only (default true), never skip
  if (deployStackOptions.execute === false) {
    debug(`${deployName}: --no-execute, always creating change set`);
    return false;
  }

  // No existing stack
  if (!cloudFormationStack.exists) {
    debug(`${deployName}: no existing stack`);
    return false;
  }

  // Template has changed (assets taken into account here)
  if (JSON.stringify(deployStackOptions.stack.template) !== JSON.stringify(await cloudFormationStack.template())) {
    debug(`${deployName}: template has changed`);
    return false;
  }

  // Tags have changed
  if (!compareTags(cloudFormationStack.tags, deployStackOptions.tags ?? [])) {
    debug(`${deployName}: tags have changed`);
    return false;
  }

  // Termination protection has been updated
  if (!!deployStackOptions.stack.terminationProtection !== !!cloudFormationStack.terminationProtection) {
    debug(`${deployName}: termination protection has been updated`);
    return false;
  }

  // Parameters have changed
  if (parameterChanges) {
    if (parameterChanges === 'ssm') {
      debug(`${deployName}: some parameters come from SSM so we have to assume they may have changed`);
    } else {
      debug(`${deployName}: parameters have changed`);
    }
    return false;
  }

  // Existing stack is in a failed state
  if (cloudFormationStack.stackStatus.isFailure) {
    debug(`${deployName}: stack is in a failure state`);
    return false;
  }

  // We can skip deploy
  return true;
}

/**
 * Compares two list of tags, returns true if identical.
 */
function compareTags(a: Tag[], b: Tag[]): boolean {
  if (a.length !== b.length) {
    return false;
  }

  for (const aTag of a) {
    const bTag = b.find(tag => tag.Key === aTag.Key);

    if (!bTag || bTag.Value !== aTag.Value) {
      return false;
    }
  }

  return true;
}

/**
 * Format an S3 URL in the manifest for use with CloudFormation
 *
 * Replaces environment placeholders (which this field may contain),
 * and reformats s3://.../... urls into S3 REST URLs (which CloudFormation
 * expects)
 */
function restUrlFromManifest(url: string, environment: cxapi.Environment, sdk: ISDK): string {
  const doNotUseMarker = '**DONOTUSE**';
  // This URL may contain placeholders, so still substitute those.
  url = cxapi.EnvironmentPlaceholders.replace(url, {
    accountId: environment.account,
    region: environment.region,
    partition: doNotUseMarker,
  });

  // Yes, this is extremely crude, but we don't actually need this so I'm not inclined to spend
  // a lot of effort trying to thread the right value to this location.
  if (url.indexOf(doNotUseMarker) > -1) {
    throw new Error('Cannot use \'${AWS::Partition}\' in the \'stackTemplateAssetObjectUrl\' field');
  }

  const s3Url = url.match(/s3:\/\/([^/]+)\/(.*)$/);
  if (!s3Url) { return url; }

  // We need to pass an 'https://s3.REGION.amazonaws.com[.cn]/bucket/object' URL to CloudFormation, but we
  // got an 's3://bucket/object' URL instead. Construct the rest API URL here.
  const bucketName = s3Url[1];
  const objectKey = s3Url[2];

  const urlSuffix: string = sdk.getEndpointSuffix(environment.region);
  return `https://s3.${environment.region}.${urlSuffix}/${bucketName}/${objectKey}`;
}

function suffixWithErrors(msg: string, errors?: string[]) {
  return errors && errors.length > 0
    ? `${msg}: ${errors.join(', ')}`
    : msg;
}
