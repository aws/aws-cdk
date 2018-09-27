import actions = require('@aws-cdk/aws-codepipeline-api');
import cdk = require('@aws-cdk/cdk');

/**
 * Construction properties of the {@link GitHubSourceAction GitHub source action}.
 */
export interface GitHubSourceActionProps extends actions.CommonActionProps {
  /**
   * The name of the source's output artifact. Output artifacts are used by CodePipeline as
   * inputs into other actions.
   */
  artifactName: string;

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
   *   const oauth = new SecretParameter(this, 'GitHubOAuthToken', { ssmParameter: 'my-github-token });
   *   new GitHubSource(stage, 'GH' { oauthToken: oauth });
   *
   */
  oauthToken: cdk.Secret;

  /**
   * Whether or not AWS CodePipeline should poll for source changes
   *
   * @default true
   */
  pollForSourceChanges?: boolean;
}

/**
 * Source that is provided by a GitHub repository.
 */
export class GitHubSourceAction extends actions.SourceAction {
  constructor(parent: cdk.Construct, name: string, props: GitHubSourceActionProps) {
    super(parent, name, {
      stage: props.stage,
      owner: 'ThirdParty',
      provider: 'GitHub',
      configuration: {
        Owner: props.owner,
        Repo: props.repo,
        Branch: props.branch || "master",
        OAuthToken: props.oauthToken,
        PollForSourceChanges: props.pollForSourceChanges || true
      },
      artifactName: props.artifactName
    });
  }
}
