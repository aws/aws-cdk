/**
 * Interface for child stacks (e.g. nested) or non-top level stacks
 * to implement so that they can be properly resolved during synthesis.
 *
 */
export interface IChildStack {
  /**
   * This private API is used by `App.prepare()` within a loop that rectifies
   * references every time an asset is added.
   * 
   * @internal
   */
  _prepareTemplateAsset(): boolean;
}