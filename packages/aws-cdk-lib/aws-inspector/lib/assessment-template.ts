import { Construct } from 'constructs';
import { CfnAssessmentTemplate } from './inspector.generated';
import { IResource, Resource } from '../../core';

/**
 * Interface for an Inspector Assessment Template
 */
export interface IAssessmentTemplate extends IResource {
  /**
   * The Amazon Resource Name (ARN) of the assessment template.
   * @attribute
   */
  readonly assessmentTemplateArn: string;
}

/**
 * An Amazon Inspector assessment template.
 * TODO: This class should implement IAssessmentTemplate when writing the L2 construct
 */
export class AssessmentTemplate extends Resource {
  /**
   * Creates an AssessmentTemplate from an existing CfnAssessmentTemplate.
   *
   * This method is provided to bridge the gap with L2 constructs since no L2 constructs
   * exist for Inspector resources yet. It allows working with CfnAssessmentTemplate (L1)
   * resources through the IAssessmentTemplate interface.
   */
  public static fromCfnAssessmentTemplate(scope: Construct, id: string, template: CfnAssessmentTemplate): IAssessmentTemplate {
    return new class extends Resource implements IAssessmentTemplate {
      public readonly assessmentTemplateArn: string;
      constructor() {
        super(scope, id);
        this.assessmentTemplateArn = template.attrArn;
      }
    }();
  }
}
