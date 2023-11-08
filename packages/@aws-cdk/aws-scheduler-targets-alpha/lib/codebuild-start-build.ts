import { ISchedule, IScheduleTarget } from '@aws-cdk/aws-scheduler-alpha';
import { Names } from 'aws-cdk-lib';
import { IProject } from 'aws-cdk-lib/aws-codebuild';
import { IRole, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { ScheduleTargetBase, ScheduleTargetBaseProps } from './target';
import { sameEnvDimension } from './util';

/**
 * Use an AWS CodeBuild as a target for AWS EventBridge Scheduler.
 */
export class CodeBuildStartBuild extends ScheduleTargetBase implements IScheduleTarget {
  constructor(
    private readonly project: IProject,
    private readonly props: ScheduleTargetBaseProps = {},
  ) {
    super(props, project.projectArn);
  }

  protected addTargetActionToRole(schedule: ISchedule, role: IRole): void {
    if (!sameEnvDimension(this.project.env.region, schedule.env.region)) {
      throw new Error(`Cannot assign project in region ${this.project.env.region} to the schedule ${Names.nodeUniqueId(schedule.node)} in region ${schedule.env.region}. Both the schedule and the project must be in the same region.`);
    }

    if (!sameEnvDimension(this.project.env.account, schedule.env.account)) {
      throw new Error(`Cannot assign project in account ${this.project.env.account} to the schedule ${Names.nodeUniqueId(schedule.node)} in account ${schedule.env.region}. Both the schedule and the project must be in the same account.`);
    }

    if (this.props.role && !sameEnvDimension(this.props.role.env.account, schedule.env.account)) {
      throw new Error(`Cannot grant permission to execution role in account ${this.props.role.env.account} to invoke target ${Names.nodeUniqueId(schedule.node)} in account ${schedule.env.account}. Both the target and the execution role must be in the same account.`);
    }

    role.addToPrincipalPolicy(new PolicyStatement({
      actions: ['codebuild:StartBuild'],
      resources: [this.project.projectArn],
    }));
  }
}
