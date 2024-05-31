// The SDK is only used to reference `DescribeChangeSetOutput`, so the SDK is added as a devDependency.
// The SDK should not make network calls here
import type { DescribeChangeSetOutput as DescribeChangeSet, ResourceChangeDetail as RCD } from '@aws-sdk/client-cloudformation';
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

  public static replaceResourceTemplateWithChangeContext(
    resources: { [key: string]: types.Resource | undefined },
    logicalId: string,
    resourceType: string | undefined,
    changeContext: any,
  ) {
    // If the changeset includes a resource not in the template, then we have to add that resource
    if (resources[logicalId] === undefined) {
      resources[logicalId] = {
        Type: resourceType ?? 'UNKNOWN_RESOURCE_TYPE',
        ...changeContext,
      };
    }

    const resource = resources[logicalId]!;

    // This is an attempt at an aesthetic approvement for the diff. We want to replace the {{changeSet:KNOWN_AFTER_APPLY}}
    // with the values that our `diffTemplate` method produced. But everything is okay if we fail.
    const pathsToKnownAfterApply = TemplateAndChangeSetDiffMerger.getAllPathsToKnownAfterApply(changeContext.Properties);
    for (const path of pathsToKnownAfterApply) {
      TemplateAndChangeSetDiffMerger.attemptToReplaceLeafWithOtherLeaf(path, resource.Properties, changeContext.Properties);
    }

    resource.Properties = changeContext.Properties;
  }

  public static getAllPathsToKnownAfterApply(root: any): any[][] {
    let paths: any[][] = [];

    _findPaths(root, [root]);

    // Defining the function in the scope of another function so paths can be added to the paths array.
    function _findPaths(node: any, path: any[]) {
      if (typeof node === 'object') {
        // we are on a node that has children

        const children = Object.keys(node ?? {});

        for (const key of children) {
          _findPaths(node[key], [...path, key]);
        }

      } else if (Array.isArray(node)) {
        // TODO | consider just giving up if it's an array since that introduces indeterminancy in the path
        // TODO | which could possibly lead to replacing '{{changeSet:KNOWN_AFTER_APPLY}}' with the incorrect node.

        node.sort(); // sort the array so we always go in the same order.

        for (let i = 0; i < node.length; i++) {
          _findPaths(node[i], [...path, i]);
        }

      } else {
        // We are on a leaf
        if (typeof node === 'string' && node === '{{changeSet:KNOWN_AFTER_APPLY}}') {
          // this is what we want to replace
          paths.push(path);
        }
      }
    }

    return paths;
  }

  public static attemptToReplaceLeafWithOtherLeaf(pathToLeaf: any[], pathWithNewLeaf: any, leafWillBeReplaced: any) {
    try {
      for (const node of pathToLeaf) {
        pathWithNewLeaf = pathWithNewLeaf[node];
        leafWillBeReplaced = leafWillBeReplaced[node];
      }
      leafWillBeReplaced = pathWithNewLeaf;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(`Failed to traverse path ${pathToLeaf}, path: ${pathWithNewLeaf}, otherPath: ${leafWillBeReplaced}`);
      // eslint-disable-next-line no-console
      console.log(`Error: ${e}`);
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

  public replaceTemplateResourcesWithChangeContext(
    beforeOrAfterChanges: 'before' | 'after',
    resources: { [key: string]: types.Resource | undefined },
  ) {
    for (const [logicalId, changeSetResource] of Object.entries(this.changeSetResources)) {
      if (changeSetResource === undefined) { continue; } // shouldn't happen, but just to be safe.

      if (beforeOrAfterChanges === 'before' && changeSetResource.beforeContext) {
        TemplateAndChangeSetDiffMerger.replaceResourceTemplateWithChangeContext(
          resources, logicalId, changeSetResource.resourceType, changeSetResource.beforeContext,
        );
      } else if (beforeOrAfterChanges === 'after' && changeSetResource.afterContext) {
        TemplateAndChangeSetDiffMerger.replaceResourceTemplateWithChangeContext(
          resources, logicalId, changeSetResource.resourceType, changeSetResource.afterContext,
        );
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

