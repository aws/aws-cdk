// Represents resource replacements that appear in the changeset
export type PotentialResourceReplacement = ResourceReplacement | NotInChangeSet | undefined;

export type ResourceReplacements = { [logicalId: string]: ResourceReplacement };

export interface ResourceReplacement {
  resourceReplaced: boolean,
  propertiesReplaced: { [propertyName: string]: ChangeSetReplacement };
}

export type NotInChangeSet = 'not-in-change-set';
export const RESOURCE_NOT_IN_CHANGE_SET = 'not-in-change-set';

export type ChangeSetReplacement = 'Always' | 'Never' | 'Conditionally';
