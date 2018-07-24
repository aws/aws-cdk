using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SNS
{
    [JsiiClass(typeof(TopicName), "@aws-cdk/aws-sns.TopicName", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class TopicName : Token
    {
        public TopicName(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected TopicName(ByRefValue reference): base(reference)
        {
        }

        protected TopicName(DeputyProps props): base(props)
        {
        }
    }
}