// The SDK is only used to reference `DescribeChangeSetOutput`, so the SDK is added as a devDependency.
// The SDK should not make network calls here
// eslint-disable-next-line import/no-extraneous-dependencies
import { CloudFormation } from 'aws-sdk';
import * as impl from './diff';
import * as types from './diff/types';
import { deepEqual, diffKeyedEntities, unionOf } from './diff/util';

export * from './diff/types';

type DiffHandler = (diff: types.ITemplateDiff, oldValue: any, newValue: any) => void;
type HandlerRegistry = { [section: string]: DiffHandler };

export type NestedChangeSet = CloudFormation.DescribeChangeSetOutput & {
  Changes?: CloudFormation.Changes & {
    ResourceChange?: {
      NestedChanges?: CloudFormation.DescribeChangeSetOutput | NestedChangeSet,
    },
  }[],
};

const DIFF_HANDLERS: HandlerRegistry = {
  AWSTemplateFormatVersion: (diff, oldValue, newValue) =>
    diff.awsTemplateFormatVersion = impl.diffAttribute(oldValue, newValue),
  Description: (diff, oldValue, newValue) =>
    diff.description = impl.diffAttribute(oldValue, newValue),
  Metadata: (diff, oldValue, newValue) =>
    diff.metadata = new types.DifferenceCollection(diffKeyedEntities(oldValue, newValue, impl.diffMetadata)),
  Parameters: (diff, oldValue, newValue) =>
    diff.parameters = new types.DifferenceCollection(diffKeyedEntities(oldValue, newValue, impl.diffParameter)),
  Mappings: (diff, oldValue, newValue) =>
    diff.mappings = new types.DifferenceCollection(diffKeyedEntities(oldValue, newValue, impl.diffMapping)),
  Conditions: (diff, oldValue, newValue) =>
    diff.conditions = new types.DifferenceCollection(diffKeyedEntities(oldValue, newValue, impl.diffCondition)),
  Transform: (diff, oldValue, newValue) =>
    diff.transform = impl.diffAttribute(oldValue, newValue),
  Resources: (diff, oldValue, newValue) =>
    diff.resources = new types.DifferenceCollection(diffKeyedEntities(oldValue, newValue, impl.diffResource)),
  Outputs: (diff, oldValue, newValue) =>
    diff.outputs = new types.DifferenceCollection(diffKeyedEntities(oldValue, newValue, impl.diffOutput)),
};

/**
 * Compare two CloudFormation templates and return semantic differences between them.
 *
 * @param currentTemplate the current state of the stack.
 * @param newTemplate     the target state of the stack.
 * @param changeSet       the change set for this stack.
 *
 * @returns a +types.TemplateDiff+ object that represents the changes that will happen if
 *      a stack which current state is described by +currentTemplate+ is updated with
 *      the template +newTemplate+.
 */
export function fullDiff(
  currentTemplate: { [key: string]: any },
  newTemplate: { [key: string]: any },
  changeSet?: CloudFormation.DescribeChangeSetOutput,
): types.TemplateDiff {

  normalize(currentTemplate);
  normalize(newTemplate);
  const theDiff = diffTemplate(currentTemplate, newTemplate);
  if (changeSet) {
    filterFalsePositivies(theDiff, findResourceReplacements(changeSet));
  }

  return theDiff;
}

export function diffTemplate(
  currentTemplate: { [key: string]: any },
  newTemplate: { [key: string]: any },
): types.TemplateDiff {

  // Base diff
  const theDiff = calculateTemplateDiff(currentTemplate, newTemplate);

  // We're going to modify this in-place
  const newTemplateCopy = deepCopy(newTemplate);

  let didPropagateReferenceChanges;
  let diffWithReplacements;
  do {
    diffWithReplacements = calculateTemplateDiff(currentTemplate, newTemplateCopy);

    // Propagate replacements for replaced resources
    didPropagateReferenceChanges = false;
    if (diffWithReplacements.resources) {
      diffWithReplacements.resources.forEachDifference((logicalId, change) => {
        if (change.changeImpact === types.ResourceImpact.WILL_REPLACE) {
          if (propagateReplacedReferences(newTemplateCopy, logicalId)) {
            didPropagateReferenceChanges = true;
          }
        }
      });
    }
  } while (didPropagateReferenceChanges);

  // Copy "replaced" states from `diffWithReplacements` to `theDiff`.
  diffWithReplacements.resources
    .filter(r => isReplacement(r!.changeImpact))
    .forEachDifference((logicalId, downstreamReplacement) => {
      const resource = theDiff.resources.get(logicalId);

      if (resource.changeImpact !== downstreamReplacement.changeImpact) {
        propagatePropertyReplacement(downstreamReplacement, resource);
      }
    });

  return theDiff;
}

function isReplacement(impact: types.ResourceImpact) {
  return impact === types.ResourceImpact.MAY_REPLACE || impact === types.ResourceImpact.WILL_REPLACE;
}

/**
 * For all properties in 'source' that have a "replacement" impact, propagate that impact to "dest"
 */
function propagatePropertyReplacement(source: types.ResourceDifference, dest: types.ResourceDifference) {
  for (const [propertyName, diff] of Object.entries(source.propertyUpdates)) {
    if (diff.changeImpact && isReplacement(diff.changeImpact)) {
      // Use the propertydiff of source in target. The result of this happens to be clear enough.
      dest.setPropertyChange(propertyName, diff);
    }
  }
}

function calculateTemplateDiff(currentTemplate: { [key: string]: any }, newTemplate: { [key: string]: any }): types.TemplateDiff {
  const differences: types.ITemplateDiff = {};
  const unknown: { [key: string]: types.Difference<any> } = {};
  for (const key of unionOf(Object.keys(currentTemplate), Object.keys(newTemplate)).sort()) {
    const oldValue = currentTemplate[key];
    const newValue = newTemplate[key];
    if (deepEqual(oldValue, newValue)) {
      continue;
    }
    const handler: DiffHandler = DIFF_HANDLERS[key]
                  || ((_diff, oldV, newV) => unknown[key] = impl.diffUnknown(oldV, newV));
    handler(differences, oldValue, newValue);
  }
  if (Object.keys(unknown).length > 0) {
    differences.unknown = new types.DifferenceCollection(unknown);
  }

  return new types.TemplateDiff(differences);
}

/**
 * Compare two CloudFormation resources and return semantic differences between them
 */
export function diffResource(oldValue: types.Resource, newValue: types.Resource): types.ResourceDifference {
  return impl.diffResource(oldValue, newValue);
}

/**
 * Replace all references to the given logicalID on the given template, in-place
 *
 * Returns true iff any references were replaced.
 */
function propagateReplacedReferences(template: object, logicalId: string): boolean {
  let ret = false;

  function recurse(obj: any) {
    if (Array.isArray(obj)) {
      obj.forEach(recurse);
    }

    if (typeof obj === 'object' && obj !== null) {
      if (!replaceReference(obj)) {
        Object.values(obj).forEach(recurse);
      }
    }
  }

  function replaceReference(obj: any) {
    const keys = Object.keys(obj);
    if (keys.length !== 1) { return false; }
    const key = keys[0];

    if (key === 'Ref') {
      if (obj.Ref === logicalId) {
        obj.Ref = logicalId + ' (replaced)';
        ret = true;
      }
      return true;
    }

    if (key.startsWith('Fn::')) {
      if (Array.isArray(obj[key]) && obj[key].length > 0 && obj[key][0] === logicalId) {
        obj[key][0] = logicalId + '(replaced)';
        ret = true;
      }
      return true;
    }

    return false;
  }

  recurse(template);
  return ret;
}

function deepCopy(x: any): any {
  if (Array.isArray(x)) {
    return x.map(deepCopy);
  }

  if (typeof x === 'object' && x !== null) {
    const ret: any = {};
    for (const key of Object.keys(x)) {
      ret[key] = deepCopy(x[key]);
    }
    return ret;
  }

  return x;
}

function filterFalsePositivies(diff: types.TemplateDiff, replacements: types.ResourceReplacements) {
  diff.resources.forEachDifference((logicalId: string, change: types.ResourceDifference) => {
    change.forEachDifference((type: 'Property' | 'Other', name: string, value: types.Difference<any> | types.PropertyDifference<any>) => {
      if (type === 'Property') {
        if (!replacements[logicalId]) {
          (value as types.PropertyDifference<any>).changeImpact = types.ResourceImpact.NO_CHANGE;
          (value as types.PropertyDifference<any>).isDifferent = false;
          return;
        }
        // to make this work, diff needs to be aware that there can be nested templates. Currently, we don't really have this.

        /*
        if (name === 'NestedTemplate') {
          (value as types.PropertyDifference<any>).changeImpact = types.ResourceImpact.WILL_UPDATE;
          filterFalsePositivies(diff, replacements[logicalId].nestedReplacements!);
          return;
        }
        */

        switch (replacements[logicalId].propertiesReplaced[name]) {
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

        /*
        if (replacements[logicalId].nestedReplacements) {
          filterFalsePositivies(diff, replacements[logicalId].nestedReplacements!);
        }
        */
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

function findResourceReplacements(changeSet: NestedChangeSet): types.ResourceReplacements {
  const replacements: types.ResourceReplacements = {};
  for (const change of changeSet.Changes ?? []) {
    const propertiesReplaced: { [propName: string]: types.ChangeSetReplacement } = {};
    const resourceChange = change.ResourceChange;
    if (!resourceChange) {
      continue;
    }
    for (const propertyChange of resourceChange.Details ?? []) {
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
    replacements[resourceChange.LogicalResourceId!] = {
      resourceReplaced: resourceChange.Replacement === 'True',
      propertiesReplaced,
      nestedReplacements: resourceChange.NestedChanges ? findResourceReplacements(resourceChange.NestedChanges) : undefined,
    };
  }

  return replacements;
}

function normalize(template: any) {
  if (typeof template === 'object') {
    for (const key of (Object.keys(template ?? {}))) {
      if (key === 'Fn::GetAtt' && typeof template[key] === 'string') {
        template[key] = template[key].split('.');
        continue;
      } else if (key === 'DependsOn') {
        if (typeof template[key] === 'string') {
          template[key] = [template[key]];
        } else if (Array.isArray(template[key])) {
          template[key] = template[key].sort();
        }
        continue;
      }

      if (Array.isArray(template[key])) {
        for (const element of (template[key])) {
          normalize(element);
        }
      } else {
        normalize(template[key]);
      }
    }
  }
}
