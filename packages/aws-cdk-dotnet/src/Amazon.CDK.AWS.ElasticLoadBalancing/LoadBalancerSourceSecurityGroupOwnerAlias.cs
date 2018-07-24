using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ElasticLoadBalancing
{
    [JsiiClass(typeof(LoadBalancerSourceSecurityGroupOwnerAlias), "@aws-cdk/aws-elasticloadbalancing.LoadBalancerSourceSecurityGroupOwnerAlias", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class LoadBalancerSourceSecurityGroupOwnerAlias : Token
    {
        public LoadBalancerSourceSecurityGroupOwnerAlias(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected LoadBalancerSourceSecurityGroupOwnerAlias(ByRefValue reference): base(reference)
        {
        }

        protected LoadBalancerSourceSecurityGroupOwnerAlias(DeputyProps props): base(props)
        {
        }
    }
}