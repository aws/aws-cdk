using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.S3
{
    [JsiiClass(typeof(BucketDomainName), "@aws-cdk/aws-s3.BucketDomainName", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class BucketDomainName : Token
    {
        public BucketDomainName(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected BucketDomainName(ByRefValue reference): base(reference)
        {
        }

        protected BucketDomainName(DeputyProps props): base(props)
        {
        }
    }
}