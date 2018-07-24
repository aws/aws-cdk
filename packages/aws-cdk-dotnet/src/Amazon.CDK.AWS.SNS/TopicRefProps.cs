using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SNS
{
    /// <summary>Reference to an external topic.</summary>
    public class TopicRefProps : DeputyBase, ITopicRefProps
    {
        [JsiiProperty("topicArn", "{\"fqn\":\"@aws-cdk/aws-sns.TopicArn\"}", true)]
        public TopicArn TopicArn
        {
            get;
            set;
        }

        [JsiiProperty("topicName", "{\"fqn\":\"@aws-cdk/aws-sns.TopicName\"}", true)]
        public TopicName TopicName
        {
            get;
            set;
        }
    }
}