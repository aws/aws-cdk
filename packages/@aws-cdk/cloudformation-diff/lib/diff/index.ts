import * as cfnspec from '@aws-cdk/cfnspec';
import * as types from './types';
import { deepEqual, diffKeyedEntities } from './util';

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

export function diffResource(oldValue?: types.Resource, newValue?: types.Resource): types.ResourceDifference {
  const resourceType = {
    oldType: oldValue && oldValue.Type,
    newType: newValue && newValue.Type,
  };
  let propertyDiffs: { [key: string]: types.PropertyDifference<any> } = {};
  let otherDiffs: { [key: string]: types.Difference<any> } = {};

  if (resourceType.oldType !== undefined && resourceType.oldType === resourceType.newType) {
    // Only makes sense to inspect deeper if the types stayed the same
    const typeSpec = cfnspec.filteredSpecification(resourceType.oldType);
    const impl = typeSpec.ResourceTypes[resourceType.oldType];
    propertyDiffs = diffKeyedEntities(oldValue!.Properties,
      newValue!.Properties,
      (oldVal, newVal, key) => _diffProperty(oldVal, newVal, key, impl));

    otherDiffs = diffKeyedEntities(oldValue, newValue, _diffOther);
    delete otherDiffs.Properties;
  }

  return new types.ResourceDifference(oldValue, newValue, {
    resourceType, propertyDiffs, otherDiffs,
  });

  function _diffProperty(oldV: any, newV: any, key: string, resourceSpec?: cfnspec.schema.ResourceType) {
    let changeImpact = types.ResourceImpact.NO_CHANGE;

    const spec = resourceSpec && resourceSpec.Properties && resourceSpec.Properties[key];
    if (spec && !deepEqual(oldV, newV)) {
      switch (spec.UpdateType) {
        case cfnspec.schema.UpdateType.Immutable:
          changeImpact = types.ResourceImpact.WILL_REPLACE;
          break;
        case cfnspec.schema.UpdateType.Conditional:
          changeImpact = types.ResourceImpact.MAY_REPLACE;
          break;
        default:
          // In those cases, whatever is the current value is what we should keep
          changeImpact = types.ResourceImpact.WILL_UPDATE;
      }
    }

    return new types.PropertyDifference(oldV, newV, { changeImpact });
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
