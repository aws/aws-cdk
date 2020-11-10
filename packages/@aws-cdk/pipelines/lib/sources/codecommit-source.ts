import * as codecommit from '@aws-cdk/aws-codecommit';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipelineActions from '@aws-cdk/aws-codepipeline-actions';
import * as iam from '@aws-cdk/aws-iam';
import { ISource } from './source';

/**
 * Construction properties of the {@link CodeCommitSource GitHub source}.
 */
export interface CodeCommitSourceProps {

  /**
   * The branch to use.
   *
   * @default 'master'
   */
  readonly branch?: string;

  /**
   * How should CodePipeline detect source changes for this Action.
   *
   * @default CodeCommitTrigger.EVENTS
   */
  readonly trigger?: codepipelineActions.CodeCommitTrigger;

  /**
   * The CodeCommit repository.
   */
  readonly repository: codecommit.IRepository;

  /**
   * Role to be used by on commit event rule.
   * Used only when trigger value is CodeCommitTrigger.EVENTS.
   *
   * @default a new role will be created.
   */
  readonly eventRole?: iam.IRole;
}

/**
 * A CDK Pipeline source provider for CodeCommit.
 *
 * @experimental
 */
export class CodeCommitSource implements ISource {

  constructor(private readonly props: CodeCommitSourceProps) {
    //
  }

  public provideSourceAction(sourceArtifact: codepipeline.Artifact): codepipeline.IAction {
    return new codepipelineActions.CodeCommitSourceAction({
      repository: this.props.repository,
      actionName: this.props.repository.repositoryName,
      output: sourceArtifact,
      branch: this.props.branch,
      trigger: this.props.trigger,
      eventRole: this.props.eventRole,
    });
  }
}
