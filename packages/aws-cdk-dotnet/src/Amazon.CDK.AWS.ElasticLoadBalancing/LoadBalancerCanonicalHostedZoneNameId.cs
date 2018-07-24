using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ElasticLoadBalancing
{
    [JsiiClass(typeof(LoadBalancerCanonicalHostedZoneNameId), "@aws-cdk/aws-elasticloadbalancing.LoadBalancerCanonicalHostedZoneNameId", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class LoadBalancerCanonicalHostedZoneNameId : Token
    {
        public LoadBalancerCanonicalHostedZoneNameId(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected LoadBalancerCanonicalHostedZoneNameId(ByRefValue reference): base(reference)
        {
        }

        protected LoadBalancerCanonicalHostedZoneNameId(DeputyProps props): base(props)
        {
        }
    }
}