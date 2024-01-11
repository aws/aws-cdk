import * as path from 'path';
import * as cxapi from '@aws-cdk/cx-api';
import { CloudFormation } from 'aws-sdk';
import * as fs from 'fs-extra';
import { ISDK } from './aws-auth';
import { LazyListStackResources, ListStackResources } from './evaluate-cloudformation-template';
import { CloudFormationStack, Template } from './util/cloudformation';

export interface NestedStackTemplates {
  readonly physicalName: string | undefined;
  readonly deployedTemplate: Template
  readonly generatedTemplate: Template
  readonly nestedStackTemplates: { [nestedStackLogicalId: string]: NestedStackTemplates}
}

export interface RootTemplateWithNestedStacks {
  readonly deployedRootTemplate: Template;
  readonly nestedStacks: { [nestedStackLogicalId: string]: NestedStackTemplates };
  readonly nestedStackCount: number;
}

export type NestedChangeSet = CloudFormation.DescribeChangeSetOutput & {
  Changes?: CloudFormation.Changes & {
    ResourceChange?: {
      NestedChanges?: CloudFormation.DescribeChangeSetOutput | NestedChangeSet,
    },
  }[],
};

/**
 * Reads the currently deployed template from CloudFormation and adds a
 * property, `NestedTemplate`, to any nested stacks that appear in either
 * the deployed template or the newly synthesized template. `NestedTemplate`
 * is populated with contents of the nested template by mutating the
 * `template` property of `rootStackArtifact`. This is done for all
 * nested stack resources to arbitrary depths.
 */
export async function loadCurrentTemplateWithNestedStacks(
  rootStackArtifact: cxapi.CloudFormationStackArtifact, sdk: ISDK,
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
    nestedStackCount: flattenNestedStackNames(nestedStacks).length,
    nestedStacks,
  };
}

export function flattenNestedStackNames(nestedStackNames: { [nestedStackLogicalId: string]: NestedStackTemplates }): string[] {
  const nameList = [];
  for (const key of Object.keys(nestedStackNames)) {
    nameList.push(key);

    if (Object.keys(nestedStackNames[key].nestedStackTemplates).length !== 0) {
      flattenNestedStacksHelper(nestedStackNames[key].nestedStackTemplates, nameList);
    }
  }

  return nameList;
}

/**
 * Returns the currently deployed template from CloudFormation that corresponds to `stackArtifact`.
 */
export async function loadCurrentTemplate(
  stackArtifact: cxapi.CloudFormationStackArtifact, sdk: ISDK,
  retrieveProcessedTemplate: boolean = false,
): Promise<Template> {
  return loadCurrentStackTemplate(stackArtifact.stackName, sdk, retrieveProcessedTemplate);
}

/**
 * inlines changesets of all nested stacks in rootChangeSet into rootChangeSet
 */
export async function populateNestedChangeSet(rootChangeSet: NestedChangeSet, cfn: CloudFormation) {
  const changes = rootChangeSet.Changes;
  if (changes) {
    for (const change of changes) {
      if (change.Type === 'Resource' && change.ResourceChange) {
        if (change.ResourceChange && change.ResourceChange.ResourceType === 'AWS::CloudFormation::Stack') {
          const nestedChangeSetId = change.ResourceChange.ChangeSetId;
          const nestedChangeSet = await cfn.describeChangeSet({
            ChangeSetName: nestedChangeSetId!,
          }).promise();
          await populateNestedChangeSet(nestedChangeSet, cfn);
          change.ResourceChange.NestedChanges = nestedChangeSet;
        }
      }
    }
  }
}

async function loadCurrentStackTemplate(
  stackName: string, sdk: ISDK, retrieveProcessedTemplate: boolean = false,
) : Promise<Template> {
  const cfn = sdk.cloudFormation();
  const stack = await CloudFormationStack.lookup(cfn, stackName, retrieveProcessedTemplate);
  return stack.template();
}

async function loadNestedStacks(
  rootStackArtifact: cxapi.CloudFormationStackArtifact,
  sdk: ISDK,
  parentTemplates: StackTemplates,
): Promise<{ [nestedStackLogicalId: string]: NestedStackTemplates }> {
  const listStackResources = parentTemplates.deployedStackName ? new LazyListStackResources(sdk, parentTemplates.deployedStackName) : undefined;
  const nestedStacks: { [nestedStackLogicalId: string]: NestedStackTemplates } = {};
  for (const [nestedStackLogicalId, generatedNestedStackResource] of Object.entries(parentTemplates.generatedTemplate.Resources ?? {})) {
    if (!isCdkManagedNestedStack(generatedNestedStackResource)) {
      continue;
    }

    const assetPath = generatedNestedStackResource.Metadata['aws:asset:path'];
    const nestedStackTemplates = await getNestedStackTemplates(rootStackArtifact, assetPath, nestedStackLogicalId, listStackResources, sdk);

    nestedStacks[nestedStackLogicalId] = {
      deployedTemplate: nestedStackTemplates.deployedTemplate,
      generatedTemplate: nestedStackTemplates.generatedTemplate,
      physicalName: nestedStackTemplates.deployedStackName,
      nestedStackTemplates: await loadNestedStacks(
        rootStackArtifact,
        sdk,
        nestedStackTemplates,
      ),
    };

    /*
    generatedNestedStackResource.Properties.NestedTemplate = nestedStackTemplates.generatedTemplate;

    const deployedParentTemplate = parentTemplates.deployedTemplate;
    deployedParentTemplate.Resources = deployedParentTemplate.Resources ?? {};
    const deployedNestedStackResource = deployedParentTemplate.Resources[nestedStackLogicalId] ?? {};
    deployedParentTemplate.Resources[nestedStackLogicalId] = deployedNestedStackResource;
    deployedNestedStackResource.Type = deployedNestedStackResource.Type ?? 'AWS::CloudFormation::Stack';
    deployedNestedStackResource.Properties = deployedNestedStackResource.Properties ?? {};
    deployedNestedStackResource.Properties.NestedTemplate = nestedStackTemplates.deployedTemplate;

    nestedStacks[nestedStackLogicalId] = {
      nestedStackPhysicalName: nestedStackTemplates.deployedStackName,
      nestedStacks: await loadNestedStacks(
        rootStackArtifact,
        sdk,
        nestedStackTemplates,
      ),
    };
    */
  }

  return nestedStacks;
}

async function getNestedStackTemplates(
  rootStackArtifact: cxapi.CloudFormationStackArtifact, nestedTemplateAssetPath: string, nestedStackLogicalId: string,
  listStackResources: ListStackResources | undefined, sdk: ISDK,
): Promise<StackTemplates> {
  const nestedTemplatePath = path.join(rootStackArtifact.assembly.directory, nestedTemplateAssetPath);

  // CFN generates the nested stack name in the form `ParentStackName-NestedStackLogicalID-SomeHashWeCan'tCompute,
  // the arn is of the form: arn:aws:cloudformation:region:123456789012:stack/NestedStackName/AnotherHashWeDon'tNeed
  // so we get the ARN and manually extract the name.
  const nestedStackArn = await getNestedStackArn(nestedStackLogicalId, listStackResources);
  const deployedStackName = nestedStackArn?.slice(nestedStackArn.indexOf('/') + 1, nestedStackArn.lastIndexOf('/'));

  return {
    generatedTemplate: JSON.parse(fs.readFileSync(nestedTemplatePath, 'utf-8')),
    deployedTemplate: deployedStackName
      ? await loadCurrentStackTemplate(deployedStackName, sdk)
      : {},
    deployedStackName,
  };
}

async function getNestedStackArn(
  nestedStackLogicalId: string, listStackResources?: ListStackResources,
): Promise<string | undefined> {
  try {
    const stackResources = await listStackResources?.listStackResources();
    return stackResources?.find(sr => sr.LogicalResourceId === nestedStackLogicalId)?.PhysicalResourceId;
  } catch (e: any) {
    if (e.message.startsWith('Stack with id ') && e.message.endsWith(' does not exist')) {
      return;
    }
    throw e;
  }
}

function isCdkManagedNestedStack(stackResource: any): stackResource is NestedStackResource {
  return stackResource.Type === 'AWS::CloudFormation::Stack' && stackResource.Metadata && stackResource.Metadata['aws:asset:path'];
}

function flattenNestedStacksHelper(nestedStackNames: { [nestedStackLogicalId: string]: NestedStackTemplates }, nameList: string[]) {
  for (const key of Object.keys(nestedStackNames)) {
    nameList.push(key);

    if (Object.keys(nestedStackNames[key].nestedStackTemplates).length !== 0) {
      flattenNestedStacksHelper(nestedStackNames[key].nestedStackTemplates, nameList);
    }
  }
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
