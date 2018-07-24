using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ElasticLoadBalancingV2
{
    [JsiiClass(typeof(LoadBalancerFullName), "@aws-cdk/aws-elasticloadbalancingv2.LoadBalancerFullName", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class LoadBalancerFullName : Token
    {
        public LoadBalancerFullName(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected LoadBalancerFullName(ByRefValue reference): base(reference)
        {
        }

        protected LoadBalancerFullName(DeputyProps props): base(props)
        {
        }
    }
}