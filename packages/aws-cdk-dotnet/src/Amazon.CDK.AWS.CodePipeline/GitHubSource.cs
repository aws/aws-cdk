using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodePipeline
{
    /// <summary>Source that is provided by a GitHub repository</summary>
    [JsiiClass(typeof(GitHubSource), "@aws-cdk/aws-codepipeline.GitHubSource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/aws-codepipeline.Stage\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-codepipeline.GithubSourceProps\"}}]")]
    public class GitHubSource : Source
    {
        public GitHubSource(Stage parent, string name, IGithubSourceProps props): base(new DeputyProps(new object[]{parent, name, props}))
        {
        }

        protected GitHubSource(ByRefValue reference): base(reference)
        {
        }

        protected GitHubSource(DeputyProps props): base(props)
        {
        }
    }
}