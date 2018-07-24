using Amazon.CDK.AWS.CodeBuild.cloudformation.ProjectResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodeBuild
{
    /// <summary>GitHub Source definition for a CodeBuild project</summary>
    [JsiiClass(typeof(GitHubSource), "@aws-cdk/aws-codebuild.GitHubSource", "[{\"name\":\"httpscloneUrl\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"oauthToken\",\"type\":{\"primitive\":\"any\"}}]")]
    public class GitHubSource : BuildSource
    {
        public GitHubSource(string httpscloneUrl, object oauthToken): base(new DeputyProps(new object[]{httpscloneUrl, oauthToken}))
        {
        }

        protected GitHubSource(ByRefValue reference): base(reference)
        {
        }

        protected GitHubSource(DeputyProps props): base(props)
        {
        }

        [JsiiMethod("toSourceJSON", "{\"fqn\":\"@aws-cdk/aws-codebuild.cloudformation.ProjectResource.SourceProperty\"}", "[]")]
        public override ISourceProperty ToSourceJSON()
        {
            return InvokeInstanceMethod<ISourceProperty>(new object[]{});
        }
    }
}