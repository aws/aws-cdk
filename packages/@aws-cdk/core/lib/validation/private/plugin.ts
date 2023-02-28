import { ConstructTree } from './construct-tree';
import { ValidationReport } from './report';
import { IValidationReport } from '../report';
import { IValidationContext } from '../validation';

/**
 * Used to configure the validation context passed to the validation
 * plugins
 */
export interface ValidationContextProps {
  /**
   * The absolute path of all templates to be processed
   */
  readonly templatePaths: string[];

  /**
   * The construct tree being validated
   */
  readonly tree: ConstructTree;
}

/**
 * Context available to plugins during validation.
 */
export class ValidationContext implements IValidationContext {
  /**
   * Report emitted by the validation.
   *
   * Plugins should interact with this object to generate the report.
   */
  public readonly report: IValidationReport;

  /**
   * The absolute path of all templates to be processed
   */
  public readonly templatePaths: string[];

  constructor(props: ValidationContextProps) {
    this.templatePaths = props.templatePaths;
    this.report = new ValidationReport(props.tree);
  }
}
