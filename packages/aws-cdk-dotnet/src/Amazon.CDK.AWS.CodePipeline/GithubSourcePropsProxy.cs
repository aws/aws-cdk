using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodePipeline
{
    /// <summary>Construction properties of the {@link GitHubSource GitHub source action}</summary>
    [JsiiInterfaceProxy(typeof(IGithubSourceProps), "@aws-cdk/aws-codepipeline.GithubSourceProps")]
    internal class GithubSourcePropsProxy : DeputyBase, IGithubSourceProps
    {
        private GithubSourcePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>
        /// The name of the source's output artifact. Output artifacts are used by CodePipeline as
        /// inputs into other actions.
        /// </summary>
        [JsiiProperty("artifactName", "{\"primitive\":\"string\"}")]
        public virtual string ArtifactName
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>The GitHub account/user that owns the repo.</summary>
        [JsiiProperty("owner", "{\"primitive\":\"string\"}")]
        public virtual string Owner
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>The name of the repo, without the username.</summary>
        [JsiiProperty("repo", "{\"primitive\":\"string\"}")]
        public virtual string Repo
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>The branch to use.</summary>
        /// <remarks>default: "master"</remarks>
        [JsiiProperty("branch", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string Branch
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
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
        public virtual Secret OauthToken
        {
            get => GetInstanceProperty<Secret>();
            set => SetInstanceProperty(value);
        }

        /// <summary>Whether or not AWS CodePipeline should poll for source changes</summary>
        /// <remarks>default: true</remarks>
        [JsiiProperty("pollForSourceChanges", "{\"primitive\":\"boolean\",\"optional\":true}")]
        public virtual bool? PollForSourceChanges
        {
            get => GetInstanceProperty<bool? >();
            set => SetInstanceProperty(value);
        }
    }
}