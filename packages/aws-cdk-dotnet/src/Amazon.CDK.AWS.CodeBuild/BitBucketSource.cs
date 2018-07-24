using Amazon.CDK.AWS.CodeBuild.cloudformation.ProjectResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodeBuild
{
    /// <summary>BitBucket Source definition for a CodeBuild project</summary>
    [JsiiClass(typeof(BitBucketSource), "@aws-cdk/aws-codebuild.BitBucketSource", "[{\"name\":\"httpsCloneUrl\",\"type\":{\"primitive\":\"string\"}}]")]
    public class BitBucketSource : BuildSource
    {
        public BitBucketSource(string httpsCloneUrl): base(new DeputyProps(new object[]{httpsCloneUrl}))
        {
        }

        protected BitBucketSource(ByRefValue reference): base(reference)
        {
        }

        protected BitBucketSource(DeputyProps props): base(props)
        {
        }

        [JsiiMethod("toSourceJSON", "{\"fqn\":\"@aws-cdk/aws-codebuild.cloudformation.ProjectResource.SourceProperty\"}", "[]")]
        public override ISourceProperty ToSourceJSON()
        {
            return InvokeInstanceMethod<ISourceProperty>(new object[]{});
        }
    }
}