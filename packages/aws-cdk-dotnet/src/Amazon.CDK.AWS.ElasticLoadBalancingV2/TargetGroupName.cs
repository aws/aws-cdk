using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ElasticLoadBalancingV2
{
    [JsiiClass(typeof(TargetGroupName), "@aws-cdk/aws-elasticloadbalancingv2.TargetGroupName", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class TargetGroupName : Token
    {
        public TargetGroupName(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected TargetGroupName(ByRefValue reference): base(reference)
        {
        }

        protected TargetGroupName(DeputyProps props): base(props)
        {
        }
    }
}