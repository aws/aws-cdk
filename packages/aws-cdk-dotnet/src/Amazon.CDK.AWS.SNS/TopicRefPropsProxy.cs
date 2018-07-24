using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SNS
{
    /// <summary>Reference to an external topic.</summary>
    [JsiiInterfaceProxy(typeof(ITopicRefProps), "@aws-cdk/aws-sns.TopicRefProps")]
    internal class TopicRefPropsProxy : DeputyBase, ITopicRefProps
    {
        private TopicRefPropsProxy(ByRefValue reference): base(reference)
        {
        }

        [JsiiProperty("topicArn", "{\"fqn\":\"@aws-cdk/aws-sns.TopicArn\"}")]
        public virtual TopicArn TopicArn
        {
            get => GetInstanceProperty<TopicArn>();
            set => SetInstanceProperty(value);
        }

        [JsiiProperty("topicName", "{\"fqn\":\"@aws-cdk/aws-sns.TopicName\"}")]
        public virtual TopicName TopicName
        {
            get => GetInstanceProperty<TopicName>();
            set => SetInstanceProperty(value);
        }
    }
}