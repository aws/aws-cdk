import type { ScheduleTargetBaseProps } from './target';
import { ScheduleTargetBase } from './target';
import type { IProjectRef } from '../../aws-codebuild';
import type { IRole } from '../../aws-iam';
import { PolicyStatement } from '../../aws-iam';
import type { IScheduleTarget } from '../../aws-scheduler';

/**
 * Use an AWS CodeBuild as a target for AWS EventBridge Scheduler.
 */
export class CodeBuildStartBuild extends ScheduleTargetBase implements IScheduleTarget {
  constructor(
    private readonly project: IProjectRef,
    props: ScheduleTargetBaseProps = {},
  ) {
    super(props, project.projectRef.projectArn);
  }

  protected addTargetActionToRole(role: IRole): void {
    role.addToPrincipalPolicy(new PolicyStatement({
      actions: ['codebuild:StartBuild'],
      resources: [this.project.projectRef.projectArn],
    }));
  }
}
