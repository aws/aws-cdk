using Amazon.CDK.AWS.CodeBuild.cloudformation.ProjectResource;
using Amazon.CDK.AWS.CodeCommit;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodeBuild
{
    /// <summary>CodeCommit Source definition for a CodeBuild project</summary>
    [JsiiClass(typeof(CodeCommitSource), "@aws-cdk/aws-codebuild.CodeCommitSource", "[{\"name\":\"repo\",\"type\":{\"fqn\":\"@aws-cdk/aws-codecommit.Repository\"}}]")]
    public class CodeCommitSource : BuildSource
    {
        public CodeCommitSource(Repository repo): base(new DeputyProps(new object[]{repo}))
        {
        }

        protected CodeCommitSource(ByRefValue reference): base(reference)
        {
        }

        protected CodeCommitSource(DeputyProps props): base(props)
        {
        }

        /// <summary>
        /// Called by the project when the source is added so that the source can perform
        /// binding operations on the source. For example, it can grant permissions to the
        /// code build project to read from the S3 bucket.
        /// </summary>
        [JsiiMethod("bind", null, "[{\"name\":\"project\",\"type\":{\"fqn\":\"@aws-cdk/aws-codebuild.BuildProject\"}}]")]
        public override void Bind(BuildProject project)
        {
            InvokeInstanceVoidMethod(new object[]{project});
        }

        [JsiiMethod("toSourceJSON", "{\"fqn\":\"@aws-cdk/aws-codebuild.cloudformation.ProjectResource.SourceProperty\"}", "[]")]
        public override ISourceProperty ToSourceJSON()
        {
            return InvokeInstanceMethod<ISourceProperty>(new object[]{});
        }
    }
}