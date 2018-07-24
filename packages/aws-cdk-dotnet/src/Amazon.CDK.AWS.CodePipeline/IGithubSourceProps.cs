using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodePipeline
{
    /// <summary>Construction properties of the {@link GitHubSource GitHub source action}</summary>
    [JsiiInterface(typeof(IGithubSourceProps), "@aws-cdk/aws-codepipeline.GithubSourceProps")]
    public interface IGithubSourceProps
    {
        /// <summary>
        /// The name of the source's output artifact. Output artifacts are used by CodePipeline as
        /// inputs into other actions.
        /// </summary>
        [JsiiProperty("artifactName", "{\"primitive\":\"string\"}")]
        string ArtifactName
        {
            get;
            set;
        }

        /// <summary>The GitHub account/user that owns the repo.</summary>
        [JsiiProperty("owner", "{\"primitive\":\"string\"}")]
        string Owner
        {
            get;
            set;
        }

        /// <summary>The name of the repo, without the username.</summary>
        [JsiiProperty("repo", "{\"primitive\":\"string\"}")]
        string Repo
        {
            get;
            set;
        }

        /// <summary>The branch to use.</summary>
        /// <remarks>default: "master"</remarks>
        [JsiiProperty("branch", "{\"primitive\":\"string\",\"optional\":true}")]
        string Branch
        {
            get;
            set;
        }

        /// <summary>
        /// A GitHub OAuth token to use for authentication.
        /// 
        /// It is recommended to use a `SecretParameter` to obtain the token from the SSM
        /// Parameter Store:
        /// 
        ///      const oauth = new SecretParameter(this, 'GitHubOAuthToken', { ssmParameter: 'my-github-token });
        ///      new GitHubSource(stage, 'GH' { oauthToken: oauth });
        /// </summary>
        [JsiiProperty("oauthToken", "{\"fqn\":\"@aws-cdk/cdk.Secret\"}")]
        Secret OauthToken
        {
            get;
            set;
        }

        /// <summary>Whether or not AWS CodePipeline should poll for source changes</summary>
        /// <remarks>default: true</remarks>
        [JsiiProperty("pollForSourceChanges", "{\"primitive\":\"boolean\",\"optional\":true}")]
        bool? PollForSourceChanges
        {
            get;
            set;
        }
    }
}