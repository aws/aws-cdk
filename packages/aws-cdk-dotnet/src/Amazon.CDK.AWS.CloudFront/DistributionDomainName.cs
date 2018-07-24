using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudFront
{
    [JsiiClass(typeof(DistributionDomainName), "@aws-cdk/aws-cloudfront.DistributionDomainName", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class DistributionDomainName : Token
    {
        public DistributionDomainName(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected DistributionDomainName(ByRefValue reference): base(reference)
        {
        }

        protected DistributionDomainName(DeputyProps props): base(props)
        {
        }
    }
}