using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ElasticLoadBalancingV2
{
    [JsiiClass(typeof(LoadBalancerCanonicalHostedZoneId), "@aws-cdk/aws-elasticloadbalancingv2.LoadBalancerCanonicalHostedZoneId", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class LoadBalancerCanonicalHostedZoneId : Token
    {
        public LoadBalancerCanonicalHostedZoneId(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected LoadBalancerCanonicalHostedZoneId(ByRefValue reference): base(reference)
        {
        }

        protected LoadBalancerCanonicalHostedZoneId(DeputyProps props): base(props)
        {
        }
    }
}