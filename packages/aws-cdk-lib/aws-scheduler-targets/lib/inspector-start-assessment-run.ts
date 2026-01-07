import { ScheduleTargetBase, ScheduleTargetBaseProps } from './target';
import { IRole, PolicyStatement } from '../../aws-iam';
import { IScheduleTarget } from '../../aws-scheduler';
import { IAssessmentTemplateRef } from '../../interfaces/generated/aws-inspector-interfaces.generated';

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
