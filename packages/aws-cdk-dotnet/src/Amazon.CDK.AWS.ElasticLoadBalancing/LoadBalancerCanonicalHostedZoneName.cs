using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ElasticLoadBalancing
{
    [JsiiClass(typeof(LoadBalancerCanonicalHostedZoneName), "@aws-cdk/aws-elasticloadbalancing.LoadBalancerCanonicalHostedZoneName", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class LoadBalancerCanonicalHostedZoneName : Token
    {
        public LoadBalancerCanonicalHostedZoneName(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected LoadBalancerCanonicalHostedZoneName(ByRefValue reference): base(reference)
        {
        }

        protected LoadBalancerCanonicalHostedZoneName(DeputyProps props): base(props)
        {
        }
    }
}