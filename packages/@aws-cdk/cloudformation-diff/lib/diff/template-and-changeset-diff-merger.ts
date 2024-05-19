// The SDK is only used to reference `DescribeChangeSetOutput`, so the SDK is added as a devDependency.
// The SDK should not make network calls here
import type { DescribeChangeSetOutput as DescribeChangeSet, ResourceChangeDetail } from '@aws-sdk/client-cloudformation';
import { diffResource } from '.';
import * as types from '../diff/types';

export type DescribeChangeSetOutput = DescribeChangeSet;

/**
 * The purpose of this class is to include differences from the ChangeSet to differences in the TemplateDiff.
 */
export class TemplateAndChangeSetDiffMerger {
  // If we somehow cannot find the resourceType, then we'll mark it as UNKNOWN, so that can be seen in the diff.
  private UNKNOWN_RESOURCE_TYPE = 'UNKNOWN';

  changeSet: DescribeChangeSetOutput;
  currentTemplateResources: {[logicalId: string]: any};
  changeSetResources: types.ChangeSetResources;

  constructor(
    args: {
      changeSet: DescribeChangeSetOutput;
      currentTemplateResources: {[logicalId: string]: any};
    },
  ) {
    this.changeSet = args.changeSet;
    this.currentTemplateResources = args.currentTemplateResources;
    this.changeSetResources = this.inspectChangeSet(this.changeSet);
  }

  inspectChangeSet(changeSet: DescribeChangeSetOutput): types.ChangeSetResources {
    const replacements: types.ChangeSetResources = {};
    for (const resourceChange of changeSet.Changes ?? []) {
      if (resourceChange.ResourceChange?.LogicalResourceId === undefined) {
        continue;
      }

      const propertiesReplaced: types.ChangeSetProperties = {};
      for (const propertyChange of resourceChange.ResourceChange.Details ?? []) {
        if (propertyChange.Target?.Attribute === 'Properties' && propertyChange.Target.Name) {
          propertiesReplaced[propertyChange.Target.Name] = {
            changeSetReplacementMode: this.determineChangeSetReplacementMode(propertyChange),
            beforeValue: propertyChange.Target.BeforeValue,
            afterValue: propertyChange.Target.AfterValue,
          };
        }
      }

      replacements[resourceChange.ResourceChange.LogicalResourceId] = {
        resourceWasReplaced: resourceChange.ResourceChange.Replacement === 'True',
        resourceType: resourceChange.ResourceChange.ResourceType ?? this.UNKNOWN_RESOURCE_TYPE, // DescribeChanegSet doesn't promise to have the ResourceType...
        properties: propertiesReplaced,
      };
    }

    return replacements;
  }

  determineChangeSetReplacementMode(propertyChange: ResourceChangeDetail): types.ChangeSetReplacementMode {
    if (propertyChange.Target!.RequiresRecreation === 'Always') {
      switch (propertyChange.Evaluation) {
        case 'Static':
          return 'Always';
        case 'Dynamic':
          // If Evaluation is 'Dynamic', then this may cause replacement, or it may not.
          // see 'Replacement': https://docs.aws.amazon.com/AWSCloudFormation/latest/APIReference/API_ResourceChange.html
          return 'Conditionally';
      }
    }

    return propertyChange.Target!.RequiresRecreation as types.ChangeSetReplacementMode;
  }

  /**
  * Finds resource differences that are only visible in the changeset diff from CloudFormation (that is, we can't find this difference in the diff between 2 templates)
  * and adds those missing differences to the templateDiff.
  *
  * - One case when this can happen is when a resource is added to the stack through the changeset.
  * - Another case is when a resource is changed because the resource is defined by an SSM parameter, and the value of that SSM parameter changes.
  */
  addChangeSetResourcesToDiff(resourceDiffs: types.DifferenceCollection<types.Resource, types.ResourceDifference>) {
    for (const [logicalId, changeSetResource] of Object.entries(this.changeSetResources)) {
      const resourceNotFoundInTemplateDiff = !(resourceDiffs.logicalIds.includes(logicalId));
      if (resourceNotFoundInTemplateDiff) {
        const resourceDiffFromChangeset = diffResource(
          this.convertResourceFromChangesetToResourceForDiff(changeSetResource, 'OLD_VALUES'),
          this.convertResourceFromChangesetToResourceForDiff(changeSetResource, 'NEW_VALUES'),
        );
        resourceDiffs.set(logicalId, resourceDiffFromChangeset);
      }

      const propertyChangesFromTemplate = resourceDiffs.get(logicalId).propertyUpdates;
      for (const propertyName of Object.keys(this.changeSetResources[logicalId]?.properties ?? {})) {
        if (propertyName in propertyChangesFromTemplate) {
          // If the property is already marked to be updated, then we don't need to do anything.
          continue;
        }

        // This property diff will be hydrated when enhanceChangeImpacts is called.
        const emptyPropertyDiff = new types.PropertyDifference({}, {}, {});
        emptyPropertyDiff.isDifferent = true;
        resourceDiffs.get(logicalId).setPropertyChange(propertyName, emptyPropertyDiff);
      }
    }

    this.enhanceChangeImpacts(resourceDiffs);
  }

  convertResourceFromChangesetToResourceForDiff(
    resourceInfoFromChangeset: types.ChangeSetResource,
    parseOldOrNewValues: 'OLD_VALUES' | 'NEW_VALUES',
  ): types.Resource {
    const props: { [logicalId: string]: string | undefined } = {};
    if (parseOldOrNewValues === 'NEW_VALUES') {
      for (const [propertyName, value] of Object.entries(resourceInfoFromChangeset.properties ?? {})) {
        props[propertyName] = value.afterValue;
      }
    } else {
      for (const [propertyName, value] of Object.entries(resourceInfoFromChangeset.properties ?? {})) {
        props[propertyName] = value.beforeValue;
      }
    }

    return {
      Type: resourceInfoFromChangeset.resourceType ?? this.UNKNOWN_RESOURCE_TYPE,
      Properties: props,
    };
  }

  enhanceChangeImpacts(resourceDiffs: types.DifferenceCollection<types.Resource, types.ResourceDifference>) {
    resourceDiffs.forEachDifference((logicalId: string, change: types.ResourceDifference) => {
      if ((!change.resourceTypeChanged) && change.resourceType?.includes('AWS::Serverless')) {
        // CFN applies the SAM transform before creating the changeset, so the changeset contains no information about SAM resources
        return;
      }
      change.forEachDifference((type: 'Property' | 'Other', name: string, value: types.Difference<any> | types.PropertyDifference<any>) => {
        if (type === 'Property') {
          if (!this.changeSetResources[logicalId]) {
            (value as types.PropertyDifference<any>).changeImpact = types.ResourceImpact.NO_CHANGE;
            (value as types.PropertyDifference<any>).isDifferent = false;
            return;
          }

          const changeSetReplacementMode = (this.changeSetResources[logicalId]?.properties ?? {})[name]?.changeSetReplacementMode;
          switch (changeSetReplacementMode) {
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

  addImportInformation(resourceDiffs: types.DifferenceCollection<types.Resource, types.ResourceDifference>) {
    const imports = this.findResourceImports();
    resourceDiffs.forEachDifference((logicalId: string, change: types.ResourceDifference) => {
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
