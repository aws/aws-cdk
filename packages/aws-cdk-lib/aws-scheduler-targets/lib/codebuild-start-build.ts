import { ScheduleTargetBase, ScheduleTargetBaseProps } from './target';
import { IProject } from '../../aws-codebuild';
import { IRole, PolicyStatement } from '../../aws-iam';
import { IScheduleTarget } from '../../aws-scheduler';

/**
 * Use an AWS CodeBuild as a target for AWS EventBridge Scheduler.
 */
export class CodeBuildStartBuild extends ScheduleTargetBase implements IScheduleTarget {
  constructor(
    private readonly project: IProject,
    props: ScheduleTargetBaseProps = {},
  ) {
    super(props, project.projectArn);
  }

  protected addTargetActionToRole(role: IRole): void {
    role.addToPrincipalPolicy(new PolicyStatement({
      actions: ['codebuild:StartBuild'],
      resources: [this.project.projectArn],
    }));
  }
}
