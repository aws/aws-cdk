import { IScheduleTarget } from '@aws-cdk/aws-scheduler-alpha';
import { IRole, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { CfnAssessmentTemplate } from 'aws-cdk-lib/aws-inspector';
import { ScheduleTargetBase, ScheduleTargetBaseProps } from './target';

/**
 * Use an Amazon Inspector as a target for AWS EventBridge Scheduler.
 */
export class InspectorStartAssessmentRun extends ScheduleTargetBase implements IScheduleTarget {
  constructor(
    template: CfnAssessmentTemplate,
    props: ScheduleTargetBaseProps = {},
  ) {
    super(props, template.attrArn);
  }

  protected addTargetActionToRole(role: IRole): void {
    role.addToPrincipalPolicy(new PolicyStatement({
      actions: ['inspector:StartAssessmentRun'],
      resources: ['*'],
    }));
  }
}
