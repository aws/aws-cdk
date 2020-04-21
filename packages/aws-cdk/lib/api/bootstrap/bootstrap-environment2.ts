import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '@aws-cdk/cx-api';
import * as fs from 'fs-extra';
import * as os from 'os';
import * as path from 'path';
import { DEFAULT_TOOLKIT_STACK_NAME, deployStack, DeployStackResult, ToolkitInfo } from '..';
import { loadStructuredFile } from '../../serialize';
import { Mode, SdkProvider } from '../aws-auth';
import { BootstrapEnvironmentOptions, bootstrapVersionFromTemplate } from './bootstrap-props';

export async function bootstrapEnvironment2(
  environment: cxapi.Environment,
  sdkProvider: SdkProvider,
  options: BootstrapEnvironmentOptions): Promise<DeployStackResult> {

  const props = options.parameters ?? {};
  const toolkitStackName = options.toolkitStackName ?? DEFAULT_TOOLKIT_STACK_NAME;

  if (props.trustedAccounts?.length && !props.cloudFormationExecutionPolicies?.length) {
    throw new Error('--cloudformation-execution-policies are required if --trust has been passed!');
  }

  const resolvedEnvironment = await sdkProvider.resolveEnvironment(environment);
  const sdk = await sdkProvider.forEnvironment(environment, Mode.ForWriting);

  const currentBootstrapStack = await ToolkitInfo.lookup(resolvedEnvironment, sdk, toolkitStackName);

  const outdir = await fs.mkdtemp(path.join(os.tmpdir(), 'cdk-bootstrap-new'));
  const builder = new cxapi.CloudAssemblyBuilder(outdir);

  // convert from YAML to JSON (which the Cloud Assembly uses)
  const templateFile = `${toolkitStackName}.template.json`;
  const bootstrapTemplatePath = path.join(__dirname, 'bootstrap-template.yaml');
  const bootstrapTemplateObject = await loadStructuredFile(bootstrapTemplatePath);
  await fs.writeJson(
    path.join(builder.outdir, templateFile),
    bootstrapTemplateObject);

  const newVersion = bootstrapVersionFromTemplate(bootstrapTemplateObject);
  if (currentBootstrapStack && newVersion < currentBootstrapStack.version && !options.force) {
    throw new Error(`Refusing to downgrade existing bootstrap stack from version '${currentBootstrapStack.version}' to version '${newVersion}'. Use --force to force.`);
  }

  builder.addArtifact(toolkitStackName, {
    type: cxschema.ArtifactType.AWS_CLOUDFORMATION_STACK,
    environment: cxapi.EnvironmentUtils.format(environment.account, environment.region),
    properties: {
      templateFile,
    },
  });

  const assembly = builder.buildAssembly();
  return await deployStack({
    stack: assembly.getStackByName(toolkitStackName),
    resolvedEnvironment,
    sdk,
    sdkProvider,
    roleArn: options.roleArn,
    tags: props.tags,
    execute: props.execute,
    parameters: {
      FileAssetsBucketName: props.bucketName,
      FileAssetsBucketKmsKeyId: props.kmsKeyId,
      TrustedAccounts: props.trustedAccounts?.join(','),
      CloudFormationExecutionPolicies: props.cloudFormationExecutionPolicies?.join(','),
    },
  });
}
