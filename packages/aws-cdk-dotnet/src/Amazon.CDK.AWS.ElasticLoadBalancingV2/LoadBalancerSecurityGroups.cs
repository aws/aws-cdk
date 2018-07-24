using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ElasticLoadBalancingV2
{
    [JsiiClass(typeof(LoadBalancerSecurityGroups), "@aws-cdk/aws-elasticloadbalancingv2.LoadBalancerSecurityGroups", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class LoadBalancerSecurityGroups : Token
    {
        public LoadBalancerSecurityGroups(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected LoadBalancerSecurityGroups(ByRefValue reference): base(reference)
        {
        }

        protected LoadBalancerSecurityGroups(DeputyProps props): base(props)
        {
        }
    }
}