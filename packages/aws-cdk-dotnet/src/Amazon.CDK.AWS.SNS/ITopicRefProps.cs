using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SNS
{
    /// <summary>Reference to an external topic.</summary>
    [JsiiInterface(typeof(ITopicRefProps), "@aws-cdk/aws-sns.TopicRefProps")]
    public interface ITopicRefProps
    {
        [JsiiProperty("topicArn", "{\"fqn\":\"@aws-cdk/aws-sns.TopicArn\"}")]
        TopicArn TopicArn
        {
            get;
            set;
        }

        [JsiiProperty("topicName", "{\"fqn\":\"@aws-cdk/aws-sns.TopicName\"}")]
        TopicName TopicName
        {
            get;
            set;
        }
    }
}