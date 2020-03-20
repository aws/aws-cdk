import * as cxapi from '@aws-cdk/cx-api';
import * as colors from 'colors/safe';
import * as uuid from 'uuid';
import { addMetadataAssetsToManifest } from '../assets';
import { Tag } from '../cdk-toolkit';
import { debug, error, print } from '../logging';
import { toYAML } from '../serialize';
import { AssetManifestBuilder } from '../util/asset-manifest-builder';
import { publishAssets } from '../util/asset-publishing';
import { contentHash } from '../util/content-hash';
import { ISDK, SdkProvider } from './aws-auth';
import { ToolkitInfo } from './toolkit-info';
import { changeSetHasNoChanges, CloudFormationStack, waitForChangeSet, waitForStack  } from './util/cloudformation';
import { StackActivityMonitor } from './util/cloudformation/stack-activity-monitor';

type TemplateBodyParameter = {
  TemplateBody?: string
  TemplateURL?: string
};

/** @experimental */
export interface DeployStackResult {
  readonly noOp: boolean;
  readonly outputs: { [name: string]: string };
  readonly stackArn: string;
  readonly stackArtifact: cxapi.CloudFormationStackArtifact;
}

/** @experimental */
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
   * Will be used by asset publishing to assume publishing credentials
   * (which must start out from current credentials regardless of whether
   * we've assumed a role to touch the stack or not)
   */
  sdkProvider: SdkProvider;

  /**
   * Information about the bootstrap stack found in the target environment
   *
   * @default - Assume there is no bootstrap stack
   */
  toolkitInfo?: ToolkitInfo;

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
   * Deploy even if the deployed template is identical to the one we are about to deploy.
   * @default false
   */
  force?: boolean;
}

const LARGE_TEMPLATE_SIZE_KB = 50;

/** @experimental */
export async function deployStack(options: DeployStackOptions): Promise<DeployStackResult> {
  const stackArtifact = options.stack;

  const stackEnv = options.resolvedEnvironment;

  const cfn = options.sdk.cloudFormation();
  const deployName = options.deployName || stackArtifact.stackName;
  let cloudFormationStack = await CloudFormationStack.lookup(cfn, deployName);

  if (!options.force && cloudFormationStack.exists) {
    // bail out if the current template is exactly the same as the one we are about to deploy
    // in cdk-land, this means nothing changed because assets (and therefore nested stacks) are immutable.
    debug(`checking if we can skip this stack based on the currently deployed template and tags (use --force to override)`);
    const tagsIdentical = compareTags(cloudFormationStack.tags, options.tags ?? []);
    if (JSON.stringify(stackArtifact.template) === JSON.stringify(await cloudFormationStack.template()) && tagsIdentical) {
      debug(`${deployName}: no change in template and tags, skipping (use --force to override)`);
      return {
        noOp: true,
        outputs: cloudFormationStack.outputs,
        stackArn: cloudFormationStack.stackId,
        stackArtifact,
      };
    } else {
      debug(`${deployName}: template changed, deploying...`);
    }
  }

  const assets = new AssetManifestBuilder();

  const params = await addMetadataAssetsToManifest(stackArtifact, assets, options.toolkitInfo, options.reuseAssets);

  // add passed CloudFormation parameters
  for (const [paramName, paramValue] of Object.entries((options.parameters || {}))) {
    if (paramValue) {
      params.push({
        ParameterKey: paramName,
        ParameterValue: paramValue,
      });
    }
  }

  const executionId = uuid.v4();

  const bodyParameter = await makeBodyParameter(stackArtifact, options.resolvedEnvironment, assets, options.toolkitInfo);

  if (cloudFormationStack.stackStatus.isCreationFailure) {
    debug(`Found existing stack ${deployName} that had previously failed creation. Deleting it before attempting to re-create it.`);
    await cfn.deleteStack({ StackName: deployName }).promise();
    const deletedStack = await waitForStack(cfn, deployName, false);
    if (deletedStack && deletedStack.stackStatus.name !== 'DELETE_COMPLETE') {
      throw new Error(`Failed deleting stack ${deployName} that had previously failed creation (current state: ${deletedStack.stackStatus})`);
    }
  }

  await publishAssets(assets.toManifest(stackArtifact.assembly.directory), options.sdkProvider, stackEnv);

  const changeSetName = `CDK-${executionId}`;
  const update = cloudFormationStack.exists;

  debug(`Attempting to create ChangeSet ${changeSetName} to ${update ? 'update' : 'create'} stack ${deployName}`);
  print(`%s: creating CloudFormation changeset...`, colors.bold(deployName));
  const changeSet = await cfn.createChangeSet({
    StackName: deployName,
    ChangeSetName: changeSetName,
    ChangeSetType: update ? 'UPDATE' : 'CREATE',
    Description: `CDK Changeset for execution ${executionId}`,
    TemplateBody: bodyParameter.TemplateBody,
    TemplateURL: bodyParameter.TemplateURL,
    Parameters: params,
    RoleARN: options.roleArn,
    NotificationARNs: options.notificationArns,
    Capabilities: [ 'CAPABILITY_IAM', 'CAPABILITY_NAMED_IAM', 'CAPABILITY_AUTO_EXPAND' ],
    Tags: options.tags
  }).promise();
  debug('Initiated creation of changeset: %s; waiting for it to finish creating...', changeSet.Id);
  const changeSetDescription = await waitForChangeSet(cfn, deployName, changeSetName);

  if (changeSetHasNoChanges(changeSetDescription)) {
    debug('No changes are to be performed on %s.', deployName);
    await cfn.deleteChangeSet({ StackName: deployName, ChangeSetName: changeSetName }).promise();
    return { noOp: true, outputs: cloudFormationStack.outputs, stackArn: changeSet.StackId!, stackArtifact };
  }

  const execute = options.execute === undefined ? true : options.execute;
  if (execute) {
    debug('Initiating execution of changeset %s on stack %s', changeSetName, deployName);
    await cfn.executeChangeSet({StackName: deployName, ChangeSetName: changeSetName}).promise();
    // tslint:disable-next-line:max-line-length
    const monitor = options.quiet ? undefined : new StackActivityMonitor(cfn, deployName, stackArtifact, (changeSetDescription.Changes || []).length).start();
    debug('Execution of changeset %s on stack %s has started; waiting for the update to complete...', changeSetName, deployName);
    try {
      const finalStack = await waitForStack(cfn, deployName);
      if (!finalStack) { throw new Error('Stack deploy failed'); } // This should only happen very rarely
      cloudFormationStack = finalStack;
    } finally {
      await monitor?.stop();
    }
    debug('Stack %s has completed updating', deployName);
  } else {
    print(`Changeset %s created and waiting in review for manual execution (--no-execute)`, changeSetName);
  }
  return { noOp: false, outputs: cloudFormationStack.outputs, stackArn: changeSet.StackId!, stackArtifact };
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
  toolkitInfo?: ToolkitInfo): Promise<TemplateBodyParameter> {
  const templateJson = toYAML(stack.template);

  if (templateJson.length <= LARGE_TEMPLATE_SIZE_KB * 1024) {
    return { TemplateBody: templateJson };
  }

  if (!toolkitInfo) {
    error(
      `The template for stack "${stack.displayName}" is ${Math.round(templateJson.length / 1024)}KiB. ` +
      `Templates larger than ${LARGE_TEMPLATE_SIZE_KB}KiB must be uploaded to S3.\n` +
      'Run the following command in order to setup an S3 bucket in this environment, and then re-deploy:\n\n',
      colors.blue(`\t$ cdk bootstrap ${resolvedEnvironment.name}\n`));

    throw new Error(`Template too large to deploy ("cdk bootstrap" is required)`);
  }

  const templateHash = contentHash(templateJson);
  const key = `cdk/${stack.id}/${templateHash}.yml`;
  const templateURL = `${toolkitInfo.bucketUrl}/${key}`;

  assetManifest.addFileAsset(templateHash, {
    path: stack.templateFile,
  }, {
    bucketName: toolkitInfo.bucketName,
    objectKey: key,
  });

  debug('Storing template in S3 at:', templateURL);
  return { TemplateURL: templateURL };
}

/** @experimental */
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

/** @experimental */
export async function destroyStack(options: DestroyStackOptions) {
  const deployName = options.deployName || options.stack.stackName;
  const cfn = options.sdk.cloudFormation();

  const currentStack = await CloudFormationStack.lookup(cfn, deployName);
  if (!currentStack.exists) {
    return;
  }
  const monitor = options.quiet ? undefined : new StackActivityMonitor(cfn, deployName, options.stack).start();
  try {
    await cfn.deleteStack({ StackName: deployName, RoleARN: options.roleArn }).promise();
    const destroyedStack = await waitForStack(cfn, deployName, false);
    if (destroyedStack && destroyedStack.stackStatus.name !== 'DELETE_COMPLETE') {
      throw new Error(`Failed to destroy ${deployName}: ${destroyedStack.stackStatus}`);
    }
  } finally {
    if (monitor) { await monitor.stop(); }
  }
}

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