using Amazon.CDK.AWS.CodeBuild.cloudformation.ProjectResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodeBuild
{
    /// <summary>CodePipeline Source definition for a CodeBuild project</summary>
    [JsiiClass(typeof(CodePipelineSource), "@aws-cdk/aws-codebuild.CodePipelineSource", "[]")]
    public class CodePipelineSource : BuildSource
    {
        public CodePipelineSource(): base(new DeputyProps(new object[]{}))
        {
        }

        protected CodePipelineSource(ByRefValue reference): base(reference)
        {
        }

        protected CodePipelineSource(DeputyProps props): base(props)
        {
        }

        [JsiiMethod("toSourceJSON", "{\"fqn\":\"@aws-cdk/aws-codebuild.cloudformation.ProjectResource.SourceProperty\"}", "[]")]
        public override ISourceProperty ToSourceJSON()
        {
            return InvokeInstanceMethod<ISourceProperty>(new object[]{});
        }

        /// <summary>
        /// Called by the project when the source is added so that the source can perform
        /// binding operations on the source. For example, it can grant permissions to the
        /// code build project to read from the S3 bucket.
        /// </summary>
        [JsiiMethod("bind", null, "[{\"name\":\"_project\",\"type\":{\"fqn\":\"@aws-cdk/aws-codebuild.BuildProject\"}}]")]
        public override void Bind(BuildProject _project)
        {
            InvokeInstanceVoidMethod(new object[]{_project});
        }
    }
}