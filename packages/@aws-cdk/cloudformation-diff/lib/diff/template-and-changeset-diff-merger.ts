// The SDK is only used to reference `DescribeChangeSetOutput`, so the SDK is added as a devDependency.
// The SDK should not make network calls here
import type { DescribeChangeSetOutput as DescribeChangeSet } from '@aws-sdk/client-cloudformation';
import * as types from '../diff/types';

export type DescribeChangeSetOutput = DescribeChangeSet;

/**
 * The purpose of this class is to include differences from the ChangeSet to differences in the TemplateDiff.
 */
export class TemplateAndChangeSetDiffMerger {
  changeSet: DescribeChangeSetOutput;
  currentTemplateResources: {[logicalId: string]: any};
  replacements: types.ResourceReplacements;

  constructor(
    args: {
      changeSet: DescribeChangeSetOutput;
      currentTemplateResources: {[logicalId: string]: any};
    },
  ) {
    this.changeSet = args.changeSet;
    this.currentTemplateResources = args.currentTemplateResources;
    this.replacements = this.findResourceReplacements(this.changeSet);
  }

  findResourceReplacements(changeSet: DescribeChangeSetOutput): types.ResourceReplacements {
    const _replacements: types.ResourceReplacements = {};
    for (const resourceChange of changeSet.Changes ?? []) {
      const propertiesReplaced: { [propName: string]: types.ChangeSetReplacement } = {};
      for (const propertyChange of resourceChange.ResourceChange?.Details ?? []) {
        if (propertyChange.Target?.Attribute === 'Properties') {
          const requiresReplacement = propertyChange.Target.RequiresRecreation === 'Always';
          if (requiresReplacement && propertyChange.Evaluation === 'Static') {
            propertiesReplaced[propertyChange.Target.Name!] = 'Always';
          } else if (requiresReplacement && propertyChange.Evaluation === 'Dynamic') {
          // If Evaluation is 'Dynamic', then this may cause replacement, or it may not.
          // see 'Replacement': https://docs.aws.amazon.com/AWSCloudFormation/latest/APIReference/API_ResourceChange.html
            propertiesReplaced[propertyChange.Target.Name!] = 'Conditionally';
          } else {
            propertiesReplaced[propertyChange.Target.Name!] = propertyChange.Target.RequiresRecreation as types.ChangeSetReplacement;
          }
        }
      }

      _replacements[resourceChange.ResourceChange?.LogicalResourceId!] = {
        resourceReplaced: resourceChange.ResourceChange?.Replacement === 'True',
        resourceType: resourceChange.ResourceChange?.ResourceType || 'UNKNOWN', // the changeset should always return the ResourceType... but just in case.
        propertiesReplaced,
      };
    }

    return _replacements;
  }

  /**
  * Finds resource differences that are only visible in the changeset diff from CloudFormation (that is, we can't find this difference in the diff between 2 templates)
  * and adds those missing differences to the templateDiff.
  *
  * - One case when this can happen is when a resource is added to the stack through the changeset.
  * - Another case is when a resource is changed because the resource is defined by an SSM parameter, and the value of that SSM parameter changes.
  */
  addChangeSetResourcesToDiff(resourceDiffsFromTemplate: types.DifferenceCollection<types.Resource, types.ResourceDifference>) {
    for (const [logicalId, replacement] of Object.entries(this.replacements)) {
      const resourceDiffFromChangeset = this.maybeCreateResourceTypeDiff({
        logicalIdsFromTemplateDiff: resourceDiffsFromTemplate.logicalIds,
        logicalIdOfResourceFromChangeset: logicalId,
        resourceTypeFromChangeset: replacement.resourceType,
        resourceTypeFromTemplate: this.currentTemplateResources[logicalId]?.Type,
      });

      if (resourceDiffFromChangeset) {
        resourceDiffsFromTemplate.add(logicalId, resourceDiffFromChangeset);
      }

      for (const propertyName of Object.keys(this.replacements[logicalId].propertiesReplaced)) {
        const propertyDiffFromChangeset = this.maybeCreatePropertyDiff({
          propertyNameFromChangeset: propertyName,
          propertyUpdatesFromTemplateDiff: resourceDiffsFromTemplate.get(logicalId).propertyUpdates,
        });

        if (propertyDiffFromChangeset) {
          resourceDiffsFromTemplate.get(logicalId).setPropertyChange(propertyName, propertyDiffFromChangeset);
        }
      }
    }
  }

  maybeCreatePropertyDiff(args: {
    propertyNameFromChangeset: string;
    propertyUpdatesFromTemplateDiff: {[key: string]: types.PropertyDifference<any>};
  }): types.PropertyDifference<any> | undefined {
    if (args.propertyNameFromChangeset in args.propertyUpdatesFromTemplateDiff) {
      // If the property is already marked to be updated, then we don't need to do anything.
      return;
    }
    const newProp = new types.PropertyDifference({}, {}, { changeImpact: undefined });
    newProp.isDifferent = true;
    return newProp;
  }

  maybeCreateResourceTypeDiff(args: {
    logicalIdsFromTemplateDiff: string[];
    logicalIdOfResourceFromChangeset: string;
    resourceTypeFromChangeset: string | undefined;
    resourceTypeFromTemplate: string | undefined;
  }) {
    const resourceNotFoundInTemplateDiff = !(args.logicalIdsFromTemplateDiff.includes(args.logicalIdOfResourceFromChangeset));
    if (resourceNotFoundInTemplateDiff) {
      const noChangeResourceDiff = new types.ResourceDifference(undefined, undefined, {
        resourceType: {
          oldType: args.resourceTypeFromTemplate,
          newType: args.resourceTypeFromChangeset,
        },
        propertyDiffs: {},
        otherDiffs: {},
      });
      return noChangeResourceDiff;
    }

    return undefined;
  }

  enhanceChangeImpacts(resourceDiffsFromTemplate: types.DifferenceCollection<types.Resource, types.ResourceDifference>) {
    resourceDiffsFromTemplate.forEachDifference((logicalId: string, change: types.ResourceDifference) => {
      if (change.resourceType?.includes('AWS::Serverless')) {
      // CFN applies the SAM transform before creating the changeset, so the changeset contains no information about SAM resources
        return;
      }
      change.forEachDifference((type: 'Property' | 'Other', name: string, value: types.Difference<any> | types.PropertyDifference<any>) => {
        if (type === 'Property') {
          if (!this.replacements[logicalId]) {
            (value as types.PropertyDifference<any>).changeImpact = types.ResourceImpact.NO_CHANGE;
            (value as types.PropertyDifference<any>).isDifferent = false;
            return;
          }
          switch (this.replacements[logicalId].propertiesReplaced[name]) {
            case 'Always':
              (value as types.PropertyDifference<any>).changeImpact = types.ResourceImpact.WILL_REPLACE;
              break;
            case 'Never':
              (value as types.PropertyDifference<any>).changeImpact = types.ResourceImpact.WILL_UPDATE;
              break;
            case 'Conditionally':
              (value as types.PropertyDifference<any>).changeImpact = types.ResourceImpact.MAY_REPLACE;
              break;
            case undefined:
              (value as types.PropertyDifference<any>).changeImpact = types.ResourceImpact.NO_CHANGE;
              (value as types.PropertyDifference<any>).isDifferent = false;
              break;
          // otherwise, defer to the changeImpact from `diffTemplate`
          }
        } else if (type === 'Other') {
          switch (name) {
            case 'Metadata':
              change.setOtherChange('Metadata', new types.Difference<string>(value.newValue, value.newValue));
              break;
          }
        }
      });
    });
  }

  addImportInformation(resourceDiffsFromTemplate: types.DifferenceCollection<types.Resource, types.ResourceDifference>) {
    const imports = this.findResourceImports();
    resourceDiffsFromTemplate.forEachDifference((logicalId: string, change: types.ResourceDifference) => {
      if (imports.includes(logicalId)) {
        change.isImport = true;
      }
    });
  }

  findResourceImports(): string[] {
    const importedResourceLogicalIds = [];
    for (const resourceChange of this.changeSet.Changes ?? []) {
      if (resourceChange.ResourceChange?.Action === 'Import') {
        importedResourceLogicalIds.push(resourceChange.ResourceChange.LogicalResourceId!);
      }
    }

    return importedResourceLogicalIds;
  }
}
