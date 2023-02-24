import * as cxapi from '@aws-cdk/cx-api';
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
    * The stack to be validated.
    */
  readonly stack: cxapi.CloudFormationStackArtifact;

  /**
   * The root of the construct tree being validated
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
    this.templateFullPath = props.stack.templateFullPath;
    this.report = new ValidationReport(props.tree);
  }
}
