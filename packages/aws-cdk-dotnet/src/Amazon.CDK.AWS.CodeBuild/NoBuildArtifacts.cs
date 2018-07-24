using Amazon.CDK.AWS.CodeBuild.cloudformation.ProjectResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodeBuild
{
    [JsiiClass(typeof(NoBuildArtifacts), "@aws-cdk/aws-codebuild.NoBuildArtifacts", "[]")]
    public class NoBuildArtifacts : BuildArtifacts
    {
        public NoBuildArtifacts(): base(new DeputyProps(new object[]{}))
        {
        }

        protected NoBuildArtifacts(ByRefValue reference): base(reference)
        {
        }

        protected NoBuildArtifacts(DeputyProps props): base(props)
        {
        }

        [JsiiMethod("toArtifactsJSON", "{\"fqn\":\"@aws-cdk/aws-codebuild.cloudformation.ProjectResource.ArtifactsProperty\"}", "[]")]
        public override IArtifactsProperty ToArtifactsJSON()
        {
            return InvokeInstanceMethod<IArtifactsProperty>(new object[]{});
        }
    }
}