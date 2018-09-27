import cxapi = require('@aws-cdk/cx-api');
import aws = require('aws-sdk');
import colors = require('colors/safe');
import uuid = require('uuid');
import YAML = require('yamljs');
import { prepareAssets } from '../assets';
import { debug, error } from '../logging';
import { Mode } from './aws-auth/credentials';
import { ToolkitInfo } from './toolkit-info';
import { describeStack, stackExists, waitForChangeSet, waitForStack } from './util/cloudformation';
import { StackActivityMonitor } from './util/cloudformation/stack-activity-monitor';
import { StackStatus } from './util/cloudformation/stack-status';
import { SDK } from './util/sdk';

type TemplateBodyParameter = {
  TemplateBody?: string
  TemplateURL?: string
};

export interface DeployStackResult {
  readonly noOp: boolean;
  readonly outputs: { [name: string]: string };
  readonly stackArn: string;
}

export async function deployStack(stack: cxapi.SynthesizedStack,
                                  sdk: SDK,
                                  toolkitInfo?: ToolkitInfo,
                                  deployName?: string,
                                  quiet: boolean = false): Promise<DeployStackResult> {
  if (!stack.environment) {
    throw new Error(`The stack ${stack.name} does not have an environment`);
  }

  const params = await prepareAssets(stack, toolkitInfo);

  deployName = deployName || stack.name;

  const executionId = uuid.v4();

  const cfn = await sdk.cloudFormation(stack.environment, Mode.ForWriting);
  const bodyParameter = await makeBodyParameter(stack, toolkitInfo);

  const update = await stackExists(cfn, deployName);

  const changeSetName = `CDK-${executionId}`;
  debug(`Attempting to create ChangeSet ${changeSetName} to ${update ? 'update' : 'create'} stack ${deployName}`);
  const changeSet = await cfn.createChangeSet({
    StackName: deployName,
    ChangeSetName: changeSetName,
    ChangeSetType: update ? 'UPDATE' : 'CREATE',
    Description: `CDK Changeset for execution ${executionId}`,
    TemplateBody: bodyParameter.TemplateBody,
    TemplateURL: bodyParameter.TemplateURL,
    Parameters: params,
    Capabilities: [ 'CAPABILITY_IAM', 'CAPABILITY_NAMED_IAM' ]
  }).promise();
  debug('Initiated creation of changeset: %s; waiting for it to finish creating...', changeSet.Id);
  const changeSetDescription = await waitForChangeSet(cfn, deployName, changeSetName);
  if (!changeSetDescription || !changeSetDescription.Changes || changeSetDescription.Changes.length === 0) {
    debug('No changes are to be performed on %s, assuming success.', deployName);
    await cfn.deleteChangeSet({ StackName: deployName, ChangeSetName: changeSetName }).promise();
    return { noOp: true, outputs: await getStackOutputs(cfn, deployName), stackArn: changeSet.StackId! };
  }

  debug('Initiating execution of changeset %s on stack %s', changeSetName, deployName);
  await cfn.executeChangeSet({ StackName: deployName, ChangeSetName: changeSetName }).promise();
  const monitor = quiet ? undefined : new StackActivityMonitor(cfn, deployName, stack.metadata, changeSetDescription.Changes.length).start();
  debug('Execution of changeset %s on stack %s has started; waiting for the update to complete...', changeSetName, deployName);
  await waitForStack(cfn, deployName);
  if (monitor) { monitor.stop(); }
  debug('Stack %s has completed updating', deployName);
  return { noOp: false, outputs: await getStackOutputs(cfn, deployName), stackArn: changeSet.StackId! };
}

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
 * Prepares the body parameter for +CreateChangeSet+, putting the generated CloudFormation template in the toolkit-provided
 * S3 bucket if present, otherwise using in-line template argument. If no +ToolkitInfo+ is provided and the template is
 * larger than 50,200 bytes, an +Error+ will be raised.
 *
 * @param stack     the synthesized stack that provides the CloudFormation template
 * @param sdk     an AWS SDK to use when interacting with S3
 * @param toolkitInfo information about the toolkit stack
 */
async function makeBodyParameter(stack: cxapi.SynthesizedStack, toolkitInfo?: ToolkitInfo): Promise<TemplateBodyParameter> {
  const templateJson = YAML.stringify(stack.template, 16, 4);
  if (toolkitInfo) {
    const s3KeyPrefix = `cdk/${stack.name}/`;
    const s3KeySuffix = '.yml';
    const { key } = await toolkitInfo.uploadIfChanged(templateJson, {
      s3KeyPrefix, s3KeySuffix, contentType: 'application/x-yaml'
    });
    const templateURL = `${toolkitInfo.bucketUrl}/${key}`;
    debug('Stored template in S3 at:', templateURL);
    return { TemplateURL: templateURL };
  } else if (templateJson.length > 51_200) {
    error('The template for stack %s is %d bytes long, a CDK Toolkit stack is required for deployment of templates larger than 51,200 bytes. ' +
        'A CDK Toolkit stack can be created using %s',
        stack.name, templateJson.length, colors.blue(`cdk bootstrap '${stack.environment!.name}'`));
    throw new Error(`The template for stack ${stack.name} is larger than 50,200 bytes, and no CDK Toolkit info was provided`);
  } else {
    return { TemplateBody: templateJson };
  }
}

export async function destroyStack(stack: cxapi.StackInfo, sdk: SDK, deployName?: string, quiet: boolean = false) {
  if (!stack.environment) {
    throw new Error(`The stack ${stack.name} does not have an environment`);
  }

  deployName = deployName || stack.name;
  const cfn = await sdk.cloudFormation(stack.environment, Mode.ForWriting);
  if (!await stackExists(cfn, deployName)) {
    return;
  }
  const monitor = quiet ? undefined : new StackActivityMonitor(cfn, deployName).start();
  await cfn.deleteStack({ StackName: deployName }).promise().catch(e => { throw e; });
  const destroyedStack = await waitForStack(cfn, deployName, false);
  if (monitor) { monitor.stop(); }
  if (destroyedStack && destroyedStack.StackStatus !== 'DELETE_COMPLETE') {
    const status = StackStatus.fromStackDescription(destroyedStack);
    throw new Error(`Failed to destroy ${deployName}: ${status}`);
  }
  return;
}
