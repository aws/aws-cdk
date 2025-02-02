import { DescribeChangeSetOutput, fullDiff } from '@aws-cdk/cloudformation-diff';
import * as cxapi from '@aws-cdk/cx-api';
import { ToolkitError } from '../../../api/errors';
import { RequireApproval } from '../../deploy';

/**
 * Return whether the diff has security-impacting changes that need confirmation
 */
export function diffRequiresApproval(
  oldTemplate: any,
  newTemplate: cxapi.CloudFormationStackArtifact,
  requireApproval: RequireApproval,
  changeSet?: DescribeChangeSetOutput,
): boolean {
  // @todo return or print the full diff.
  const diff = fullDiff(oldTemplate, newTemplate.template, changeSet);

  switch (requireApproval) {
    case RequireApproval.NEVER: return false;
    case RequireApproval.ANY_CHANGE: return diff.permissionsAnyChanges;
    case RequireApproval.BROADENING: return diff.permissionsBroadened;
    default: throw new ToolkitError(`Unrecognized approval level: ${requireApproval}`);
  }
}
