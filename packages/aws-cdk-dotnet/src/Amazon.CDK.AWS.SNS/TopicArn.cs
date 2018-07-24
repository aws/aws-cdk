using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SNS
{
    /// <summary>ARN of a Topic</summary>
    [JsiiClass(typeof(TopicArn), "@aws-cdk/aws-sns.TopicArn", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class TopicArn : Arn
    {
        public TopicArn(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected TopicArn(ByRefValue reference): base(reference)
        {
        }

        protected TopicArn(DeputyProps props): base(props)
        {
        }
    }
}