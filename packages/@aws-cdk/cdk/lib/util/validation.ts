import { IConstruct } from "../core/construct";

/**
 * Validate the given construct and throw if there are any errors
 */
export function validateAndThrow(construct: IConstruct) {
  const errors = construct.node.validateTree();
  if (errors.length > 0) {
    const errorList = errors.map(e => `[${e.source.node.path}] ${e.message}`).join('\n  ');
    throw new Error(`Stack validation failed with the following errors:\n  ${errorList}`);
  }
}