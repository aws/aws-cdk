using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ElasticLoadBalancing
{
    [JsiiClass(typeof(LoadBalancerSourceSecurityGroupGroupName), "@aws-cdk/aws-elasticloadbalancing.LoadBalancerSourceSecurityGroupGroupName", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class LoadBalancerSourceSecurityGroupGroupName : Token
    {
        public LoadBalancerSourceSecurityGroupGroupName(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected LoadBalancerSourceSecurityGroupGroupName(ByRefValue reference): base(reference)
        {
        }

        protected LoadBalancerSourceSecurityGroupGroupName(DeputyProps props): base(props)
        {
        }
    }
}