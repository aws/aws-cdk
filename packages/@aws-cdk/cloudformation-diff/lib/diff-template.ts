import impl = require('./diff');
import types = require('./diff/types');
import { deepEqual, diffKeyedEntities, unionOf } from './diff/util';

export * from './diff/types';

type DiffHandler = (diff: types.ITemplateDiff, oldValue: any, newValue: any) => void;
type HandlerRegistry = { [section: string]: DiffHandler };

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
 * @param newTemplate   the target state of the stack.
 *
 * @returns a +types.TemplateDiff+ object that represents the changes that will happen if
 *      a stack which current state is described by +currentTemplate+ is updated with
 *      the template +newTemplate+.
 */
export function diffTemplate(currentTemplate: { [key: string]: any }, newTemplate: { [key: string]: any }): types.TemplateDiff {
  const differences: types.ITemplateDiff = {};
  const unknown: { [key: string]: types.Difference<any> } = {};
  for (const key of unionOf(Object.keys(currentTemplate), Object.keys(newTemplate)).sort()) {
    const oldValue = currentTemplate[key];
    const newValue = newTemplate[key];
    if (deepEqual(oldValue, newValue)) { continue; }
    const handler: DiffHandler = DIFF_HANDLERS[key]
                   || ((_diff, oldV, newV) => unknown[key] = impl.diffUnknown(oldV, newV));
    handler(differences, oldValue, newValue);
  }
  if (Object.keys(unknown).length > 0) { differences.unknown = new types.DifferenceCollection(unknown); }
  return new types.TemplateDiff(differences);
}

/**
 * Compare two CloudFormation resources and return semantic differences between them
 */
export function diffResource(oldValue: types.Resource, newValue: types.Resource): types.ResourceDifference {
  return impl.diffResource(oldValue, newValue);
}
