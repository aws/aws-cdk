using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ElasticLoadBalancingV2
{
    [JsiiClass(typeof(TargetGroupLoadBalancerArns), "@aws-cdk/aws-elasticloadbalancingv2.TargetGroupLoadBalancerArns", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class TargetGroupLoadBalancerArns : Token
    {
        public TargetGroupLoadBalancerArns(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected TargetGroupLoadBalancerArns(ByRefValue reference): base(reference)
        {
        }

        protected TargetGroupLoadBalancerArns(DeputyProps props): base(props)
        {
        }
    }
}