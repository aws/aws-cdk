using Amazon.CDK.AWS.CodeBuild.cloudformation.ProjectResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodeBuild
{
    [JsiiClass(typeof(CodePipelineBuildArtifacts), "@aws-cdk/aws-codebuild.CodePipelineBuildArtifacts", "[]")]
    public class CodePipelineBuildArtifacts : BuildArtifacts
    {
        public CodePipelineBuildArtifacts(): base(new DeputyProps(new object[]{}))
        {
        }

        protected CodePipelineBuildArtifacts(ByRefValue reference): base(reference)
        {
        }

        protected CodePipelineBuildArtifacts(DeputyProps props): base(props)
        {
        }

        [JsiiMethod("toArtifactsJSON", "{\"fqn\":\"@aws-cdk/aws-codebuild.cloudformation.ProjectResource.ArtifactsProperty\"}", "[]")]
        public override IArtifactsProperty ToArtifactsJSON()
        {
            return InvokeInstanceMethod<IArtifactsProperty>(new object[]{});
        }
    }
}