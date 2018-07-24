using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodePipeline
{
    /// <summary>Source that is provided by a specific Amazon S3 object</summary>
    [JsiiClass(typeof(AmazonS3Source), "@aws-cdk/aws-codepipeline.AmazonS3Source", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/aws-codepipeline.Stage\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-codepipeline.AmazonS3SourceProps\"}}]")]
    public class AmazonS3Source : Source
    {
        public AmazonS3Source(Stage parent, string name, IAmazonS3SourceProps props): base(new DeputyProps(new object[]{parent, name, props}))
        {
        }

        protected AmazonS3Source(ByRefValue reference): base(reference)
        {
        }

        protected AmazonS3Source(DeputyProps props): base(props)
        {
        }
    }
}