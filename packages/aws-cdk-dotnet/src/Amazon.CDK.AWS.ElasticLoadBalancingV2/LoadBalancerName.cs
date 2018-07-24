using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ElasticLoadBalancingV2
{
    [JsiiClass(typeof(LoadBalancerName), "@aws-cdk/aws-elasticloadbalancingv2.LoadBalancerName", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class LoadBalancerName : Token
    {
        public LoadBalancerName(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected LoadBalancerName(ByRefValue reference): base(reference)
        {
        }

        protected LoadBalancerName(DeputyProps props): base(props)
        {
        }
    }
}