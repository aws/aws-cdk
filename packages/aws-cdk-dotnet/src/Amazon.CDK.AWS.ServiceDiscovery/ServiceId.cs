using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ServiceDiscovery
{
    [JsiiClass(typeof(ServiceId), "@aws-cdk/aws-servicediscovery.ServiceId", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class ServiceId : Token
    {
        public ServiceId(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected ServiceId(ByRefValue reference): base(reference)
        {
        }

        protected ServiceId(DeputyProps props): base(props)
        {
        }
    }
}