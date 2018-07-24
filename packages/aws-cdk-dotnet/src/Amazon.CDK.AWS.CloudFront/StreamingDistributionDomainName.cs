using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudFront
{
    [JsiiClass(typeof(StreamingDistributionDomainName), "@aws-cdk/aws-cloudfront.StreamingDistributionDomainName", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class StreamingDistributionDomainName : Token
    {
        public StreamingDistributionDomainName(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected StreamingDistributionDomainName(ByRefValue reference): base(reference)
        {
        }

        protected StreamingDistributionDomainName(DeputyProps props): base(props)
        {
        }
    }
}