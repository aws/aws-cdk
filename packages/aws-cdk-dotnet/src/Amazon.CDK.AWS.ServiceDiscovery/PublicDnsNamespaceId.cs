using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ServiceDiscovery
{
    [JsiiClass(typeof(PublicDnsNamespaceId), "@aws-cdk/aws-servicediscovery.PublicDnsNamespaceId", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class PublicDnsNamespaceId : Token
    {
        public PublicDnsNamespaceId(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected PublicDnsNamespaceId(ByRefValue reference): base(reference)
        {
        }

        protected PublicDnsNamespaceId(DeputyProps props): base(props)
        {
        }
    }
}