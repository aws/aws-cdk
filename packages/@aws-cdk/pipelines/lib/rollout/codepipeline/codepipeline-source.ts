import * as cp from '@aws-cdk/aws-codepipeline';
import * as cp_actions from '@aws-cdk/aws-codepipeline-actions';
import { SecretValue, Token } from '@aws-cdk/core';
import { IArtifactable } from '../frontend/artifactable';
import { WorkflowArtifact } from '../workflow';
import { CodePipelineActionFactory, CodePipelineActionOptions } from './codepipeline-action';


export class CodePipelineSource {
  public static fromString(repoString: string): IArtifactable {
    if (Token.isUnresolved(repoString)) {
      throw new Error('Argument to CodePipelineSource.fromString() cannot be unresolved');
    }

    const githubPrefix = 'https://github.com/';
    if (repoString.startsWith(githubPrefix)) {
      return CodePipelineSource.gitHub(repoString.substr(githubPrefix.length));
    }

    throw new Error(`CodePipelineSource.fromString(): unrecognized string format: '${repoString}'`);
  }

  public static gitHub(repoString: string, props: GitHubSourceOptions = {}): IArtifactable {
    const parts = repoString.split('/');
    if (parts.length !== 2) {
      throw new Error(`GitHub repository name should look like '<owner>/<repo>', got '${repoString}'`);
    }
    const owner = parts[0];
    const repo = parts[1];
    const branch = props.branch ?? 'main';
    const authentication = props.authentication ?? SecretValue.secretsManager('github-token');
    const primaryOutput = new WorkflowArtifact(`source:${owner}/${repo}`);
    let added = false;

    return {
      addToWorkflow(options) {
        if (added) { return; }
        added = true;

        const action = new class extends CodePipelineActionFactory {
          public produce(opts: CodePipelineActionOptions): cp.IAction {
            return new cp_actions.GitHubSourceAction({
              actionName: opts.actionName,
              oauthToken: authentication,
              output: opts.artifacts.toCodePipeline(primaryOutput),
              owner,
              repo,
              branch,
              runOrder: opts.runOrder,
              trigger: cp_actions.GitHubTrigger.WEBHOOK,
            });
          }
        }(`${owner}/${repo}`);
        primaryOutput.producedBy(action);
        options.workflow.sourceStage.add(action);
      },

      primaryOutput,
    };
  }
}

export interface GitHubSourceOptions {
  /**
   * The branch to use.
   *
   * @default "main"
   */
  readonly branch?: string;

  /**
   * A GitHub OAuth token to use for authentication.
   *
   * It is recommended to use a Secrets Manager `Secret` to obtain the token:
   *
   *   const oauth = cdk.SecretValue.secretsManager('my-github-token');
   *   new GitHubSource(this, 'GitHubSource', { oauthToken: oauth, ... });
   *
   * The GitHub Personal Access Token should have these scopes:
   *
   * * **repo** - to read the repository
   * * **admin:repo_hook** - if you plan to use webhooks (true by default)
   *
   * @see https://docs.aws.amazon.com/codepipeline/latest/userguide/GitHub-create-personal-token-CLI.html
   *
   * @default - SecretValue.secretsManager('github-token')
   */
  readonly authentication?: SecretValue;
}