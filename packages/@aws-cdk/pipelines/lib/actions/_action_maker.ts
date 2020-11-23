import * as path from 'path';
import * as cfn from '@aws-cdk/aws-cloudformation';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as cpactions from '@aws-cdk/aws-codepipeline-actions';
import * as iam from '@aws-cdk/aws-iam';
import { Aws, Stack } from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import { Construct, Node } from 'constructs';
import { appOf, assemblyBuilderOf } from '../private/construct-internals';
import { toPosixPath } from '../private/fs';
import { writeTemplateConfiguration } from '../private/template-configuration';

// v2 - keep this import as a separate section to reduce merge conflict when forward merging with the v2 branch.
// eslint-disable-next-line
import { Construct as CoreConstruct } from '@aws-cdk/core';


export interface Actions {
  readonly prepareAction: cpactions.CloudFormationCreateReplaceChangeSetAction;
  readonly executeAction: cpactions.CloudFormationExecuteChangeSetAction;
}

export interface ActionsOptions {
  readonly cloudAssemblyInput: codepipeline.Artifact;

}

export function actionsFromStackArtifact(scope: Construct, artifact: cxapi.CloudFormationStackArtifact, options: ActionsOptions) {
  if (!artifact.assumeRoleArn) {
    throw new Error(`Stack '${artifact.stackName}' does not have deployment role information; use the 'DefaultStackSynthesizer' synthesizer, or set the '@aws-cdk/core:newStyleStackSynthesis' context key.`);
  }

  const artRegion = artifact.environment.region;
  const region = artRegion === Stack.of(scope).region || artRegion === cxapi.UNKNOWN_REGION ? undefined : artRegion;
  const artAccount = artifact.environment.account;
  const account = artAccount === Stack.of(scope).account || artAccount === cxapi.UNKNOWN_ACCOUNT ? undefined : artAccount;

  const actionRole = roleFromPlaceholderArn(scope, region, account, artifact.assumeRoleArn);
  const cloudFormationExecutionRole = roleFromPlaceholderArn(scope, region, account, artifact.cloudFormationExecutionRoleArn);

  // We need the path of the template relative to the root Cloud Assembly
  // It should be easier to get this, but for now it is what it is.
  const appAsmRoot = assemblyBuilderOf(appOf(scope as CoreConstruct)).outdir;
  const fullTemplatePath = path.join(artifact.assembly.directory, artifact.templateFile);

  let fullConfigPath;
  if (Object.keys(artifact.tags).length > 0) {
    fullConfigPath = `${fullTemplatePath}.config.json`;

    // Write the template configuration file (for parameters into CreateChangeSet call that
    // cannot be configured any other way). They must come from a file, and there's unfortunately
    // no better hook to write this file (`construct.onSynthesize()` would have been the prime candidate
    // but that is being deprecated--and DeployCdkStackAction isn't even a construct).
    writeTemplateConfiguration(fullConfigPath, {
      Tags: artifact.tags,
    });
  }

  const templatePath = toPosixPath(path.relative(appAsmRoot, fullTemplatePath));
  const templateConfigurationPath = fullConfigPath ? toPosixPath(path.relative(appAsmRoot, fullConfigPath)) : undefined;

  const changeSetName = 'PipelineChange';

  return {
    prepareAction: new cpactions.CloudFormationCreateReplaceChangeSetAction({
      actionName: `${artifact.stackName}.Prepare`,
      changeSetName,
      stackName: artifact.stackName,
      templatePath: options.cloudAssemblyInput.atPath(templatePath),
      adminPermissions: false,
      role: actionRole,
      deploymentRole: cloudFormationExecutionRole,
      region,
      capabilities: [cfn.CloudFormationCapabilities.NAMED_IAM, cfn.CloudFormationCapabilities.AUTO_EXPAND],
      templateConfiguration: templateConfigurationPath ? options.cloudAssemblyInput.atPath(templateConfigurationPath) : undefined,
    }),
    executeAction: new cpactions.CloudFormationExecuteChangeSetAction({
      actionName: `${artifact.stackName}.Deploy`,
      changeSetName,
      stackName: artifact.stackName,
      role: actionRole,
      region: region,
    }),
  };
}

function roleFromPlaceholderArn(scope: Construct, region: string | undefined,
  account: string | undefined, arn: string): iam.IRole;
function roleFromPlaceholderArn(scope: Construct, region: string | undefined,
  account: string | undefined, arn: string | undefined): iam.IRole | undefined;
function roleFromPlaceholderArn(scope: Construct, region: string | undefined,
  account: string | undefined, arn: string | undefined): iam.IRole | undefined {

  if (!arn) { return undefined; }

  // Use placeholdered arn as construct ID.
  const id = arn;

  // https://github.com/aws/aws-cdk/issues/7255
  let existingRole = Node.of(scope).tryFindChild(`ImmutableRole${id}`) as iam.IRole;
  if (existingRole) { return existingRole; }
  // For when #7255 is fixed.
  existingRole = Node.of(scope).tryFindChild(id) as iam.IRole;
  if (existingRole) { return existingRole; }

  const arnToImport = cxapi.EnvironmentPlaceholders.replace(arn, {
    region: region ?? Aws.REGION,
    accountId: account ?? Aws.ACCOUNT_ID,
    partition: Aws.PARTITION,
  });
  return iam.Role.fromRoleArn(scope, id, arnToImport, { mutable: false });
}