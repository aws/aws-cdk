using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.S3
{
    [JsiiClass(typeof(BucketDualStackDomainName), "@aws-cdk/aws-s3.BucketDualStackDomainName", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class BucketDualStackDomainName : Token
    {
        public BucketDualStackDomainName(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected BucketDualStackDomainName(ByRefValue reference): base(reference)
        {
        }

        protected BucketDualStackDomainName(DeputyProps props): base(props)
        {
        }
    }
}