using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.S3
{
    /// <summary>The name of the bucket.</summary>
    [JsiiClass(typeof(BucketName), "@aws-cdk/aws-s3.BucketName", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class BucketName : Token
    {
        public BucketName(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected BucketName(ByRefValue reference): base(reference)
        {
        }

        protected BucketName(DeputyProps props): base(props)
        {
        }
    }
}