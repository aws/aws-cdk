import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cfnDiff from '@aws-cdk/cloudformation-diff';
import * as cxapi from '@aws-cdk/cx-api';
import * as chalk from 'chalk';
import { print, warning } from './logging';

/**
 * Pretty-prints the differences between two template states to the console.
 *
 * @param oldTemplate the old/current state of the stack.
 * @param newTemplate the new/target state of the stack.
 * @param strict      do not filter out AWS::CDK::Metadata
 * @param context     lines of context to use in arbitrary JSON diff
 * @param quiet       silences \'There were no differences\' messages
 *
 * @returns the count of differences that were rendered.
 */
export function printStackDiff(
  oldTemplate: any,
  newTemplate: cxapi.CloudFormationStackArtifact,
  strict: boolean,
  context: number,
  quiet: boolean,
  stream?: cfnDiff.FormatStream): number {

  let diff = cfnDiff.diffTemplate(oldTemplate, newTemplate.template);

  // detect and filter out mangled characters from the diff
  let filteredChangesCount = 0;
  if (diff.differenceCount && !strict) {
    const mangledNewTemplate = JSON.parse(cfnDiff.mangleLikeCloudFormation(JSON.stringify(newTemplate.template)));
    const mangledDiff = cfnDiff.diffTemplate(oldTemplate, mangledNewTemplate);
    filteredChangesCount = Math.max(0, diff.differenceCount - mangledDiff.differenceCount);
    if (filteredChangesCount > 0) {
      diff = mangledDiff;
    }
  }

  // filter out 'AWS::CDK::Metadata' resources from the template
  if (diff.resources && !strict) {
    diff.resources = diff.resources.filter(change => {
      if (!change) { return true; }
      if (change.newResourceType === 'AWS::CDK::Metadata') { return false; }
      if (change.oldResourceType === 'AWS::CDK::Metadata') { return false; }
      return true;
    });
  }

  if (!diff.isEmpty) {
    cfnDiff.formatDifferences(stream || process.stderr, diff, {
      ...logicalIdMapFromTemplate(oldTemplate),
      ...buildLogicalToPathMap(newTemplate),
    }, context);
  } else if (!quiet) {
    print(chalk.green('There were no differences'));
  }
  if (filteredChangesCount > 0) {
    print(chalk.yellow(`Omitted ${filteredChangesCount} changes because they are likely mangled non-ASCII characters. Use --strict to print them.`));
  }

  return diff.differenceCount;
}

export enum RequireApproval {
  Never = 'never',

  AnyChange = 'any-change',

  Broadening = 'broadening'
}

/**
 * Print the security changes of this diff, if the change is impactful enough according to the approval level
 *
 * Returns true if the changes are prompt-worthy, false otherwise.
 */
export function printSecurityDiff(oldTemplate: any, newTemplate: cxapi.CloudFormationStackArtifact, requireApproval: RequireApproval): boolean {
  const diff = cfnDiff.diffTemplate(oldTemplate, newTemplate.template);

  if (difRequiresApproval(diff, requireApproval)) {
    // eslint-disable-next-line max-len
    warning(`This deployment will make potentially sensitive changes according to your current security approval level (--require-approval ${requireApproval}).`);
    warning('Please confirm you intend to make the following modifications:\n');

    cfnDiff.formatSecurityChanges(process.stdout, diff, buildLogicalToPathMap(newTemplate));
    return true;
  }
  return false;
}

/**
 * Return whether the diff has security-impacting changes that need confirmation
 *
 * TODO: Filter the security impact determination based off of an enum that allows
 * us to pick minimum "severities" to alert on.
 */
function difRequiresApproval(diff: cfnDiff.TemplateDiff, requireApproval: RequireApproval) {
  switch (requireApproval) {
    case RequireApproval.Never: return false;
    case RequireApproval.AnyChange: return diff.permissionsAnyChanges;
    case RequireApproval.Broadening: return diff.permissionsBroadened;
    default: throw new Error(`Unrecognized approval level: ${requireApproval}`);
  }
}

function buildLogicalToPathMap(stack: cxapi.CloudFormationStackArtifact) {
  const map: { [id: string]: string } = {};
  for (const md of stack.findMetadataByType(cxschema.ArtifactMetadataEntryType.LOGICAL_ID)) {
    map[md.data as string] = md.path;
  }
  return map;
}

function logicalIdMapFromTemplate(template: any) {
  const ret: Record<string, string> = {};

  for (const [logicalId, resource] of Object.entries(template.Resources ?? {})) {
    const path = (resource as any)?.Metadata?.['aws:cdk:path'];
    if (path) {
      ret[logicalId] = path;
    }
  }
  return ret;
}
