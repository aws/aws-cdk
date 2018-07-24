using Amazon.CDK.AWS.CodeBuild.cloudformation.ProjectResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodeBuild
{
    /// <summary>GitHub Enterprice Source definition for a CodeBuild project</summary>
    [JsiiClass(typeof(GitHubEnterpriseSource), "@aws-cdk/aws-codebuild.GitHubEnterpriseSource", "[{\"name\":\"cloneUrl\",\"type\":{\"primitive\":\"string\"}}]")]
    public class GitHubEnterpriseSource : BuildSource
    {
        public GitHubEnterpriseSource(string cloneUrl): base(new DeputyProps(new object[]{cloneUrl}))
        {
        }

        protected GitHubEnterpriseSource(ByRefValue reference): base(reference)
        {
        }

        protected GitHubEnterpriseSource(DeputyProps props): base(props)
        {
        }

        [JsiiMethod("toSourceJSON", "{\"fqn\":\"@aws-cdk/aws-codebuild.cloudformation.ProjectResource.SourceProperty\"}", "[]")]
        public override ISourceProperty ToSourceJSON()
        {
            return InvokeInstanceMethod<ISourceProperty>(new object[]{});
        }
    }
}