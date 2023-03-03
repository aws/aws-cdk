/**
 * Used to configure the validation context passed to the validation
 * plugins
 */
export interface ValidationContext {
  /**
   * The absolute path of all templates to be processed
   */
  readonly templatePaths: string[];
}
