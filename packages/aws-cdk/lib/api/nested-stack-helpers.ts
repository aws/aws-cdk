import * as path from 'path';
import * as cxapi from '@aws-cdk/cx-api';
import * as fs from 'fs-extra';
import { debug } from '../logging';
import { ISDK } from './aws-auth';
import { LazyListStackResources, ListStackResources } from './evaluate-cloudformation-template';
import { CloudFormationStack, Template } from './util/cloudformation';

/**
 * Reads the currently deployed template from CloudFormation and adds a
 * property, `NestedTemplate`, to any nested stacks that appear in either
 * the deployed template or the just synthesized template. `NestedTemplate`
 * is populated with contents of the nested template. This is done for all
 * nested stack resources to arbitrary depths.
 */
export async function loadCurrentTemplateWithNestedStacks(
  rootStackArtifact: cxapi.CloudFormationStackArtifact, sdk: ISDK,
): Promise<TemplateWithNestedStackNames> {
  const deployedTemplate = await loadCurrentTemplate(rootStackArtifact, sdk);
  const nestedStackNames = {};
  await addNestedTemplatesToGeneratedAndDeployedStacks(rootStackArtifact, sdk, {
    generatedTemplate: rootStackArtifact.template,
    deployedTemplate: deployedTemplate,
    deployedStackName: rootStackArtifact.stackName,
  }, nestedStackNames);
  return {
    deployedTemplate,
    nestedStackNames,
  };
}

/**
 * Returns the currently deployed template from CloudFormation that corresponds to `stackArtifact`.
 */
export async function loadCurrentTemplate(stackArtifact: cxapi.CloudFormationStackArtifact, sdk: ISDK): Promise<Template> {
  debug(`Reading existing template for stack ${stackArtifact.displayName}.`);
  return readCurrentStackTemplate(stackArtifact.stackName, sdk);
}

async function readCurrentStackTemplate(stackName: string, sdk: ISDK) : Promise<Template> {
  const cfn = sdk.cloudFormation();
  const stack = await CloudFormationStack.lookup(cfn, stackName);
  return stack.template();
}

async function addNestedTemplatesToGeneratedAndDeployedStacks(
  rootStackArtifact: cxapi.CloudFormationStackArtifact,
  sdk: ISDK,
  parentTemplates: StackTemplates,
  nestedStackNames: { [nestedStackLogicalId: string]: NestedStackNames },
): Promise<void> {
  const listStackResources = parentTemplates.deployedStackName ? new LazyListStackResources(sdk, parentTemplates.deployedStackName) : undefined;
  for (const [nestedStackLogicalId, generatedNestedStackResource] of Object.entries(parentTemplates.generatedTemplate.Resources ?? {})) {
    if (!isCdkManagedNestedStack(generatedNestedStackResource)) {
      continue;
    }

    const assetPath = generatedNestedStackResource.Metadata['aws:asset:path'];
    const nestedStackTemplates = await getNestedStackTemplates(rootStackArtifact, assetPath, nestedStackLogicalId, listStackResources, sdk);

    generatedNestedStackResource.Properties.NestedTemplate = nestedStackTemplates.generatedTemplate;

    const deployedParentTemplate = parentTemplates.deployedTemplate;
    deployedParentTemplate.Resources = deployedParentTemplate.Resources ?? {};
    const deployedNestedStackResource = deployedParentTemplate.Resources[nestedStackLogicalId] ?? {};
    deployedParentTemplate.Resources[nestedStackLogicalId] = deployedNestedStackResource;
    deployedNestedStackResource.Type = deployedNestedStackResource.Type ?? 'AWS::CloudFormation::Stack';
    deployedNestedStackResource.Properties = deployedNestedStackResource.Properties ?? {};
    deployedNestedStackResource.Properties.NestedTemplate = nestedStackTemplates.deployedTemplate;

    nestedStackNames[nestedStackLogicalId] = {
      stackName: nestedStackTemplates.deployedStackName,
      children: {},
    };

    await addNestedTemplatesToGeneratedAndDeployedStacks(
      rootStackArtifact,
      sdk,
      nestedStackTemplates,
      nestedStackNames[nestedStackLogicalId].children,
    );
  }
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
      ? await readCurrentStackTemplate(deployedStackName, sdk)
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
  } catch (e) {
    if (e.message.startsWith('Stack with id ') && e.message.endsWith(' does not exist')) {
      return;
    }
    throw e;
  }
}

function isCdkManagedNestedStack(stackResource: any): stackResource is NestedStackResource {
  return stackResource.Type === 'AWS::CloudFormation::Stack' && stackResource.Metadata && stackResource.Metadata['aws:asset:path'];
}

export interface TemplateWithNestedStackNames {
  readonly deployedTemplate: Template;
  readonly nestedStackNames: { [nestedStackLogicalId: string]: NestedStackNames };
}

export interface NestedStackNames {
  readonly stackName: string | undefined;
  readonly children: { [logicalId: string]: NestedStackNames };
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
