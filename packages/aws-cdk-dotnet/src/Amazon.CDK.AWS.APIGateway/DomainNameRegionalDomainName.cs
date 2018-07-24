using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.APIGateway
{
    [JsiiClass(typeof(DomainNameRegionalDomainName), "@aws-cdk/aws-apigateway.DomainNameRegionalDomainName", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class DomainNameRegionalDomainName : Token
    {
        public DomainNameRegionalDomainName(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected DomainNameRegionalDomainName(ByRefValue reference): base(reference)
        {
        }

        protected DomainNameRegionalDomainName(DeputyProps props): base(props)
        {
        }
    }
}