import * as os from 'os';
import * as path from 'path';
import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '@aws-cdk/cx-api';
import * as fs from 'fs-extra';
import { Mode, SdkProvider } from '../aws-auth';
import { deployStack, DeployStackResult } from '../deploy-stack';
import { DEFAULT_TOOLKIT_STACK_NAME, ToolkitInfo } from '../toolkit-info';
import { BOOTSTRAP_VERSION_OUTPUT, BootstrapEnvironmentOptions } from './bootstrap-props';

/**
 * Perform the actual deployment of a bootstrap stack, given a template and some parameters
 */
export async function deployBootstrapStack(
  template: any,
  parameters: Record<string, string | undefined>,
  environment: cxapi.Environment,
  sdkProvider: SdkProvider,
  options: BootstrapEnvironmentOptions): Promise<DeployStackResult> {

  const toolkitStackName = options.toolkitStackName ?? DEFAULT_TOOLKIT_STACK_NAME;

  const resolvedEnvironment = await sdkProvider.resolveEnvironment(environment);
  const sdk = await sdkProvider.forEnvironment(resolvedEnvironment, Mode.ForWriting);

  const newVersion = bootstrapVersionFromTemplate(template);
  const currentBootstrapStack = await ToolkitInfo.lookup(resolvedEnvironment, sdk, toolkitStackName);
  if (currentBootstrapStack && newVersion < currentBootstrapStack.version && !options.force) {
    throw new Error(`Not downgrading existing bootstrap stack from version '${currentBootstrapStack.version}' to version '${newVersion}'. Use --force to force.`);
  }

  const outdir = await fs.mkdtemp(path.join(os.tmpdir(), 'cdk-bootstrap'));
  const builder = new cxapi.CloudAssemblyBuilder(outdir);
  const templateFile = `${toolkitStackName}.template.json`;
  await fs.writeJson(path.join(builder.outdir, templateFile), template, { spaces: 2 });

  builder.addArtifact(toolkitStackName, {
    type: cxschema.ArtifactType.AWS_CLOUDFORMATION_STACK,
    environment: cxapi.EnvironmentUtils.format(environment.account, environment.region),
    properties: {
      templateFile,
      terminationProtection: options.parameters?.terminationProtection ?? false,
    },
  });

  const assembly = builder.buildAssembly();

  return await deployStack({
    stack: assembly.getStackByName(toolkitStackName),
    resolvedEnvironment,
    sdk: await sdkProvider.forEnvironment(resolvedEnvironment, Mode.ForWriting),
    sdkProvider,
    force: options.force,
    roleArn: options.roleArn,
    tags: options.parameters?.tags,
    execute: options?.parameters?.execute,
    parameters,
  });
}

function bootstrapVersionFromTemplate(template: any): number {
  return parseInt(template.Outputs?.[BOOTSTRAP_VERSION_OUTPUT]?.Value ?? '0', 10);
}