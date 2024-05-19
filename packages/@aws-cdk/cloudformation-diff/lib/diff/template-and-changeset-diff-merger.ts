// The SDK is only used to reference `DescribeChangeSetOutput`, so the SDK is added as a devDependency.
// The SDK should not make network calls here
import type { DescribeChangeSetOutput, ResourceChangeDetail } from '@aws-sdk/client-cloudformation';
import { diffResource } from '.';
import * as types from '../diff/types';

/**
 * The purpose of this class is to include differences from the ChangeSet to differences in the TemplateDiff.
 */
export class TemplateAndChangeSetDiffMerger {
  // If we somehow cannot find the resourceType, then we'll mark it as UNKNOWN, so that can be seen in the diff.
  static UNKNOWN_RESOURCE_TYPE = 'UNKNOWN';

  /**
   * @param parseOldOrNewValues These enum values come from DescribeChangeSetOutput, which indicate if the property resolves to that value after the change or before the change.
   */
  static convertResourceFromChangesetToResourceForDiff(
    resourceInfoFromChangeset: types.ChangeSetResource,
    parseOldOrNewValues: 'BEFORE_VALUES' | 'AFTER_VALUES',
  ): types.Resource {
    const props: { [logicalId: string]: string | undefined } = {};
    if (parseOldOrNewValues === 'AFTER_VALUES') {
      for (const [propertyName, value] of Object.entries(resourceInfoFromChangeset.properties ?? {})) {
        props[propertyName] = value.afterValue;
      }
    } else {
      for (const [propertyName, value] of Object.entries(resourceInfoFromChangeset.properties ?? {})) {
        props[propertyName] = value.beforeValue;
      }
    }

    return {
      Type: resourceInfoFromChangeset.resourceType ?? TemplateAndChangeSetDiffMerger.UNKNOWN_RESOURCE_TYPE,
      Properties: props,
    };
  }

  static determineChangeSetReplacementMode(propertyChange: ResourceChangeDetail): types.ChangeSetReplacementMode {
    if (propertyChange.Target?.RequiresRecreation === undefined) {
      // We can't determine if the resource will be replaced or not. That's what conditionally means.
      return 'Conditionally';
    }

    if (propertyChange.Target.RequiresRecreation === 'Always') {
      switch (propertyChange.Evaluation) {
        case 'Static':
          return 'Always';
        case 'Dynamic':
          // If Evaluation is 'Dynamic', then this may cause replacement, or it may not.
          // see 'Replacement': https://docs.aws.amazon.com/AWSCloudFormation/latest/APIReference/API_ResourceChange.html
          return 'Conditionally';
      }
    }

    return propertyChange.Target.RequiresRecreation as types.ChangeSetReplacementMode;
  }

  changeSet: DescribeChangeSetOutput | undefined;
  changeSetResources: types.ChangeSetResources | undefined;

  constructor(
    args: {
      changeSet: DescribeChangeSetOutput;
    },
  ) {
    this.changeSet = args.changeSet;
    this.changeSetResources = this.inspectChangeSet(this.changeSet);
  }

  inspectChangeSet(changeSet: DescribeChangeSetOutput): types.ChangeSetResources {
    const changeSetResources: types.ChangeSetResources = {};
    for (const resourceChange of changeSet.Changes ?? []) {
      if (resourceChange.ResourceChange?.LogicalResourceId === undefined) {
        continue;
      }

      const propertiesReplaced: types.ChangeSetProperties = {};
      for (const propertyChange of resourceChange.ResourceChange.Details ?? []) {
        if (propertyChange.Target?.Attribute === 'Properties' && propertyChange.Target.Name) {
          propertiesReplaced[propertyChange.Target.Name] = {
            changeSetReplacementMode: TemplateAndChangeSetDiffMerger.determineChangeSetReplacementMode(propertyChange),
            beforeValue: _maybeJsonParse(propertyChange.Target.BeforeValue),
            afterValue: _maybeJsonParse(propertyChange.Target.AfterValue),
          };
        }
      }

      changeSetResources[resourceChange.ResourceChange.LogicalResourceId] = {
        resourceWasReplaced: resourceChange.ResourceChange.Replacement === 'True',
        resourceType: resourceChange.ResourceChange.ResourceType ?? TemplateAndChangeSetDiffMerger.UNKNOWN_RESOURCE_TYPE, // DescribeChanegSet doesn't promise to have the ResourceType...
        properties: propertiesReplaced,
      };
    }

    return changeSetResources;

    /**
     *  we will try to parse the afterValue so that downstream processing of the diff can access object properties.
     *  However, there's not a guarantee that it will work, since clouformation will truncate the afterValue and BeforeValue if they're too long.
     */
    function _maybeJsonParse(value: string | undefined): any | undefined {
      let result = value;
      try {
        result = JSON.parse(value ?? '');
      } catch (e) {}
      return result;
    }
  }

  /**
  * Finds resource differences that are only visible in the changeset diff from CloudFormation (that is, we can't find this difference in the diff between 2 templates)
  * and adds those missing differences to the templateDiff.
  *
  * - One case when this can happen is when a resource is added to the stack through the changeset.
  * - Another case is when a resource is changed because the resource is defined by an SSM parameter, and the value of that SSM parameter changes.
  */
  addChangeSetResourcesToDiff(resourceDiffs: types.DifferenceCollection<types.Resource, types.ResourceDifference>) {
    for (const [logicalId, changeSetResource] of Object.entries(this.changeSetResources ?? {})) {
      const resourceNotFoundInTemplateDiff = !(resourceDiffs.logicalIds.includes(logicalId));
      if (resourceNotFoundInTemplateDiff) {
        const resourceDiffFromChangeset = diffResource(
          TemplateAndChangeSetDiffMerger.convertResourceFromChangesetToResourceForDiff(changeSetResource, 'BEFORE_VALUES'),
          TemplateAndChangeSetDiffMerger.convertResourceFromChangesetToResourceForDiff(changeSetResource, 'AFTER_VALUES'),
        );
        resourceDiffs.set(logicalId, resourceDiffFromChangeset);
      }

      const propertyChangesFromTemplate = resourceDiffs.get(logicalId).propertyUpdates;
      for (const propertyName of Object.keys((this.changeSetResources ?? {})[logicalId]?.properties ?? {})) {
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

  enhanceChangeImpacts(resourceDiffs: types.DifferenceCollection<types.Resource, types.ResourceDifference>) {
    resourceDiffs.forEachDifference((logicalId: string, change: types.ResourceDifference) => {
      if ((!change.resourceTypeChanged) && change.resourceType?.includes('AWS::Serverless')) {
        // CFN applies the SAM transform before creating the changeset, so the changeset contains no information about SAM resources
        return;
      }
      change.forEachDifference((type: 'Property' | 'Other', name: string, value: types.Difference<any> | types.PropertyDifference<any>) => {
        if (type === 'Property') {
          if (!(this.changeSetResources ?? {})[logicalId]) {
            (value as types.PropertyDifference<any>).changeImpact = types.ResourceImpact.NO_CHANGE;
            (value as types.PropertyDifference<any>).isDifferent = false;
            return;
          }

          const changeSetReplacementMode = ((this.changeSetResources ?? {})[logicalId]?.properties ?? {})[name]?.changeSetReplacementMode;
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
    for (const resourceChange of this.changeSet?.Changes ?? []) {
      if (resourceChange.ResourceChange?.Action === 'Import') {
        importedResourceLogicalIds.push(resourceChange.ResourceChange.LogicalResourceId!);
      }
    }

    return importedResourceLogicalIds;
  }
}
