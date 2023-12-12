import { ISchedule, IScheduleTarget } from '@aws-cdk/aws-scheduler-alpha';
import { Names } from 'aws-cdk-lib';
import { IRole, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { CfnAssessmentTemplate } from 'aws-cdk-lib/aws-inspector';
import { ScheduleTargetBase, ScheduleTargetBaseProps } from './target';
import { sameEnvDimension } from './util';

/**
 * Use an Amazon Inspector as a target for AWS EventBridge Scheduler.
 */
export class InspectorStartAssessmentRun extends ScheduleTargetBase implements IScheduleTarget {
  constructor(
    private readonly template: CfnAssessmentTemplate,
    private readonly props: ScheduleTargetBaseProps = {},
  ) {
    super(props, template.attrArn);
  }

  protected addTargetActionToRole(schedule: ISchedule, role: IRole): void {
    if (!sameEnvDimension(this.template.stack.region, schedule.env.region)) {
      throw new Error(`Cannot assign assessment template in region ${this.template.stack.region} to the schedule ${Names.nodeUniqueId(schedule.node)} in region ${schedule.env.region}. Both the schedule and the assessment template must be in the same region.`);
    }

    if (!sameEnvDimension(this.template.stack.account, schedule.env.account)) {
      throw new Error(`Cannot assign assessment template in account ${this.template.stack.account} to the schedule ${Names.nodeUniqueId(schedule.node)} in account ${schedule.env.region}. Both the schedule and the assessment template must be in the same account.`);
    }

    if (this.props.role && !sameEnvDimension(this.props.role.env.account, this.template.stack.account)) {
      throw new Error(`Cannot grant permission to execution role in account ${this.props.role.env.account} to invoke target ${Names.nodeUniqueId(this.template.node)} in account ${this.template.stack.account}. Both the target and the execution role must be in the same account.`);
    }

    role.addToPrincipalPolicy(new PolicyStatement({
      actions: ['inspector:StartAssessmentRun'],
      resources: ['*'],
    }));
  }
}