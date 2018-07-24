using Amazon.CDK.AWS.CodeBuild.cloudformation.ProjectResource;
using Amazon.CDK.AWS.S3;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodeBuild
{
    /// <summary>S3 bucket definition for a CodeBuild project.</summary>
    [JsiiClass(typeof(S3BucketSource), "@aws-cdk/aws-codebuild.S3BucketSource", "[{\"name\":\"bucket\",\"type\":{\"fqn\":\"@aws-cdk/aws-s3.BucketRef\"}},{\"name\":\"path\",\"type\":{\"primitive\":\"string\"}}]")]
    public class S3BucketSource : BuildSource
    {
        public S3BucketSource(BucketRef bucket, string path): base(new DeputyProps(new object[]{bucket, path}))
        {
        }

        protected S3BucketSource(ByRefValue reference): base(reference)
        {
        }

        protected S3BucketSource(DeputyProps props): base(props)
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
        [JsiiMethod("bind", null, "[{\"name\":\"project\",\"type\":{\"fqn\":\"@aws-cdk/aws-codebuild.BuildProject\"}}]")]
        public override void Bind(BuildProject project)
        {
            InvokeInstanceVoidMethod(new object[]{project});
        }
    }
}