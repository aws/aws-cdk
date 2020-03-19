import * as cxapi from '@aws-cdk/cx-api';
import * as aws from 'aws-sdk';
import * as colors from 'colors/safe';
import * as uuid from 'uuid';
import { Tag } from "../api/cxapp/stacks";
import { addMetadataAssetsToManifest } from '../assets';
import { debug, error, print } from '../logging';
import { deserializeStructure, toYAML } from '../serialize';
import { AssetManifestBuilder } from '../util/asset-manifest-builder';
import { publishAssets } from '../util/asset-publishing';
import { contentHash } from '../util/content-hash';
import { SdkProvider } from './aws-auth';
import { Mode } from './aws-auth/credentials';
import { ToolkitInfo } from './toolkit-info';
import { changeSetHasNoChanges, describeStack, stackExists, stackFailedCreating, waitForChangeSet, waitForStack  } from './util/cloudformation';
import { StackActivityMonitor } from './util/cloudformation/stack-activity-monitor';
import { StackStatus } from './util/cloudformation/stack-status';

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
  stack: cxapi.CloudFormationStackArtifact;
  sdk: SdkProvider;
  toolkitInfo?: ToolkitInfo;
  roleArn?: string;
  notificationArns?: string[];
  deployName?: string;
  quiet?: boolean;
  reuseAssets?: string[];
  tags?: Tag[];

  /**
   * Whether to execute the changeset or leave it in review.
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
  const stack = options.stack;

  if (!stack.environment) {
    throw new Error(`The stack ${stack.displayName} does not have an environment`);
  }

  // Translate symbolic/unknown environment references to concrete environment references
  const stackEnv = await options.sdk.resolveEnvironment(stack.environment.account, stack.environment.region);

  const cfn = (await options.sdk.forEnvironment(stackEnv.account, stackEnv.region, Mode.ForWriting)).cloudFormation();
  const deployName = options.deployName || stack.stackName;

  if (!options.force) {
    // bail out if the current template is exactly the same as the one we are about to deploy
    // in cdk-land, this means nothing changed because assets (and therefore nested stacks) are immutable.
    debug(`checking if we can skip this stack based on the currently deployed template and tags (use --force to override)`);
    const deployed = await getDeployedStack(cfn, deployName);
    const tagsIdentical = compareTags(deployed?.tags ?? [], options.tags ?? []);
    if (deployed && JSON.stringify(stack.template) === JSON.stringify(deployed.template) && tagsIdentical) {
      debug(`${deployName}: no change in template and tags, skipping (use --force to override)`);
      return {
        noOp: true,
        outputs: await getStackOutputs(cfn, deployName),
        stackArn: deployed.stackId,
        stackArtifact: stack
      };
    } else {
      debug(`${deployName}: template changed, deploying...`);
    }
  }

  const assets = new AssetManifestBuilder();

  const params = await addMetadataAssetsToManifest(stack, assets, options.toolkitInfo, options.reuseAssets);

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

  const bodyParameter = await makeBodyParameter(stack, assets, options.toolkitInfo);

  if (await stackFailedCreating(cfn, deployName)) {
    debug(`Found existing stack ${deployName} that had previously failed creation. Deleting it before attempting to re-create it.`);
    await cfn.deleteStack({ StackName: deployName }).promise();
    const deletedStack = await waitForStack(cfn, deployName, false);
    if (deletedStack && deletedStack.StackStatus !== 'DELETE_COMPLETE') {
      throw new Error(`Failed deleting stack ${deployName} that had previously failed creation (current state: ${deletedStack.StackStatus})`);
    }
  }

  const update = await stackExists(cfn, deployName);

  await publishAssets(assets.toManifest(stack.assembly.directory), options.sdk, stackEnv);

  const changeSetName = `CDK-${executionId}`;
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
    return { noOp: true, outputs: await getStackOutputs(cfn, deployName), stackArn: changeSet.StackId!, stackArtifact: stack };
  }

  const execute = options.execute === undefined ? true : options.execute;
  if (execute) {
    debug('Initiating execution of changeset %s on stack %s', changeSetName, deployName);
    await cfn.executeChangeSet({StackName: deployName, ChangeSetName: changeSetName}).promise();
    // tslint:disable-next-line:max-line-length
    const monitor = options.quiet ? undefined : new StackActivityMonitor(cfn, deployName, stack, (changeSetDescription.Changes || []).length).start();
    debug('Execution of changeset %s on stack %s has started; waiting for the update to complete...', changeSetName, deployName);
    try {
      await waitForStack(cfn, deployName);
    } finally {
      await monitor?.stop();
    }
    debug('Stack %s has completed updating', deployName);
  } else {
    print(`Changeset %s created and waiting in review for manual execution (--no-execute)`, changeSetName);
  }
  return { noOp: false, outputs: await getStackOutputs(cfn, deployName), stackArn: changeSet.StackId!, stackArtifact: stack };
}

/** @experimental */
async function getStackOutputs(cfn: aws.CloudFormation, stackName: string): Promise<{ [name: string]: string }> {
  const description = await describeStack(cfn, stackName);
  const result: { [name: string]: string } = {};
  if (description && description.Outputs) {
    description.Outputs.forEach(output => {
      result[output.OutputKey!] = output.OutputValue!;
    });
  }
  return result;
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
      colors.blue(`\t$ cdk bootstrap ${stack.environment!.name}\n`));

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
  stack: cxapi.CloudFormationStackArtifact;
  sdk: SdkProvider;
  roleArn?: string;
  deployName?: string;
  quiet?: boolean;
}

/** @experimental */
export async function destroyStack(options: DestroyStackOptions) {
  if (!options.stack.environment) {
    throw new Error(`The stack ${options.stack.displayName} does not have an environment`);
  }

  const deployName = options.deployName || options.stack.stackName;
  const { account, region } = options.stack.environment;
  const cfn = (await options.sdk.forEnvironment(account, region, Mode.ForWriting)).cloudFormation();
  if (!await stackExists(cfn, deployName)) {
    return;
  }
  const monitor = options.quiet ? undefined : new StackActivityMonitor(cfn, deployName, options.stack).start();
  await cfn.deleteStack({ StackName: deployName, RoleARN: options.roleArn }).promise().catch(e => { throw e; });
  const destroyedStack = await waitForStack(cfn, deployName, false);
  if (monitor) { await monitor.stop(); }
  if (destroyedStack && destroyedStack.StackStatus !== 'DELETE_COMPLETE') {
    const status = StackStatus.fromStackDescription(destroyedStack);
    throw new Error(`Failed to destroy ${deployName}: ${status}`);
  }
  return;
}

async function getDeployedStack(cfn: aws.CloudFormation, stackName: string): Promise<{ stackId: string, template: any, tags: Tag[] } | undefined> {
  const stack = await getStack(cfn, stackName);
  if (!stack) {
    return undefined;
  }

  if (!stack.StackId) {
    return undefined;
  }

  const template = await readCurrentTemplate(cfn, stackName);
  return {
    stackId: stack.StackId,
    tags: stack.Tags ?? [],
    template
  };
}

export async function readCurrentTemplate(cfn: aws.CloudFormation, stackName: string) {
  try {
    const response = await cfn.getTemplate({ StackName: stackName, TemplateStage: 'Processed' }).promise();
    return (response.TemplateBody && deserializeStructure(response.TemplateBody)) || {};
  } catch (e) {
    if (e.code === 'ValidationError' && e.message === `Stack with id ${stackName} does not exist`) {
      return {};
    } else {
      throw e;
    }
  }
}

async function getStack(cfn: aws.CloudFormation, stackName: string): Promise<aws.CloudFormation.Stack | undefined> {
  try {
    const stacks = await cfn.describeStacks({ StackName: stackName }).promise();
    if (!stacks.Stacks) {
      return undefined;
    }
    if (stacks.Stacks.length !== 1) {
      return undefined;
    }

    return stacks.Stacks[0];

  } catch (e) {
    if (e.message.includes('does not exist')) {
      return undefined;
    }
    throw e;
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
