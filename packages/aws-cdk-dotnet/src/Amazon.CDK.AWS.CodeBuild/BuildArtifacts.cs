using Amazon.CDK.AWS.CodeBuild.cloudformation.ProjectResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodeBuild
{
    [JsiiClass(typeof(BuildArtifacts), "@aws-cdk/aws-codebuild.BuildArtifacts", "[]")]
    public abstract class BuildArtifacts : DeputyBase
    {
        protected BuildArtifacts(): base(new DeputyProps(new object[]{}))
        {
        }

        protected BuildArtifacts(ByRefValue reference): base(reference)
        {
        }

        protected BuildArtifacts(DeputyProps props): base(props)
        {
        }

        [JsiiMethod("toArtifactsJSON", "{\"fqn\":\"@aws-cdk/aws-codebuild.cloudformation.ProjectResource.ArtifactsProperty\"}", "[]")]
        public abstract IArtifactsProperty ToArtifactsJSON();
        [JsiiMethod("bind", null, "[{\"name\":\"_project\",\"type\":{\"fqn\":\"@aws-cdk/aws-codebuild.BuildProject\"}}]")]
        public virtual void Bind(BuildProject _project)
        {
            InvokeInstanceVoidMethod(new object[]{_project});
        }
    }
}