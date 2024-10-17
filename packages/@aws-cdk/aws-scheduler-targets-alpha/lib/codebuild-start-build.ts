import { ISchedule, IScheduleTarget } from '@aws-cdk/aws-scheduler-alpha';
import { IProject } from 'aws-cdk-lib/aws-codebuild';
import { IRole, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { ScheduleTargetBase, ScheduleTargetBaseProps } from './target';

/**
 * Use an AWS CodeBuild as a target for AWS EventBridge Scheduler.
 */
export class CodeBuildStartBuild extends ScheduleTargetBase implements IScheduleTarget {
  private readonly project: IProject;

  constructor(
    project: IProject,
    props: ScheduleTargetBaseProps = {},
  ) {
    super(props, project.projectArn);
    this.project = project;
  }

  protected addTargetActionToRole(_schedule: ISchedule, role: IRole): void {
    role.addToPrincipalPolicy(new PolicyStatement({
      actions: ['codebuild:StartBuild'],
      resources: [this.project.projectArn],
    }));
  }
}
