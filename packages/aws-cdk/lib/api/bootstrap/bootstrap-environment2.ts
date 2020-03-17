import * as cxapi from '@aws-cdk/cx-api';
import * as cxprotocol from '@aws-cdk/cloud-assembly-schema';
import * as fs from 'fs-extra';
import * as os from 'os';
import * as path from 'path';
import { BootstrapEnvironmentProps, deployStack, DeployStackResult } from '..';
import { SdkProvider } from '../aws-auth';

export async function bootstrapEnvironment2(environment: cxapi.Environment, sdk: SdkProvider,
                                            toolkitStackName: string, roleArn: string | undefined,
                                            props: BootstrapEnvironmentProps = {}): Promise<DeployStackResult> {
  if (props.trustedAccounts?.length && !props.cloudFormationExecutionPolicies?.length) {
    throw new Error('--cloudformation-execution-policies are required if --trust has been passed!');
  }

  const outdir = await fs.mkdtemp(path.join(os.tmpdir(), 'cdk-bootstrap-new'));
  const builder = new cxapi.CloudAssemblyBuilder(outdir);
  const templateFile = `${toolkitStackName}.template.json`;

  await fs.copy(
    path.join(__dirname, 'bootstrap-template.json'),
    path.join(builder.outdir, templateFile));

  builder.addArtifact(toolkitStackName, {
    type: cxprotocol.ArtifactType.AWS_CLOUDFORMATION_STACK,
    environment: cxapi.EnvironmentUtils.format(environment.account, environment.region),
    properties: {
      templateFile,
    },
  });

  const assembly = builder.buildAssembly();
  return await deployStack({
    stack: assembly.getStackByName(toolkitStackName),
    sdk,
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
