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

  /**
   * TODO: Once IncludePropertyValues is supported in all regions, this function can be deleted
   *
   * @param args.currentTemplateResource resources and their properties only exist in the templateDiff if they are DIFFERENT. Therefore,
   * in the case that a resource is in the changeset, but not in the templateDiff, we should still present the before changes value. Hence, this argument.
   */
  public static convertContextlessChangeSetResourceToResource(
    changeSetResourceResourceType: string | undefined,
    oldOrNewValueFromTemplateDiff: types.Resource | undefined,
    args: {
      propertiesThatChanged: string[];
      beforeOrAfterChanges: 'BEFORE' | 'AFTER';
      currentTemplateResource?: types.Resource;
    },
  ): types.Resource {
    const resourceExistsInTemplateDiff = oldOrNewValueFromTemplateDiff !== undefined;
    if (resourceExistsInTemplateDiff) {
      // if resourceExistsInTemplateDiff, then we don't want to erase the details of property changes that are in the template diff -- but we want
      // to make sure all changes from the ChangeSet are mentioned. At this point, since BeforeContext and AfterContext were not available from the
      // ChangeSet, we can't get the before and after values of the properties from the changeset.
      // So, the best we can do for the properties that aren't in the template diff is mention that they'll be changing.

      if (oldOrNewValueFromTemplateDiff?.Properties === undefined) {
        oldOrNewValueFromTemplateDiff.Properties = {};
      }

      // write properties from changeset that are missing from the template diff
      for (const propertyName of args.propertiesThatChanged) {
        if (!(propertyName in oldOrNewValueFromTemplateDiff.Properties)) { // I am not actually sure if this can happen... but it's better to be safe. It seems that if the resource exists in the templateDiff, then so do all of its Properties.
          const propertyBeforeOrAfter = args.beforeOrAfterChanges === 'AFTER'
            ? 'value_after_change_is_not_viewable'
            : args.currentTemplateResource?.Properties?.[propertyName] ?? 'value_before_change_is_not_viewable';
          oldOrNewValueFromTemplateDiff.Properties[propertyName] = propertyBeforeOrAfter;
        }
      }

      return oldOrNewValueFromTemplateDiff;
    } else {
      // The resource didn't change in the templateDiff but is mentioned in the changeset. E.g., perhaps because an ssm parameter, that defined a property, changed value.
      const propsWithBackUpMessage: { [propertyName: string]: string } = {};
      for (const propertyName of args.propertiesThatChanged) {
        const propertyBeforeOrAfter = args.beforeOrAfterChanges === 'AFTER'
          ? 'value_after_change_is_not_viewable'
          : args.currentTemplateResource?.Properties?.[propertyName] ?? 'value_before_change_is_not_viewable';
        propsWithBackUpMessage[propertyName] = propertyBeforeOrAfter;
      }
      return {
        Type: changeSetResourceResourceType ?? TemplateAndChangeSetDiffMerger.UNKNOWN_RESOURCE_TYPE,
        Properties: propsWithBackUpMessage,
      };
    }
  }

  public static determineChangeSetReplacementMode(propertyChange: ChangeSetResourceChangeDetail): types.ReplacementModes {
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

    return propertyChange.Target.RequiresRecreation as types.ReplacementModes;
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
    this.changeSetResources = args.changeSetResources ?? this.convertDescribeChangeSetOutputToChangeSetResources(this.changeSet);
  }

  /**
   * Read resources from the changeSet, extracting information into ChangeSetResources.
   */
  private convertDescribeChangeSetOutputToChangeSetResources(changeSet: DescribeChangeSetOutput): types.ChangeSetResources {
    const changeSetResources: types.ChangeSetResources = {};
    for (const resourceChange of changeSet.Changes ?? []) {
      if (resourceChange.ResourceChange?.LogicalResourceId === undefined) {
        continue; // Being defensive, here.
      }

      const propertyReplacementModes: types.PropertyReplacementModeMap = {};
      for (const propertyChange of resourceChange.ResourceChange.Details ?? []) { // Details is only included if resourceChange.Action === 'Modify'
        if (propertyChange.Target?.Attribute === 'Properties' && propertyChange.Target.Name) {
          propertyReplacementModes[propertyChange.Target.Name] = {
            replacementMode: TemplateAndChangeSetDiffMerger.determineChangeSetReplacementMode(propertyChange),
          };
        }
      }

      changeSetResources[resourceChange.ResourceChange.LogicalResourceId] = {
        resourceWasReplaced: resourceChange.ResourceChange.Replacement === 'True',
        resourceType: resourceChange.ResourceChange.ResourceType ?? TemplateAndChangeSetDiffMerger.UNKNOWN_RESOURCE_TYPE, // DescribeChangeSet doesn't promise to have the ResourceType...
        propertyReplacementModes: propertyReplacementModes,
        beforeContext: _maybeJsonParse(resourceChange.ResourceChange.BeforeContext),
        afterContext: _maybeJsonParse(resourceChange.ResourceChange.AfterContext),
        changeAction: resourceChange.ResourceChange.Action ?? 'Dynamic',
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
  * Overwrites the resource diff that was computed between the new and old template with the diff of the resources from the ChangeSet.
  * This is a more accurate way of computing the resource differences, since now cdk diff is reporting directly what the ChangeSet will apply.
  */
  public overrideDiffResourcesWithChangeSetResources(
    resourceDiffs: types.DifferenceCollection<types.Resource, types.ResourceDifference>,
    currentTemplateResources: { [key: string]: any } | undefined,
  ) {
    for (const [logicalIdFromChangeSet, changeSetResource] of Object.entries(this.changeSetResources)) {
      let oldResource: types.Resource | undefined;
      const changeSetIncludedBeforeContext = changeSetResource.beforeContext !== undefined;
      if (changeSetIncludedBeforeContext) {
        oldResource = {
          Type: changeSetResource.resourceType ?? TemplateAndChangeSetDiffMerger.UNKNOWN_RESOURCE_TYPE,
          ...changeSetResource.beforeContext, // This is what CfnTemplate.Resources[LogicalId] is before the change, with ssm params resolved.
        };
      } else if (changeSetResource.changeAction === 'Add') {
        oldResource = undefined;
      } else {
        // TODO -- once IncludePropertyValues is supported in all regions for changesets, delete this else branch.
        oldResource = TemplateAndChangeSetDiffMerger.convertContextlessChangeSetResourceToResource(
          changeSetResource.resourceType,
          resourceDiffs.get(logicalIdFromChangeSet)?.oldValue,
          {
            propertiesThatChanged: Object.keys(changeSetResource.propertyReplacementModes || {}),
            beforeOrAfterChanges: 'BEFORE',
            currentTemplateResource: currentTemplateResources?.[logicalIdFromChangeSet],
          },
        );
      }

      let newResource: types.Resource | undefined;
      const changeSetIncludedAfterContext = changeSetResource.afterContext !== undefined;
      if (changeSetIncludedAfterContext) {
        newResource = {
          Type: changeSetResource.resourceType ?? TemplateAndChangeSetDiffMerger.UNKNOWN_RESOURCE_TYPE,
          ...changeSetResource.afterContext, // This is what CfnTemplate.Resources[LogicalId] is after the change, with ssm params resolved.
        };
      } else if (changeSetResource.changeAction === 'Remove') {
        newResource = undefined;
      } else {
        // TODO -- once IncludePropertyValues is supported in all regions for changesets, delete this else branch.
        newResource = TemplateAndChangeSetDiffMerger.convertContextlessChangeSetResourceToResource(
          changeSetResource.resourceType,
          resourceDiffs.get(logicalIdFromChangeSet)?.newValue,
          {
            propertiesThatChanged: Object.keys(changeSetResource.propertyReplacementModes || {}),
            beforeOrAfterChanges: 'AFTER',
          },
        );
      }

      const resourceDiffFromChangeset = diffResource(oldResource, newResource);
      resourceDiffs.set(logicalIdFromChangeSet, resourceDiffFromChangeset);
    }
  }

  public overrideDiffResourceChangeImpactWithChangeSetChangeImpact(logicalId: string, change: types.ResourceDifference) {
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

        const changingPropertyCausesResourceReplacement = (this.changeSetResources[logicalId].propertyReplacementModes ?? {})[name]?.replacementMode;
        switch (changingPropertyCausesResourceReplacement) {
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

  public addImportInformationFromChangeset(resourceDiffs: types.DifferenceCollection<types.Resource, types.ResourceDifference>) {
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
