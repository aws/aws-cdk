import { IScheduleTarget } from '@aws-cdk/aws-scheduler-alpha';
import { IRole, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { IAssessmentTemplate } from 'aws-cdk-lib/aws-inspector';
import { ScheduleTargetBase, ScheduleTargetBaseProps } from './target';

/**
 * Use an Amazon Inspector as a target for AWS EventBridge Scheduler.
 */
export class InspectorStartAssessmentRun extends ScheduleTargetBase implements IScheduleTarget {
  constructor(
    template: IAssessmentTemplate,
    props: ScheduleTargetBaseProps = {},
  ) {
    super(props, template.assessmentTemplateArn);
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
