using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ServiceDiscovery
{
    [JsiiClass(typeof(ServiceName), "@aws-cdk/aws-servicediscovery.ServiceName", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class ServiceName : Token
    {
        public ServiceName(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected ServiceName(ByRefValue reference): base(reference)
        {
        }

        protected ServiceName(DeputyProps props): base(props)
        {
        }
    }
}