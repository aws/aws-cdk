import actions = require('@aws-cdk/aws-codepipeline-api');
import cdk = require('@aws-cdk/cdk');
import { CfnWebhook } from './codepipeline.generated';

/**
 * Construction properties of the {@link GitHubSourceAction GitHub source action}.
 */
export interface GitHubSourceActionProps extends actions.CommonActionProps,
    actions.CommonActionConstructProps {
  /**
   * The name of the source's output artifact. Output artifacts are used by CodePipeline as
   * inputs into other actions.
   *
   * @default a name will be auto-generated
   */
  outputArtifactName?: string;

  /**
   * The GitHub account/user that owns the repo.
   */
  owner: string;

  /**
   * The name of the repo, without the username.
   */
  repo: string;

  /**
   * The branch to use.
   *
   * @default "master"
   */
  branch?: string;

  /**
   * A GitHub OAuth token to use for authentication.
   *
   * It is recommended to use a `SecretParameter` to obtain the token from the SSM
   * Parameter Store:
   *
   *   const oauth = new cdk.SecretParameter(this, 'GitHubOAuthToken', { ssmParameter: 'my-github-token' });
   *   new GitHubSource(this, 'GitHubAction', { oauthToken: oauth.value, ... });
   */
  oauthToken: cdk.Secret;

  /**
   * Whether AWS CodePipeline should poll for source changes.
   * If this is `false`, the Pipeline will use a webhook to detect source changes instead.
   *
   * @default false
   */
  pollForSourceChanges?: boolean;
}

/**
 * Source that is provided by a GitHub repository.
 */
export class GitHubSourceAction extends actions.SourceAction {
  constructor(scope: cdk.Construct, id: string, props: GitHubSourceActionProps) {
    super(scope, id, {
      ...props,
      owner: 'ThirdParty',
      provider: 'GitHub',
      configuration: {
        Owner: props.owner,
        Repo: props.repo,
        Branch: props.branch || "master",
        OAuthToken: props.oauthToken,
        PollForSourceChanges: props.pollForSourceChanges || false,
      },
      outputArtifactName: props.outputArtifactName
    });

    if (!props.pollForSourceChanges) {
      new CfnWebhook(this, 'WebhookResource', {
        authentication: 'GITHUB_HMAC',
        authenticationConfiguration: {
          secretToken: props.oauthToken.toString(),
        },
        filters: [
          {
            jsonPath: '$.ref',
            matchEquals: 'refs/heads/{Branch}',
          },
        ],
        targetAction: this.node.id,
        targetPipeline: props.stage.pipeline.pipelineName,
        targetPipelineVersion: 1,
        registerWithThirdParty: true,
      });
    }
  }
}
