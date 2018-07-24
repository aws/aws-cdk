using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Events
{
    [JsiiClass(typeof(RuleArn), "@aws-cdk/aws-events.RuleArn", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class RuleArn : Arn
    {
        public RuleArn(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected RuleArn(ByRefValue reference): base(reference)
        {
        }

        protected RuleArn(DeputyProps props): base(props)
        {
        }
    }
}