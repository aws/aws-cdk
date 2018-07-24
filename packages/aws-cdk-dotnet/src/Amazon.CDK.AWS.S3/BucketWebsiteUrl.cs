using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.S3
{
    [JsiiClass(typeof(BucketWebsiteUrl), "@aws-cdk/aws-s3.BucketWebsiteUrl", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class BucketWebsiteUrl : Token
    {
        public BucketWebsiteUrl(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected BucketWebsiteUrl(ByRefValue reference): base(reference)
        {
        }

        protected BucketWebsiteUrl(DeputyProps props): base(props)
        {
        }
    }
}