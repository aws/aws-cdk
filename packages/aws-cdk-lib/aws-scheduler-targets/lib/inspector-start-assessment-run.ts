import type { ScheduleTargetBaseProps } from './target';
import { ScheduleTargetBase } from './target';
import type { IRole } from '../../aws-iam';
import { PolicyStatement } from '../../aws-iam';
import type { IScheduleTarget } from '../../aws-scheduler';
import type { IAssessmentTemplateRef } from '../../interfaces/generated/aws-inspector-interfaces.generated';

/**
 * Use an Amazon Inspector as a target for AWS EventBridge Scheduler.
 */
export class InspectorStartAssessmentRun extends ScheduleTargetBase implements IScheduleTarget {
  constructor(
    template: IAssessmentTemplateRef,
    props: ScheduleTargetBaseProps = {},
  ) {
    super(props, template.assessmentTemplateRef.assessmentTemplateArn);
  }

  protected addTargetActionToRole(role: IRole): void {
    role.addToPrincipalPolicy(new PolicyStatement({
      actions: ['inspector:StartAssessmentRun'],
      // The wildcard is intentional here as Amazon Inspector does not support specifying a resource ARN in the Resource element of an IAM policy statement.
      // See https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazoninspector.html#amazoninspector-resources-for-iam-policies.
      resources: ['*'],
    }));
  }
}
