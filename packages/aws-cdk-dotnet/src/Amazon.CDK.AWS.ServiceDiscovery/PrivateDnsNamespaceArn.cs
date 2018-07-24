using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ServiceDiscovery
{
    [JsiiClass(typeof(PrivateDnsNamespaceArn), "@aws-cdk/aws-servicediscovery.PrivateDnsNamespaceArn", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class PrivateDnsNamespaceArn : Arn
    {
        public PrivateDnsNamespaceArn(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected PrivateDnsNamespaceArn(ByRefValue reference): base(reference)
        {
        }

        protected PrivateDnsNamespaceArn(DeputyProps props): base(props)
        {
        }
    }
}