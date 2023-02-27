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
    * The path to the template being validated
    */
  readonly stackTemplatePath: string;

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
   * The full path to the CloudFormation template in the Cloud Assembly
   */
  public readonly templateFullPath: string;

  constructor(props: ValidationContextProps) {
    this.templateFullPath = props.stackTemplatePath;
    this.report = new ValidationReport(props.tree);
  }
}
