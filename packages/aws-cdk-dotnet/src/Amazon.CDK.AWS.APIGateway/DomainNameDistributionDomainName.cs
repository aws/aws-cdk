using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.APIGateway
{
    [JsiiClass(typeof(DomainNameDistributionDomainName), "@aws-cdk/aws-apigateway.DomainNameDistributionDomainName", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class DomainNameDistributionDomainName : Token
    {
        public DomainNameDistributionDomainName(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected DomainNameDistributionDomainName(ByRefValue reference): base(reference)
        {
        }

        protected DomainNameDistributionDomainName(DeputyProps props): base(props)
        {
        }
    }
}