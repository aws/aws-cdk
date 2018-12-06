import cfnDiff = require('@aws-cdk/cloudformation-diff');
import cxapi = require('@aws-cdk/cx-api');
import colors = require('colors/safe');
import { print, warning } from './logging';

/**
 * Pretty-prints the differences between two template states to the console.
 *
 * @param oldTemplate the old/current state of the stack.
 * @param newTemplate the new/target state of the stack.
 *
 * @returns the count of differences that were rendered.
 */
export function printStackDiff(oldTemplate: any, newTemplate: cxapi.SynthesizedStack, strict: boolean): number {
  const diff = cfnDiff.diffTemplate(oldTemplate, newTemplate.template);

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
    cfnDiff.formatDifferences(process.stderr, diff, buildLogicalToPathMap(newTemplate));
  } else {
    print(colors.green('There were no differences'));
  }

  return diff.count;
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
export function printSecurityDiff(oldTemplate: any, newTemplate: cxapi.SynthesizedStack, requireApproval: RequireApproval): boolean {
  const diff = cfnDiff.diffTemplate(oldTemplate, newTemplate.template);

  if (difRequiresApproval(diff, requireApproval)) {
    // tslint:disable-next-line:max-line-length
    warning(`This deployment will make potentially sensitive changes according to your current security approval level (--require-approval ${requireApproval}).`);
    warning(`Please confirm you intend to make the following modifications:\n`);

    cfnDiff.formatSecurityChanges(process.stderr, diff, buildLogicalToPathMap(newTemplate));
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

function buildLogicalToPathMap(template: cxapi.SynthesizedStack) {
  const map: { [id: string]: string } = {};
  for (const path of Object.keys(template.metadata)) {
    const md = template.metadata[path];
    for (const e of md) {
      if (e.type === 'aws:cdk:logicalId') {
        const logical = e.data;
        map[logical] = path;
      }
    }
  }
  return map;
}
