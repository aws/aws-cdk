using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ElasticLoadBalancing
{
    [JsiiClass(typeof(LoadBalancerDnsName), "@aws-cdk/aws-elasticloadbalancing.LoadBalancerDnsName", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class LoadBalancerDnsName : Token
    {
        public LoadBalancerDnsName(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected LoadBalancerDnsName(ByRefValue reference): base(reference)
        {
        }

        protected LoadBalancerDnsName(DeputyProps props): base(props)
        {
        }
    }
}