// The SDK is only used to reference `DescribeChangeSetOutput`, so the SDK is added as a devDependency.
// The SDK should not make network calls here
import type { DescribeChangeSetOutput as DescribeChangeSet, ResourceChangeDetail as RCD } from '@aws-sdk/client-cloudformation';
import { diffResource } from '.';
import * as types from '../diff/types';

export type DescribeChangeSetOutput = DescribeChangeSet;
type ChangeSetResourceChangeDetail = RCD;

/**
 * The purpose of this class is to include differences from the ChangeSet to differences in the TemplateDiff.
 */
export class TemplateAndChangeSetDiffMerger {
  // If we somehow cannot find the resourceType, then we'll mark it as UNKNOWN, so that can be seen in the diff.
  static UNKNOWN_RESOURCE_TYPE = 'UNKNOWN_RESOURCE_TYPE';

  public static determineChangeSetReplacementMode(propertyChange: ChangeSetResourceChangeDetail): types.ChangeSetReplacementMode {
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
  changeSetResources: types.ChangeSetResources;

  constructor(
    args: {
      changeSet: DescribeChangeSetOutput;
      changeSetResources?: types.ChangeSetResources; // used for testing -- otherwise, don't populate
    },
  ) {
    this.changeSet = args.changeSet;
    this.changeSetResources = args.changeSetResources ?? this.createChangeSetResources(this.changeSet);
  }

  /**
   * Read resources from the changeSet, extracting information into ChangeSetResources.
   */
  private createChangeSetResources(changeSet: DescribeChangeSetOutput): types.ChangeSetResources {
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
          };
        }
      }

      changeSetResources[resourceChange.ResourceChange.LogicalResourceId] = {
        resourceWasReplaced: resourceChange.ResourceChange.Replacement === 'True',
        resourceType: resourceChange.ResourceChange.ResourceType ?? TemplateAndChangeSetDiffMerger.UNKNOWN_RESOURCE_TYPE, // DescribeChangeSet doesn't promise to have the ResourceType...
        properties: propertiesReplaced,
        beforeContext: _maybeJsonParse(resourceChange.ResourceChange.BeforeContext),
        afterContext: _maybeJsonParse(resourceChange.ResourceChange.AfterContext),
      };
    }

    return changeSetResources;

    /**
     *  we will try to parse the BeforeContext and AfterContext so that downstream processing of the diff can access object properties.
     *
     *  This should always succeed. But CFN says they truncate the beforeValue and afterValue if they're too long, and since the afterValue and beforeValue
     *  are a subset of the BeforeContext and AfterContext, it seems safer to assume that BeforeContext and AfterContext also may truncate.
     */
    function _maybeJsonParse(value: string | undefined): any | undefined {
      try {
        return JSON.parse(value ?? '');
      } catch (e) {
        return value;
      }
    }
  }

  /**
  * Finds resource differences that are only visible in the changeset diff from CloudFormation (that is, we can't find this difference in the diff between 2 templates)
  * and adds those missing differences to the templateDiff.
  *
  * - One case when this can happen is when a resource is added to the stack through the changeset.
  * - Another case is when a resource is changed because the resource is defined by an SSM parameter, and the value of that SSM parameter changes.
  */
  public addChangeSetResourcesToDiffResources(resourceDiffs: types.DifferenceCollection<types.Resource, types.ResourceDifference>) {
    for (const [logicalId, changeSetResource] of Object.entries(this.changeSetResources)) {
      const oldResource: types.Resource = {
        Type: changeSetResource.resourceType ?? TemplateAndChangeSetDiffMerger.UNKNOWN_RESOURCE_TYPE,
        Properties: changeSetResource.beforeContext?.Properties,
      };
      const newResource: types.Resource = {
        Type: changeSetResource.resourceType ?? TemplateAndChangeSetDiffMerger.UNKNOWN_RESOURCE_TYPE,
        Properties: changeSetResource.afterContext?.Properties,
      };

      const resourceDiffFromChangeset = diffResource(oldResource, newResource);
      const resourceNotFoundInTemplateDiff = !(resourceDiffs.logicalIds.includes(logicalId));
      if (resourceNotFoundInTemplateDiff) {
        resourceDiffs.set(logicalId, resourceDiffFromChangeset);
      }

      const propertyChangesFromTemplate = resourceDiffs.get(logicalId).propertyUpdates;
      for (const propertyName of Object.keys(this.changeSetResources[logicalId].properties ?? {})) {
        if (propertyName in propertyChangesFromTemplate) {
          // If the property is already marked to be updated, then we don't need to do anything.
          // But in a future change, we could think about always overwriting the template change with what the ChangeSet has, since the ChangeSet diff may be more accurate.
          continue;
        }

        if (resourceDiffFromChangeset.propertyUpdates?.[propertyName]) {
          resourceDiffs.get(logicalId).setPropertyChange(propertyName, resourceDiffFromChangeset.propertyUpdates?.[propertyName]);
        }
      }
    }
  }

  public hydrateChangeImpactFromChangeSet(logicalId: string, change: types.ResourceDifference) {
    // resourceType getter throws an error if resourceTypeChanged
    if ((change.resourceTypeChanged === true) || change.resourceType?.includes('AWS::Serverless')) {
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

        const changeSetReplacementMode = (this.changeSetResources[logicalId].properties ?? {})[name]?.changeSetReplacementMode;
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
          // otherwise, defer to the changeImpact from the template diff
        }
      } else if (type === 'Other') {
        switch (name) {
          case 'Metadata':
            // we want to ignore metadata changes in the diff, so compare newValue against newValue.
            change.setOtherChange('Metadata', new types.Difference<string>(value.newValue, value.newValue));
            break;
        }
      }
    });
  }

  public addImportInformation(resourceDiffs: types.DifferenceCollection<types.Resource, types.ResourceDifference>) {
    const imports = this.findResourceImports();
    resourceDiffs.forEachDifference((logicalId: string, change: types.ResourceDifference) => {
      if (imports.includes(logicalId)) {
        change.isImport = true;
      }
    });
  }

  public findResourceImports(): string[] {
    const importedResourceLogicalIds = [];
    for (const resourceChange of this.changeSet?.Changes ?? []) {
      if (resourceChange.ResourceChange?.Action === 'Import') {
        importedResourceLogicalIds.push(resourceChange.ResourceChange.LogicalResourceId!);
      }
    }

    return importedResourceLogicalIds;
  }
}
