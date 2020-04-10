import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '@aws-cdk/cx-api';
import * as fs from 'fs-extra';
import * as os from 'os';
import * as path from 'path';
import { BootstrapEnvironmentProps, deployStack, DeployStackResult } from '..';
import { loadStructuredFile } from '../../serialize';
import { Mode, SdkProvider } from '../aws-auth';

export async function bootstrapEnvironment2(
  environment: cxapi.Environment, sdkProvider: SdkProvider,
  toolkitStackName: string, roleArn: string | undefined,
  props: BootstrapEnvironmentProps = {}): Promise<DeployStackResult> {
  if (props.trustedAccounts?.length && !props.cloudFormationExecutionPolicies?.length) {
    throw new Error('--cloudformation-execution-policies are required if --trust has been passed!');
  }

  const outdir = await fs.mkdtemp(path.join(os.tmpdir(), 'cdk-bootstrap-new'));
  const builder = new cxapi.CloudAssemblyBuilder(outdir);

  // convert from YAML to JSON (which the Cloud Assembly uses)
  const templateFile = `${toolkitStackName}.template.json`;
  const bootstrapTemplatePath = path.join(__dirname, 'bootstrap-template.yaml');
  const bootstrapTemplateObject = await loadStructuredFile(bootstrapTemplatePath);
  await fs.writeJson(
    path.join(builder.outdir, templateFile),
    bootstrapTemplateObject);

  builder.addArtifact(toolkitStackName, {
    type: cxschema.ArtifactType.AWS_CLOUDFORMATION_STACK,
    environment: cxapi.EnvironmentUtils.format(environment.account, environment.region),
    properties: {
      templateFile,
    },
  });

  const resolvedEnvironment = await sdkProvider.resolveEnvironment(environment.account, environment.region);

  const assembly = builder.buildAssembly();
  return await deployStack({
    stack: assembly.getStackByName(toolkitStackName),
    resolvedEnvironment,
    sdk: await sdkProvider.forEnvironment(environment.account, environment.region, Mode.ForWriting),
    sdkProvider,
    roleArn,
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
