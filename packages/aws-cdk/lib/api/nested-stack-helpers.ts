import * as path from 'path';
import type { CloudFormationStackArtifact } from '@aws-cdk/cx-api';
import * as fs from 'fs-extra';
import type { SDK } from './aws-auth';
import { LazyListStackResources, type ListStackResources } from './evaluate-cloudformation-template';
import { CloudFormationStack, type Template } from './util/cloudformation';
import { formatErrorMessage } from '../util/error';

export interface NestedStackTemplates {
  readonly physicalName: string | undefined;
  readonly deployedTemplate: Template;
  readonly generatedTemplate: Template;
  readonly nestedStackTemplates: {
    [nestedStackLogicalId: string]: NestedStackTemplates;
  };
}

export interface RootTemplateWithNestedStacks {
  readonly deployedRootTemplate: Template;
  readonly nestedStacks: {
    [nestedStackLogicalId: string]: NestedStackTemplates;
  };
}

/**
 * Reads the currently deployed template and all of its nested stack templates from CloudFormation.
 */
export async function loadCurrentTemplateWithNestedStacks(
  rootStackArtifact: CloudFormationStackArtifact,
  sdk: SDK,
  retrieveProcessedTemplate: boolean = false,
): Promise<RootTemplateWithNestedStacks> {
  const deployedRootTemplate = await loadCurrentTemplate(rootStackArtifact, sdk, retrieveProcessedTemplate);
  const nestedStacks = await loadNestedStacks(rootStackArtifact, sdk, {
    generatedTemplate: rootStackArtifact.template,
    deployedTemplate: deployedRootTemplate,
    deployedStackName: rootStackArtifact.stackName,
  });

  return {
    deployedRootTemplate,
    nestedStacks,
  };
}

/**
 * Returns the currently deployed template from CloudFormation that corresponds to `stackArtifact`.
 */
export async function loadCurrentTemplate(
  stackArtifact: CloudFormationStackArtifact,
  sdk: SDK,
  retrieveProcessedTemplate: boolean = false,
): Promise<Template> {
  return loadCurrentStackTemplate(stackArtifact.stackName, sdk, retrieveProcessedTemplate);
}

async function loadCurrentStackTemplate(
  stackName: string,
  sdk: SDK,
  retrieveProcessedTemplate: boolean = false,
): Promise<Template> {
  const cfn = sdk.cloudFormation();
  const stack = await CloudFormationStack.lookup(cfn, stackName, retrieveProcessedTemplate);
  return stack.template();
}

async function loadNestedStacks(
  rootStackArtifact: CloudFormationStackArtifact,
  sdk: SDK,
  parentTemplates: StackTemplates,
): Promise<{ [nestedStackLogicalId: string]: NestedStackTemplates }> {
  const listStackResources = parentTemplates.deployedStackName
    ? new LazyListStackResources(sdk, parentTemplates.deployedStackName)
    : undefined;
  const nestedStacks: { [nestedStackLogicalId: string]: NestedStackTemplates } = {};
  for (const [nestedStackLogicalId, generatedNestedStackResource] of Object.entries(
    parentTemplates.generatedTemplate.Resources ?? {},
  )) {
    if (!isCdkManagedNestedStack(generatedNestedStackResource)) {
      continue;
    }

    const assetPath = generatedNestedStackResource.Metadata['aws:asset:path'];
    const nestedStackTemplates = await getNestedStackTemplates(
      rootStackArtifact,
      assetPath,
      nestedStackLogicalId,
      listStackResources,
      sdk,
    );

    nestedStacks[nestedStackLogicalId] = {
      deployedTemplate: nestedStackTemplates.deployedTemplate,
      generatedTemplate: nestedStackTemplates.generatedTemplate,
      physicalName: nestedStackTemplates.deployedStackName,
      nestedStackTemplates: await loadNestedStacks(rootStackArtifact, sdk, nestedStackTemplates),
    };
  }

  return nestedStacks;
}

async function getNestedStackTemplates(
  rootStackArtifact: CloudFormationStackArtifact,
  nestedTemplateAssetPath: string,
  nestedStackLogicalId: string,
  listStackResources: ListStackResources | undefined,
  sdk: SDK,
): Promise<StackTemplates> {
  const nestedTemplatePath = path.join(rootStackArtifact.assembly.directory, nestedTemplateAssetPath);

  // CFN generates the nested stack name in the form `ParentStackName-NestedStackLogicalID-SomeHashWeCan'tCompute,
  // the arn is of the form: arn:aws:cloudformation:region:123456789012:stack/NestedStackName/AnotherHashWeDon'tNeed
  // so we get the ARN and manually extract the name.
  const nestedStackArn = await getNestedStackArn(nestedStackLogicalId, listStackResources);
  const deployedStackName = nestedStackArn?.slice(nestedStackArn.indexOf('/') + 1, nestedStackArn.lastIndexOf('/'));

  return {
    generatedTemplate: JSON.parse(fs.readFileSync(nestedTemplatePath, 'utf-8')),
    deployedTemplate: deployedStackName ? await loadCurrentStackTemplate(deployedStackName, sdk) : {},
    deployedStackName,
  };
}

async function getNestedStackArn(
  nestedStackLogicalId: string,
  listStackResources?: ListStackResources,
): Promise<string | undefined> {
  try {
    const stackResources = await listStackResources?.listStackResources();
    return stackResources?.find((sr) => sr.LogicalResourceId === nestedStackLogicalId)?.PhysicalResourceId;
  } catch (e: any) {
    if (formatErrorMessage(e).startsWith('Stack with id ') && formatErrorMessage(e).endsWith(' does not exist')) {
      return;
    }
    throw e;
  }
}

function isCdkManagedNestedStack(stackResource: any): stackResource is NestedStackResource {
  return (
    stackResource.Type === 'AWS::CloudFormation::Stack' &&
    stackResource.Metadata &&
    stackResource.Metadata['aws:asset:path']
  );
}

interface StackTemplates {
  readonly generatedTemplate: any;
  readonly deployedTemplate: any;
  readonly deployedStackName: string | undefined;
}

interface NestedStackResource {
  readonly Metadata: { 'aws:asset:path': string };
  readonly Properties: any;
}
