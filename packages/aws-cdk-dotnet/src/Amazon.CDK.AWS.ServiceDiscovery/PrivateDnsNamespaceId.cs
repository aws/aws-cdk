using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ServiceDiscovery
{
    [JsiiClass(typeof(PrivateDnsNamespaceId), "@aws-cdk/aws-servicediscovery.PrivateDnsNamespaceId", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class PrivateDnsNamespaceId : Token
    {
        public PrivateDnsNamespaceId(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected PrivateDnsNamespaceId(ByRefValue reference): base(reference)
        {
        }

        protected PrivateDnsNamespaceId(DeputyProps props): base(props)
        {
        }
    }
}