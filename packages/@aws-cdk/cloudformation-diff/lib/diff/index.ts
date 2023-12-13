import { Resource } from '@aws-cdk/service-spec-types';
import * as types from './types';
import { deepEqual, diffKeyedEntities, loadResourceModel } from './util';

export function diffAttribute(oldValue: any, newValue: any): types.Difference<string> {
  return new types.Difference<string>(_asString(oldValue), _asString(newValue));
}

export function diffCondition(oldValue: types.Condition, newValue: types.Condition): types.ConditionDifference {
  return new types.ConditionDifference(oldValue, newValue);
}

export function diffMapping(oldValue: types.Mapping, newValue: types.Mapping): types.MappingDifference {
  return new types.MappingDifference(oldValue, newValue);
}

export function diffMetadata(oldValue: types.Metadata, newValue: types.Metadata): types.MetadataDifference {
  return new types.MetadataDifference(oldValue, newValue);
}

export function diffOutput(oldValue: types.Output, newValue: types.Output): types.OutputDifference {
  return new types.OutputDifference(oldValue, newValue);
}

export function diffParameter(oldValue: types.Parameter, newValue: types.Parameter): types.ParameterDifference {
  return new types.ParameterDifference(oldValue, newValue);
}

export function diffResource(
  oldValue?: types.Resource,
  newValue?: types.Resource,
  _key?: string,
  replacement?: types.ResourceReplacement,
  keepMetadata?: boolean,
): types.ResourceDifference {
  const resourceType = {
    oldType: oldValue && oldValue.Type,
    newType: newValue && newValue.Type,
  };
  let propertyDiffs: { [key: string]: types.PropertyDifference<any> } = {};
  let otherDiffs: { [key: string]: types.Difference<any> } = {};

  if (resourceType.oldType !== undefined && resourceType.oldType === resourceType.newType) {
    // Only makes sense to inspect deeper if the types stayed the same
    const impl = loadResourceModel(resourceType.oldType);
    propertyDiffs = diffKeyedEntities(oldValue!.Properties,
      newValue!.Properties,
      (oldVal, newVal, key) => _diffProperty(oldVal, newVal, key, impl, replacement));

    otherDiffs = diffKeyedEntities(oldValue, newValue, _diffOther);
    delete otherDiffs.Properties;
    // eslint-disable-next-line no-console
    console.log('keepMetadata??' + keepMetadata);
    if (keepMetadata === false) {
      delete otherDiffs.Metadata;
    }
  }

  return new types.ResourceDifference(oldValue, newValue, {
    resourceType, propertyDiffs, otherDiffs,
  });

  function _diffProperty(oldV: any, newV: any, key: string, resourceSpec?: Resource, changeSetReplacement?: types.ResourceReplacement) {
    let changeImpact: types.ResourceImpact = types.ResourceImpact.NO_CHANGE;
    if (changeSetReplacement === undefined) {
      changeImpact = _resourceSpecImpact(oldV, newV, key, resourceSpec);
    } else {
      if (!(key in changeSetReplacement.propertiesReplaced)) {
        // The changeset does not contain this property, which means it is not going to be updated. Hide this cosmetic template-only change from the diff
        return new types.PropertyDifference(1, 1, { changeImpact });
      }

      switch (changeSetReplacement.propertiesReplaced[key]) {
        case 'Always':
          changeImpact = types.ResourceImpact.WILL_REPLACE;
          break;
        case 'Conditionally':
          changeImpact = types.ResourceImpact.MAY_REPLACE;
          break;
        case 'Never':
          changeImpact = types.ResourceImpact.WILL_UPDATE;
          break;
      }
    }

    return new types.PropertyDifference(oldV, newV, { changeImpact });
  }

  function _resourceSpecImpact(oldV: any, newV: any, key: string, resourceSpec?: Resource) {
    const spec = resourceSpec?.properties?.[key];
    if (spec && !deepEqual(oldV, newV)) {
      switch (spec.causesReplacement) {
        case 'yes':
          return types.ResourceImpact.WILL_REPLACE;
        case 'maybe':
          return types.ResourceImpact.MAY_REPLACE;
        default:
          // In those cases, whatever is the current value is what we should keep
          return types.ResourceImpact.WILL_UPDATE;
      }
    }

    return types.ResourceImpact.NO_CHANGE;
  }

  function _diffOther(oldV: any, newV: any) {
    return new types.Difference(oldV, newV);
  }
}

export function diffUnknown(oldValue: any, newValue: any): types.Difference<any> {
  return new types.Difference(oldValue, newValue);
}

/**
 * Coerces a given value to +string | undefined+.
 *
 * @param value the value to be coerced.
 *
 * @returns +undefined+ if +value+ is +null+ or +undefined+,
 *      +value+ if it is a +string+,
 *      a compact JSON representation of +value+ otherwise.
 */
function _asString(value: any): string | undefined {
  if (value == null) {
    return undefined;
  }
  if (typeof value === 'string') {
    return value as string;
  }
  return JSON.stringify(value);
}
