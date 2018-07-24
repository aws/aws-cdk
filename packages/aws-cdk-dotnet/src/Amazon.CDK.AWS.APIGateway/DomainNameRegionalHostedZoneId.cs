using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.APIGateway
{
    [JsiiClass(typeof(DomainNameRegionalHostedZoneId), "@aws-cdk/aws-apigateway.DomainNameRegionalHostedZoneId", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class DomainNameRegionalHostedZoneId : Token
    {
        public DomainNameRegionalHostedZoneId(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected DomainNameRegionalHostedZoneId(ByRefValue reference): base(reference)
        {
        }

        protected DomainNameRegionalHostedZoneId(DeputyProps props): base(props)
        {
        }
    }
}