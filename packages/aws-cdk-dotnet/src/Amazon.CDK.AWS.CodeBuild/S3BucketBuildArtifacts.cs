using Amazon.CDK.AWS.CodeBuild.cloudformation.ProjectResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodeBuild
{
    [JsiiClass(typeof(S3BucketBuildArtifacts), "@aws-cdk/aws-codebuild.S3BucketBuildArtifacts", "[{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-codebuild.S3BucketBuildArtifactsProps\"}}]")]
    public class S3BucketBuildArtifacts : BuildArtifacts
    {
        public S3BucketBuildArtifacts(IS3BucketBuildArtifactsProps props): base(new DeputyProps(new object[]{props}))
        {
        }

        protected S3BucketBuildArtifacts(ByRefValue reference): base(reference)
        {
        }

        protected S3BucketBuildArtifacts(DeputyProps props): base(props)
        {
        }

        [JsiiMethod("bind", null, "[{\"name\":\"project\",\"type\":{\"fqn\":\"@aws-cdk/aws-codebuild.BuildProject\"}}]")]
        public override void Bind(BuildProject project)
        {
            InvokeInstanceVoidMethod(new object[]{project});
        }

        [JsiiMethod("toArtifactsJSON", "{\"fqn\":\"@aws-cdk/aws-codebuild.cloudformation.ProjectResource.ArtifactsProperty\"}", "[]")]
        public override IArtifactsProperty ToArtifactsJSON()
        {
            return InvokeInstanceMethod<IArtifactsProperty>(new object[]{});
        }
    }
}