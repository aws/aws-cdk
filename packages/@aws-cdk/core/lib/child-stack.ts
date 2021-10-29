/**
 * Interface for child stacks (e.g. nested) or non-top level stacks
 * to implement so that they can be properly resolved during synthesis.
 *
 */
export interface IChildStack {
  /**
   * _prepare
   * @internal
   */
  _prepareTemplateAsset(): boolean;
}