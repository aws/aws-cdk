// The SDK is only used to reference `DescribeChangeSetOutput`, so the SDK is added as a devDependency.
// The SDK should not make network calls here
import type { DescribeChangeSetOutput as DescribeChangeSet, ResourceChangeDetail as RCD } from '@aws-sdk/client-cloudformation';
import { diffResource } from '.';
import * as types from '../diff/types';

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

  public static createResourceDiffWithChangeSet(args: {
    useChangeSetPropertyValuesByDefault: boolean;
    change: types.ChangeSetResource;
    resourceType: string;
    propertiesOfResourceFromCurrentTemplate: { [key: string]: any } | undefined;
    propertiesOfResourceFromNewTemplate: { [key: string]: any } | undefined;
    changedResource: types.ResourceDifference | undefined;
  }): types.ResourceDifference {
    let oldResource: types.Resource | undefined = args.changedResource?.oldValue ?? {
      Type: args.resourceType,
      Properties: args.propertiesOfResourceFromCurrentTemplate ?? {},
    };
    let newResource: types.Resource | undefined = args.changedResource?.newValue ?? {
      Type: args.resourceType,
      Properties: args.propertiesOfResourceFromNewTemplate ?? {},
    };

    // If the feature flag is enabled, then we should overwrite the properties with the change context.
    switch (args.change.changeAction) {
      case 'Import':
      case 'Add':
        oldResource = undefined;
        if (args.useChangeSetPropertyValuesByDefault && args.change.afterContext?.Properties) {
          newResource.Properties = args.change.afterContext?.Properties;
        }
        break;
      case 'Remove':
        if (args.useChangeSetPropertyValuesByDefault && args.change.beforeContext?.Properties) {
          oldResource.Properties = args.change.beforeContext?.Properties;
        }
        newResource = undefined;
        break;
      case 'Dynamic':
      case 'Modify':
      default:
        // in the Modify case, we know the resource is being updated. So there should always be a Properties field, before and after.
        oldResource.Properties = oldResource.Properties ?? {};
        newResource.Properties = newResource.Properties ?? {};

        const propertiesThatChanged = Object.keys(args.change.propertyReplacementModes ?? {});
        const propertyUpdates = args.changedResource?.propertyUpdates;
        for (const propertyName of propertiesThatChanged) {
          const changeIsAlreadyInDiff = propertyUpdates?.hasOwnProperty(propertyName);

          if (args.useChangeSetPropertyValuesByDefault || !changeIsAlreadyInDiff) {
            // Just because the change is already in diff, doesn't imply that the change has all the information.
            // For example, if an IAM policy points to a resource given by an ssm parameter, and the ssm param changes
            // but the actual template diff added a new permission to the policy, then we'd miss the ssm change if we just
            // looked at the templateDiff (that is, if we ignored the ChangeSet).

            oldResource.Properties[propertyName] = args.change.beforeContext?.Properties?.[propertyName]
              ?? oldResource.Properties[propertyName]
              ?? this.UNKNOWN_VALUE_BEFORE_CHANGE;

            if (changeIsAlreadyInDiff) { // Then we know that we at least have the newResource.Properties[propertyName] to fallback to if the context is not available.
              newResource.Properties[propertyName] = args.change.afterContext?.Properties?.[propertyName]
                ?? newResource.Properties[propertyName];
            } else {
              newResource.Properties[propertyName] = args.change.afterContext?.Properties?.[propertyName]
                ?? this.UNKNOWN_VALUE_AFTER_CHANGE;
            }
          }
        }
    }

    return diffResource(oldResource, newResource);
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

  // If we somehow cannot find the value of the change, then we will just state that the diff exists.
  private static UNKNOWN_VALUE_BEFORE_CHANGE = 'DescribeChangeSet detected difference, but the value is not resolved.';
  private static UNKNOWN_VALUE_AFTER_CHANGE = 'DescribeChangeSet detected difference, but the value is not resolved.';

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
        changeAction: resourceChange.ResourceChange.Action ?? 'Dynamic', // Dynamic means we're not sure what the change action is...
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
            change.setOtherChange('Metadata', new types.Difference<string>({} as any, {} as any));
            break;
        }
      }
    });
  }

  public addMissingResourceInformationToDiff(
    theDiffResources: types.DifferenceCollection<types.Resource, types.ResourceDifference>,
    currentTemplateResources: { [key: string]: any } | undefined,
    newTemplateResources: { [key: string]: any } | undefined,
    useChangeSetPropertyValuesByDefault: boolean,
  ) {
    for (const [changedResourceLogicalId, changeSetChanges] of Object.entries(this.changeSetResources ?? [])) {
      let changedResource: types.ResourceDifference | undefined;
      try {
        changedResource = theDiffResources?.get(changedResourceLogicalId);
      } catch (e) {
        changedResource = undefined;
      }

      const resourceDiff = TemplateAndChangeSetDiffMerger.createResourceDiffWithChangeSet({
        useChangeSetPropertyValuesByDefault,
        changedResource,
        change: changeSetChanges,
        resourceType: changeSetChanges.resourceType ?? TemplateAndChangeSetDiffMerger.UNKNOWN_RESOURCE_TYPE,
        propertiesOfResourceFromCurrentTemplate: currentTemplateResources?.[changedResourceLogicalId]?.Properties,
        propertiesOfResourceFromNewTemplate: newTemplateResources?.[changedResourceLogicalId]?.Properties,
      });

      theDiffResources.set(changedResourceLogicalId, resourceDiff);
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
