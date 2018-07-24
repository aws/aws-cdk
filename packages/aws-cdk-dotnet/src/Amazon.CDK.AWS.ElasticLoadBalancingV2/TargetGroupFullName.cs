using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ElasticLoadBalancingV2
{
    [JsiiClass(typeof(TargetGroupFullName), "@aws-cdk/aws-elasticloadbalancingv2.TargetGroupFullName", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class TargetGroupFullName : Token
    {
        public TargetGroupFullName(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected TargetGroupFullName(ByRefValue reference): base(reference)
        {
        }

        protected TargetGroupFullName(DeputyProps props): base(props)
        {
        }
    }
}