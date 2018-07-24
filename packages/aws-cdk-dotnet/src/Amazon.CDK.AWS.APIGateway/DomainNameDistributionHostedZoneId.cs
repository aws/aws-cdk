using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.APIGateway
{
    [JsiiClass(typeof(DomainNameDistributionHostedZoneId), "@aws-cdk/aws-apigateway.DomainNameDistributionHostedZoneId", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class DomainNameDistributionHostedZoneId : Token
    {
        public DomainNameDistributionHostedZoneId(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected DomainNameDistributionHostedZoneId(ByRefValue reference): base(reference)
        {
        }

        protected DomainNameDistributionHostedZoneId(DeputyProps props): base(props)
        {
        }
    }
}