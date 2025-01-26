import type * as cxapi from '@aws-cdk/cx-api';

/**
 * @returns an array with the tags available in the stack metadata.
 */
export function tagsForStack(stack: cxapi.CloudFormationStackArtifact): Tag[] {
  return Object.entries(stack.tags).map(([Key, Value]) => ({ Key, Value }));
}

export interface Tag {
  readonly Key: string;
  readonly Value: string;
}
