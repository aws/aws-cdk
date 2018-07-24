using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ServiceDiscovery
{
    [JsiiClass(typeof(PublicDnsNamespaceArn), "@aws-cdk/aws-servicediscovery.PublicDnsNamespaceArn", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class PublicDnsNamespaceArn : Arn
    {
        public PublicDnsNamespaceArn(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected PublicDnsNamespaceArn(ByRefValue reference): base(reference)
        {
        }

        protected PublicDnsNamespaceArn(DeputyProps props): base(props)
        {
        }
    }
}