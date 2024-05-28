// The SDK is only used to reference `DescribeChangeSetOutput`, so the SDK is added as a devDependency.
// The SDK should not make network calls here
import type { DescribeChangeSetOutput as DescribeChangeSet, ResourceChangeDetail as RCD } from '@aws-sdk/client-cloudformation';
import { diffResource } from '.';
import * as types from '../diff/types';
import { deepCopy } from '../util';

export type DescribeChangeSetOutput = DescribeChangeSet;
type ChangeSetResourceChangeDetail = RCD;

interface TemplateAndChangeSetDiffMergerOptions {
  /*
   * Only specifiable for testing. Otherwise, this is the datastructure that the changeSet is converted into so
   * that we only pay attention to the subset of changeSet properties that are relevant for computing the diff.
   *
   * @default - the changeSet is converted into this datastructure.
  */
  readonly changeSetResources?: types.ChangeSetResources;
}

export interface TemplateAndChangeSetDiffMergerProps extends TemplateAndChangeSetDiffMergerOptions {
  /*
   * The changeset that will be read and merged into the template diff.
  */
  readonly changeSet: DescribeChangeSetOutput;
}

/**
 * The purpose of this class is to include differences from the ChangeSet to differences in the TemplateDiff.
 */
export class TemplateAndChangeSetDiffMerger {

  /**
   * We try our best to provide the information -- but if we can't, we fall back to this message, so at least the existence of the difference is reported.
   */
  public static VALUE_UNKNOWN_MESSAGE = 'DescribeChangeSet detected difference, but the value is not resolved.';

  public static addChangeSetResourceToDiff(args: {
    changedResourceLogicalId: string;
    propertiesThatChanged: string[];
    theDiffResources: types.DifferenceCollection<types.Resource, types.ResourceDifference>;
    resourceType: string;
    afterContext: any;
    propertiesOfResourceFromCurrentTemplate: { [key: string]: any } | undefined;
    propertiesOfResourceFromNewTemplate: { [key: string]: any } | undefined;
  }) {
    const oldResource = {
      Type: args.resourceType,
      Properties: deepCopy(args.propertiesOfResourceFromCurrentTemplate ?? {}),
    };

    for (const nameOfChangedProperty of args.propertiesThatChanged) {
      if (args.propertiesOfResourceFromNewTemplate?.[nameOfChangedProperty]) {
        // We try our best to include as much info as possible, but if the afterContext fails, we will just notify the existence of the diff.
        const newPropertyValue = args.afterContext?.Properties?.[nameOfChangedProperty] ?? TemplateAndChangeSetDiffMerger.VALUE_UNKNOWN_MESSAGE;
        args.propertiesOfResourceFromNewTemplate[nameOfChangedProperty] = newPropertyValue;
      }
    }

    const newResource = {
      Type: args.resourceType,
      Properties: args.propertiesOfResourceFromNewTemplate,
    };

    const resourceDiff = diffResource(oldResource, newResource);
    args.theDiffResources.set(args.changedResourceLogicalId, resourceDiff);
  }

  /**
   * The title says maybe because nothing is added if all the properties are already in the diff.
   */
  public static maybeAddChangeSetPropertiesToResourceInDiff(args: {
    propertiesThatChanged: string[];
    afterContext: any;
    changedResource: types.ResourceDifference | undefined;
    propertiesOfResourceFromCurrentTemplate: { [key: string]: any } | undefined;
    propertiesOfResourceFromNewTemplate: { [key: string]: any } | undefined;
  }) {
    const propertyUpdates = args.changedResource?.propertyUpdates;
    for (const nameOfChangedProperty of args.propertiesThatChanged) {
      const changeIsAlreadyInDiff = propertyUpdates?.hasOwnProperty(nameOfChangedProperty);
      const changedPropertyExists = args.propertiesOfResourceFromCurrentTemplate?.[nameOfChangedProperty];

      if (changeIsAlreadyInDiff || !changedPropertyExists) {
        continue;
      }

      const oldValue = deepCopy(args.propertiesOfResourceFromCurrentTemplate?.[nameOfChangedProperty] ?? {});

      // We try our best to include as much info as possible, but if the afterContext fails, we will just notify the existence of the diff.
      const newPropertyValue = args.afterContext?.Properties?.[nameOfChangedProperty] ?? TemplateAndChangeSetDiffMerger.VALUE_UNKNOWN_MESSAGE;
      args.propertiesOfResourceFromCurrentTemplate![nameOfChangedProperty] = newPropertyValue;
      const newValue = args.propertiesOfResourceFromNewTemplate?.[nameOfChangedProperty];

      const emptyChangeImpact = {};

      args.changedResource!.setPropertyChange(nameOfChangedProperty, new types.PropertyDifference(
        oldValue,
        newValue,
        emptyChangeImpact, // ChangeImpact will be filled later.
      ));
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

  // If we somehow cannot find the resourceType, then we'll mark it as UNKNOWN, so that can be seen in the diff.
  private static UNKNOWN_RESOURCE_TYPE = 'UNKNOWN_RESOURCE_TYPE';

  public changeSet: DescribeChangeSetOutput | undefined;
  public changeSetResources: types.ChangeSetResources;

  constructor(props: TemplateAndChangeSetDiffMergerProps) {
    this.changeSet = props.changeSet;
    this.changeSetResources = props.changeSetResources ?? this.convertDescribeChangeSetOutputToChangeSetResources(this.changeSet);
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
   * This is writing over the "ChangeImpact" that was computed from the template difference, and instead using the ChangeImpact that is included from the ChangeSet.
   * Using the ChangeSet ChangeImpact is more accurate. The ChangeImpact tells us what the consequence is of changing the field. If changing the field causes resource
   * replacement (e.g., changing the name of an IAM role requires deleting and replacing the role), then ChangeImpact is "Always".
   */
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

  public addMissingResourceInformationToDiff(
    theDiffResources: types.DifferenceCollection<types.Resource, types.ResourceDifference>,
    currentTemplateResources: { [key: string]: any } | undefined,
    newTemplateResources: { [key: string]: any } | undefined,
  ) {
    const resourceChangesFromDiff = theDiffResources?.changes;
    for (const [changedResourceLogicalId, change] of Object.entries(this.changeSetResources ?? [])) {
      const resourceIsInTemplateDiff = resourceChangesFromDiff?.hasOwnProperty(changedResourceLogicalId);
      const propertiesThatChanged = Object.keys(change.propertyReplacementModes ?? {});

      if (resourceIsInTemplateDiff) {
        TemplateAndChangeSetDiffMerger.maybeAddChangeSetPropertiesToResourceInDiff({
          propertiesThatChanged,
          afterContext: change.afterContext,
          changedResource: theDiffResources?.get(changedResourceLogicalId),
          propertiesOfResourceFromCurrentTemplate: currentTemplateResources?.[changedResourceLogicalId]?.Properties,
          propertiesOfResourceFromNewTemplate: newTemplateResources?.[changedResourceLogicalId]?.Properties,
        });
      } else {
        TemplateAndChangeSetDiffMerger.addChangeSetResourceToDiff({
          changedResourceLogicalId,
          propertiesThatChanged,
          theDiffResources,
          afterContext: change.afterContext,
          resourceType: change.resourceType ?? TemplateAndChangeSetDiffMerger.UNKNOWN_RESOURCE_TYPE,
          propertiesOfResourceFromCurrentTemplate: currentTemplateResources?.[changedResourceLogicalId]?.Properties,
          propertiesOfResourceFromNewTemplate: newTemplateResources?.[changedResourceLogicalId]?.Properties,
        });
      }
    }
  }

  public addImportInformationFromChangeset(resourceDiffs: types.DifferenceCollection<types.Resource, types.ResourceDifference>) {
    const imports = this.findResourceImports();
    resourceDiffs.forEachDifference((logicalId: string, change: types.ResourceDifference) => {
      if (imports.includes(logicalId)) {
        change.isImport = true;
      }
    });
  }

  public findResourceImports(): (string | undefined)[] {
    const importedResourceLogicalIds = [];
    for (const resourceChange of this.changeSet?.Changes ?? []) {
      if (resourceChange.ResourceChange?.Action === 'Import') {
        importedResourceLogicalIds.push(resourceChange.ResourceChange.LogicalResourceId);
      }
    }

    return importedResourceLogicalIds;
  }
}
