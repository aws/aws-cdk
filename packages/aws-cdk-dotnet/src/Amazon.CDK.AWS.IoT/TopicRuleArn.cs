using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.IoT
{
    [JsiiClass(typeof(TopicRuleArn), "@aws-cdk/aws-iot.TopicRuleArn", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class TopicRuleArn : Arn
    {
        public TopicRuleArn(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected TopicRuleArn(ByRefValue reference): base(reference)
        {
        }

        protected TopicRuleArn(DeputyProps props): base(props)
        {
        }
    }
}