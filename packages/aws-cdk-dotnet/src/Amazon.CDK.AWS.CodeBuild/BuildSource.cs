using Amazon.CDK.AWS.CodeBuild.cloudformation.ProjectResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodeBuild
{
    /// <summary>
    /// Source Provider definition for a CodeBuild project
    /// TODO: Abstract class should be an interface
    /// </summary>
    [JsiiClass(typeof(BuildSource), "@aws-cdk/aws-codebuild.BuildSource", "[]")]
    public abstract class BuildSource : DeputyBase
    {
        protected BuildSource(): base(new DeputyProps(new object[]{}))
        {
        }

        protected BuildSource(ByRefValue reference): base(reference)
        {
        }

        protected BuildSource(DeputyProps props): base(props)
        {
        }

        /// <summary>
        /// Called by the project when the source is added so that the source can perform
        /// binding operations on the source. For example, it can grant permissions to the
        /// code build project to read from the S3 bucket.
        /// </summary>
        [JsiiMethod("bind", null, "[{\"name\":\"_project\",\"type\":{\"fqn\":\"@aws-cdk/aws-codebuild.BuildProject\"}}]")]
        public virtual void Bind(BuildProject _project)
        {
            InvokeInstanceVoidMethod(new object[]{_project});
        }

        [JsiiMethod("toSourceJSON", "{\"fqn\":\"@aws-cdk/aws-codebuild.cloudformation.ProjectResource.SourceProperty\"}", "[]")]
        public abstract ISourceProperty ToSourceJSON();
    }
}