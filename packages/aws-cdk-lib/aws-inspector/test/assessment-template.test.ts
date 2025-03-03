import { App, Stack } from '../../core';
import { AssessmentTemplate, CfnAssessmentTarget, CfnAssessmentTemplate, IAssessmentTemplate } from '../lib';

describe('AssessmentTemplate', () => {
  let app: App;
  let stack: Stack;
  let assessmentTarget: CfnAssessmentTarget;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'Stack');
    assessmentTarget = new CfnAssessmentTarget(stack, 'AssessmentTarget', {
      assessmentTargetName: 'MyAssessmentTarget',
    });
  });

  describe('fromCfnAssessmentTemplate', () => {
    test('creates an IAssessmentTemplate from a CfnAssessmentTemplate', () => {
      // GIVEN
      const cfnAssessmentTemplate = new CfnAssessmentTemplate(stack, 'MyCfnAssessmentTemplate', {
        assessmentTargetArn: assessmentTarget.attrArn,
        durationInSeconds: 3600,
        // https://docs.aws.amazon.com/inspector/v1/userguide/inspector_rules-arns.html#us-east-1
        rulesPackageArns: ['arn:aws:inspector:us-east-1:316112463485:rulespackage/0-gEjTy7T7'],
      });

      // WHEN
      const assessmentTemplate = AssessmentTemplate.fromCfnAssessmentTemplate(stack, 'MyAssessmentTemplate', cfnAssessmentTemplate);

      // THEN
      expect(assessmentTemplate.assessmentTemplateArn).toBe(cfnAssessmentTemplate.attrArn);
    });

    test('can be used where IAssessmentTemplate is expected', () => {
      // GIVEN
      const cfnAssessmentTemplate = new CfnAssessmentTemplate(stack, 'MyCfnAssessmentTemplate', {
        assessmentTargetArn: 'arn:aws:inspector:us-west-2:123456789012:target/0-nvgVhaxX',
        assessmentTemplateName: 'MyTemplate',
        durationInSeconds: 3600,
        rulesPackageArns: ['arn:aws:inspector:us-east-1:316112463485:rulespackage/0-gEjTy7T7'],
      });

      // WHEN
      const assessmentTemplate = AssessmentTemplate.fromCfnAssessmentTemplate(stack, 'ImportedTemplate', cfnAssessmentTemplate);

      // THEN - this function accepts an IAssessmentTemplate
      function acceptsIAssessmentTemplate(template: IAssessmentTemplate) {
        return template.assessmentTemplateArn;
      }

      expect(acceptsIAssessmentTemplate(assessmentTemplate)).toBe(cfnAssessmentTemplate.attrArn);
    });
  });
});
