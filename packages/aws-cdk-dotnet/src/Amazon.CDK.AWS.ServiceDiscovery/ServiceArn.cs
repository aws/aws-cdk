using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ServiceDiscovery
{
    [JsiiClass(typeof(ServiceArn), "@aws-cdk/aws-servicediscovery.ServiceArn", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class ServiceArn : Arn
    {
        public ServiceArn(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected ServiceArn(ByRefValue reference): base(reference)
        {
        }

        protected ServiceArn(DeputyProps props): base(props)
        {
        }
    }
}